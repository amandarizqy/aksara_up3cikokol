<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Login - Digita PLN</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-primary d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow p-4" style="width: 400px;">
        <h3 class="text-center mb-3 fw-bold text-primary">DIGITA S41</h3>
        <p class="text-center text-muted small">Silakan login untuk masuk sistem</p>

        <?php if (!empty($error)): ?>
            <div class="alert alert-danger py-2 small"><?= $error; ?></div>
        <?php endif; ?>

        <form action="" method="POST">
            <div class="mb-3">
                <label class="form-label fw-bold small">Nama Akun (Username)</label>
                <input type="text" name="NamaAkun" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold small">Kata Kunci (Password)</label>
                <input type="password" name="KataKunci" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100 fw-bold">LOGIN</button>
        </form>
    </div>
</body>
</html>