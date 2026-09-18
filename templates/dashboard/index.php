<?php
session_start();
// Cek apakah sudah login
if (!isset($_SESSION['NamaAkun'])) {
    header("Location: ../auth/login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - Digita PLN</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="card shadow-sm p-4">
            <h3 class="fw-bold text-primary">Selamat Datang, <?= htmlspecialchars($_SESSION['NamaPengguna']); ?>!</h3>
            <p class="text-muted">Anda login sebagai: <span class="badge bg-secondary"><?= htmlspecialchars($_SESSION['NamaHak'] ?? 'Pengguna'); ?></span> (Kode Hak: <?= htmlspecialchars($_SESSION['KodeHak']); ?>)</p>
            
            <hr>

            <!-- Contoh Pembatasan Hak Akses Berdasarkan KodeHak -->
            <?php if ($_SESSION['KodeHak'] === 'SUP'): ?>
                <div class="alert alert-success">
                    <i class="bi bi-shield-check"></i> Panel Khusus Superuser: Anda memiliki akses penuh untuk mengelola konfigurasi sistem dan seluruh unit.
                </div>
            <?php else: ?>
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Anda masuk dengan hak akses standar unit (**Unit UP: <?= htmlspecialchars($_SESSION['UnitUp']); ?>**).
                </div>
            <?php endif; ?>

            <div class="mt-3">
                <a href="../../modules/auth/logout.php" class="btn btn-danger btn-sm"><i class="bi bi-box-arrow-right"></i> Logout</a>
            </div>
        </div>
    </div>
</body>
</html>