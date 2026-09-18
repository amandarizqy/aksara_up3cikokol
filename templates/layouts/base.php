<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page_title ?? 'Digita - PLN' ?></title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
</head>
<body class="bg-light">
    
    <div class="wrapper d-flex">
        <!-- Sidebar -->
        <?php include_once __DIR__ . '/../../includes/sidebar.php'; ?>

        <div class="main-content w-100">
            <!-- Navbar -->
            <?php include_once __DIR__ . '/../../includes/navbar.php'; ?>

            <!-- Content Body -->
            <main class="container-fluid p-4">
                <?php echo $content ?? ''; ?>
            </main>
        </div>
    </div>

    <!-- Bootstrap JS Bundle CDN -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>