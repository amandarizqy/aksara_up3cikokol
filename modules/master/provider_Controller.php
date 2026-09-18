<?php
session_start();

// Hubungkan ke koneksi database & pengecekan auth
require_once __DIR__ . '/../../config/database.php';
if (file_exists(__DIR__ . '/../../includes/auth_check.php')) {
    require_once __DIR__ . '/../../includes/auth_check.php';
}

// Catatan Hak Akses: Sesuai matriks otorisasi, menu Master Provider diperuntukkan bagi role SF.UI
// Jika sedang tahap pengujian/development dan belum login dengan role tersebut, baris pengecekan ini dapat disesuaikan.
if (isset($_SESSION['role']) && $_SESSION['role'] !== 'SF.UI') {
    http_response_code(403);
    die("Akses ditolak: Anda tidak memiliki hak akses (SF.UI) untuk menu ini.");
}

$action = $_GET['action'] ?? 'index';

switch ($action) {
    case 'index':
        // Mengambil seluruh data dari tabel master_provider
        $query = "SELECT KodeProvider, NamaProvider, StatusData, WaktuData FROM master_provider ORDER BY KodeProvider ASC";
        $result = mysqli_query($conn, $query);
        
        $providers = [];
        if ($result) {
            $providers = mysqli_fetch_all($result, MYSQLI_ASSOC);
        }

        // Panggil template tampilan
        include __DIR__ . '/../../templates/master/provider.php';
        break;

    case 'store':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $namaProvider = trim($_POST['NamaProvider'] ?? '');
            $statusData   = $_POST['StatusData'] ?? 'AKTIF';

            if (!empty($namaProvider)) {
                $stmt = mysqli_prepare($conn, "INSERT INTO master_provider (NamaProvider, StatusData, WaktuData) VALUES (?, ?, NOW())");
                if ($stmt) {
                    mysqli_stmt_bind_param($stmt, "ss", $namaProvider, $statusData);
                    mysqli_stmt_execute($stmt);
                    mysqli_stmt_close($stmt);
                }
            }
        }
        header('Location: provider_Controller.php?action=index');
        exit;

    case 'update':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $kodeProvider = (int)($_POST['KodeProvider'] ?? 0);
            $namaProvider = trim($_POST['NamaProvider'] ?? '');
            $statusData   = $_POST['StatusData'] ?? 'AKTIF';

            if ($kodeProvider > 0 && !empty($namaProvider)) {
                $stmt = mysqli_prepare($conn, "UPDATE master_provider SET NamaProvider = ?, StatusData = ?, WaktuData = NOW() WHERE KodeProvider = ?");
                if ($stmt) {
                    mysqli_stmt_bind_param($stmt, "ssi", $namaProvider, $statusData, $kodeProvider);
                    mysqli_stmt_execute($stmt);
                    mysqli_stmt_close($stmt);
                }
            }
        }
        header('Location: provider_Controller.php?action=index');
        exit;

    case 'delete':
        $kodeProvider = (int)($_GET['id'] ?? 0);
        if ($kodeProvider > 0) {
            $stmt = mysqli_prepare($conn, "DELETE FROM master_provider WHERE KodeProvider = ?");
            if ($stmt) {
                mysqli_stmt_bind_param($stmt, "i", $kodeProvider);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);
            }
        }
        header('Location: provider_Controller.php?action=index');
        exit;

    default:
        header('Location: provider_Controller.php?action=index');
        exit;
}