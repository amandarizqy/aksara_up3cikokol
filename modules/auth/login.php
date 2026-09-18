<?php
session_start();
require_once '../../config/database.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama_akun = trim($_POST['NamaAkun']);
    $kata_kunci = trim($_POST['KataKunci']);

    if (!empty($nama_akun) && !empty($kata_kunci)) {
        // Ambil data pengguna dan JOIN ke tabel hak_akses untuk membaca level/nama hak akses
        $stmt = $conn->prepare("
            SELECT p.*, h.NamaHak 
            FROM master_pengguna p 
            LEFT JOIN hak_akses h ON p.KodeHak = h.KodeHak 
            WHERE p.NamaAkun = ? AND p.StatusData = 'AKTIF'
        ");
        $stmt->execute([$nama_akun]);
        $user = $stmt->fetch();

        // Verifikasi akun dan password
        if ($user && ($kata_kunci === $user['KataKunci'])) {
            // Set Session berdasarkan database mentor
            $_SESSION['NamaAkun'] = $user['NamaAkun'];
            $_SESSION['NamaPengguna'] = $user['NamaPengguna'];
            $_SESSION['KodeHak'] = $user['KodeHak']; // Kode hak akses (misal: 'SUP')
            $_SESSION['NamaHak'] = $user['NamaHak'];
            $_SESSION['UnitUp'] = $user['UnitUp'];
            $_SESSION['UnitAp'] = $user['UnitAp'];
            $_SESSION['UnitUpi'] = $user['UnitUpi'];

            // PERBAIKAN: Gunakan $_SESSION['KodeHak'] sesuai yang diset di atas
            if ($_SESSION['KodeHak'] == 'SUP') {
                // Superadmin langsung diarahkan ke halaman utama Master Unit
                header("Location: ../../templates/master/unit.php");
                exit;
            } else {
                // User biasa diarahkan ke dashboard unit masing-masing
                header("Location: ../../templates/dashboard/index.php");
                exit;
            }
        } else {
            $error = "Nama Akun atau Kata Kunci salah, atau akun tidak aktif!";
        }
    } else {
        $error = "Semua kolom wajib diisi!";
    }
}

// Panggil tampilan form login
require_once '../../templates/auth/login.php';
?>