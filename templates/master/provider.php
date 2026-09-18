<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Provider - Digita Asset Lifecycle</title>
    
    <!-- Bootstrap 5, Icons & Fonts -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --navy: #0d1527;
            --navy-surface: #131c31;
            --sidebar-active: #f97316;
            --orange: #f97316;
            --orange-soft: #fff7ed;
            --bg: #f8fafc;
            --card: #ffffff;
            --border: #e2e8f0;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --green: #10b981;
            --green-soft: #ecfdf5;
            --font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        * {
            box-sizing: border-box;
            font-family: var(--font-family);
        }

        body {
            background-color: var(--bg);
            color: var(--text-main);
            margin: 0;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        /* Sidebar Styling */
        .sidebar {
            width: 250px;
            background-color: var(--navy);
            color: #94a3b8;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            border-right: 1px solid #1e293b;
        }

        .sidebar-brand {
            padding: 24px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #fff;
        }

        .brand-icon {
            width: 34px;
            height: 34px;
            background: var(--orange);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
        }

        .sidebar-menu {
            flex-grow: 1;
            overflow-y: auto;
            padding: 0 12px;
        }

        .menu-category {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: #475569;
            padding: 14px 12px 6px;
            text-transform: uppercase;
        }

        .menu-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            color: #94a3b8;
            text-decoration: none;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            margin-bottom: 2px;
            transition: all 0.2s;
        }

        .menu-item:hover {
            background: rgba(255, 255, 255, 0.05);
            color: #f1f5f9;
        }

        .menu-item.active {
            background: var(--sidebar-active);
            color: #ffffff;
            font-weight: 600;
        }

        .menu-item.active .menu-indicator {
            width: 6px;
            height: 6px;
            background: #fff;
            border-radius: 50%;
        }

        .user-profile-badge {
            background: var(--navy-surface);
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-top: 1px solid #1e293b;
        }

        .user-avatar {
            width: 36px;
            height: 36px;
            background: #2563eb;
            color: #fff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.85rem;
        }

        /* Main Content Styling */
        .main-wrapper {
            flex-grow: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            padding: 24px 32px 40px;
        }

        .top-badge-nav {
            display: inline-block;
            background-color: var(--orange);
            color: white;
            padding: 4px 14px;
            font-size: 0.75rem;
            font-weight: 700;
            border-radius: 6px;
            margin-bottom: 12px;
        }

        .breadcrumb-sub {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-bottom: 6px;
        }

        .live-tag {
            background: #ecfdf5;
            color: var(--green);
            padding: 2px 8px;
            border-radius: 20px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .stat-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px 22px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
            height: 100%;
        }

        .stat-card-title {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            text-transform: uppercase;
        }

        .stat-card-val {
            font-size: 1.65rem;
            font-weight: 800;
            color: var(--text-main);
            margin-top: 4px;
        }

        .table-container {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .table thead th {
            background-color: #fafbfc;
            border-bottom: 1px solid var(--border);
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 14px 20px;
        }

        .table tbody td {
            padding: 16px 20px;
            vertical-align: middle;
            font-size: 0.88rem;
            border-bottom: 1px solid #f1f5f9;
        }

        .badge-sub-network {
            background-color: #fef2f2;
            color: #dc2626;
            border: 1px solid #fee2e2;
            padding: 3px 8px;
            font-size: 0.7rem;
            font-weight: 600;
            border-radius: 4px;
            margin-left: 8px;
            display: inline-block;
        }

        .badge-sub-network.blue {
            background-color: #eff6ff;
            color: #2563eb;
            border-color: #dbeafe;
        }

        .badge-sub-network.purple {
            background-color: #faf5ff;
            color: #7c3aed;
            border-color: #f3e8ff;
        }

        .badge-sub-network.yellow {
            background-color: #fefce8;
            color: #ca8a04;
            border-color: #fef9c3;
        }

        .status-dot-active {
            color: var(--green);
            font-weight: 700;
            font-size: 0.78rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .dot-circle {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
        }

        /* Custom Switch */
        .form-check-input:checked {
            background-color: var(--green);
            border-color: var(--green);
        }

        .btn-sync {
            border: 1px solid var(--border);
            background: #fff;
            font-weight: 600;
            font-size: 0.85rem;
            color: var(--text-main);
            padding: 8px 16px;
            border-radius: 8px;
        }

        .btn-add {
            background-color: var(--orange);
            color: white;
            font-weight: 600;
            font-size: 0.85rem;
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
        }

        .btn-add:hover {
            background-color: #ea580c;
            color: white;
        }
    </style>
</head>
<body>

    <!-- Sidebar Menu -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <div class="brand-icon"><i class="bi bi-lightning-charge-fill"></i></div>
            <div>
                <div class="fw-bold fs-6 lh-1">Digita <span class="badge bg-secondary" style="font-size:0.6rem;">v2.4</span></div>
                <div style="font-size: 0.7rem; color: #64748b;">Asset Lifecycle System</div>
            </div>
        </div>

        <div class="sidebar-menu">
            <div class="menu-category">Siklus Aset PLN</div>
            <a href="#" class="menu-item active">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-database"></i> Master Data</span>
                <span class="menu-indicator"></span>
            </a>
            <a href="#" class="menu-item">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-graph-up"></i> Perencanaan & Risiko</span>
            </a>
            <a href="#" class="menu-item">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-box-seam"></i> Pengadaan & Logistik</span>
            </a>
            <a href="#" class="menu-item">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-lightning"></i> Pemasangan (Deployment)</span>
            </a>
            <a href="#" class="menu-item">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-sliders"></i> Penggunaan & Operasional</span>
            </a>
            <a href="#" class="menu-item">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-tools"></i> Pemeliharaan</span>
            </a>
            <a href="#" class="menu-item">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-trash"></i> Penghapusan</span>
            </a>
            <a href="#" class="menu-item">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-file-earmark-text"></i> Laporan & Rekap</span>
            </a>
            <a href="#" class="menu-item">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-gear"></i> Pengaturan & Bot</span>
            </a>
        </div>

        <div class="user-profile-badge">
            <div class="user-avatar">SN</div>
            <div class="flex-grow-1 overflow-hidden">
                <div class="fw-bold text-white text-truncate" style="font-size: 0.8rem;">Siti Nurhaliza</div>
                <div class="small" style="font-size: 0.7rem; color: #38bdf8;"><i class="bi bi-check-circle-fill me-1"></i>SF.UI (Staf UI)</div>
            </div>
            <a href="../../modules/auth/logout.php" class="text-secondary"><i class="bi bi-box-arrow-right"></i></a>
        </div>
    </aside>

    <!-- Main Workspace -->
    <main class="main-wrapper">
        <span class="top-badge-nav">Provider</span>

        <!-- Header Controls -->
        <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
            <div>
                <div class="breadcrumb-sub">
                    <span>MST - 2026 - Q1</span> &bull; 
                    <span>Master Data Provider Seluler & M2M</span> &bull; 
                    <span class="live-tag"><span class="dot-circle bg-success" style="width:6px; height:6px;"></span> Gateway Network Live</span>
                </div>
                <h3 class="fw-bold mb-1 d-flex align-items-center gap-2" style="color: var(--navy);">
                    Kelola Master Provider Seluler (SMS Gateway S41)
                    <span class="badge" style="font-size:0.65rem; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;">
                        <i class="bi bi-shield-lock-fill me-1"></i>SF.UI AUTHORIZED
                    </span>
                </h3>
                <p class="text-muted small mb-0">Pusat registrasi dan tata kelola operator seluler (M2M/GSM) untuk transmisi data telemetri dan SMS gateway S41.</p>
            </div>

            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sync d-flex align-items-center gap-2" onclick="location.reload();">
                    <i class="bi bi-arrow-repeat"></i> Sinkronisasi Status Jaringan
                </button>
                <button class="btn btn-add d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#modalTambah">
                    <i class="bi bi-plus-lg"></i> Tambah Provider
                </button>
            </div>
        </div>

        <!-- 3 Cards Matrix -->
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="stat-card-title">Total Provider Terdaftar</div>
                        <i class="bi bi-broadcast text-primary fs-5"></i>
                    </div>
                    <div class="stat-card-val"><?= isset($providers) ? count($providers) : 0; ?> Operator</div>
                    <div class="text-muted small" style="font-size: 0.75rem;">Sesuai data master_provider aktif</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="stat-card-title">Status Layanan Jaringan</div>
                        <i class="bi bi-lightning-charge text-success fs-5"></i>
                    </div>
                    <div class="stat-card-val text-success">100% Aktif</div>
                    <div class="text-muted small" style="font-size: 0.75rem;">
                        <span class="dot-circle bg-success" style="width:6px; height:6px;"></span> Latensi Rata-rata: 42ms &bull; Uptime 99.9%
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="stat-card-title">SIM Aktif Terhubung</div>
                        <i class="bi bi-sim text-warning fs-5"></i>
                    </div>
                    <div class="stat-card-val" style="color: var(--navy);">2,410 SIM M2M</div>
                    <div class="text-muted small" style="font-size: 0.75rem;">Tersebar di Modul Relai Lapangan</div>
                </div>
            </div>
        </div>

        <!-- Filter Bar -->
        <div class="row g-2 align-items-center mb-3">
            <div class="col-md-5">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" id="searchInput" class="form-control border-start-0 bg-white" placeholder="Cari Nama Provider / Kode..." onkeyup="filterTable()">
                </div>
            </div>
            <div class="col-md-4">
                <select class="form-select bg-white" id="filterStatus" onchange="filterTable()">
                    <option value="">Semua Status (AKTIF / NONAKTIF)</option>
                    <option value="AKTIF">AKTIF</option>
                    <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                </select>
            </div>
            <div class="col-md-3 text-end d-flex justify-content-end gap-2">
                <button class="btn btn-outline-secondary border-0 text-muted fw-semibold small" onclick="resetFilter()">Reset</button>
                <button class="btn btn-light border fw-semibold small text-muted"><i class="bi bi-download me-1"></i> Export CSV</button>
            </div>
        </div>

        <!-- Data Table Card -->
        <div class="table-container">
            <div class="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold" style="font-size:0.8rem; letter-spacing:0.04em;">DAFTAR MASTER PROVIDER SELULER S41</span>
                    <span class="badge" style="background-color: #f1f5f9; color: #2563eb; font-weight: 600; font-size: 0.65rem;">
                        <i class="bi bi-shield-lock-fill me-1"></i> Akses Terbuka: Staf Unit Induk (SF.UI)
                    </span>
                </div>
                <div class="text-muted small" style="font-size: 0.75rem;">
                    Menampilkan <?= isset($providers) ? count($providers) : 0; ?> operator seluler aktif
                </div>
            </div>

            <table class="table mb-0" id="providerTable">
                <thead>
                    <tr>
                        <th style="width: 50px;">NO</th>
                        <th style="width: 120px;">KODE PROVIDER</th>
                        <th>NAMA PROVIDER</th>
                        <th style="width: 150px;">STATUS DATA</th>
                        <th style="width: 220px;">WAKTU DATA</th>
                        <th class="text-end" style="width: 120px;">AKSI</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $tags = [
                        'Telkomsel' => ['tag' => 'Enterprise M2M', 'class' => ''],
                        'Indosat Ooredoo Hutchison' => ['tag' => 'IoT Direct', 'class' => 'yellow'],
                        'Tri (3)' => ['tag' => 'Network 3', 'class' => 'yellow'],
                        'XL Axiata' => ['tag' => 'Dedicated IoT', 'class' => 'blue'],
                        'AXIS' => ['tag' => 'Secondary Pool', 'class' => 'purple'],
                        'Smartfren' => ['tag' => 'M2M 4G LTE', 'class' => '']
                    ];
                    $operatorDots = [
                        'Telkomsel' => '#ef4444',
                        'Indosat Ooredoo Hutchison' => '#eab308',
                        'Tri (3)' => '#f97316',
                        'XL Axiata' => '#3b82f6',
                        'AXIS' => '#8b5cf6',
                        'Smartfren' => '#ec4899'
                    ];
                    ?>
                    <?php if (!empty($providers)): ?>
                        <?php $no = 1; foreach ($providers as $row): ?>
                        <tr>
                            <td class="text-muted fw-semibold"><?= $no++; ?></td>
                            <td class="fw-bold" style="color: var(--navy);"><?= htmlspecialchars($row['KodeProvider']); ?></td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <span class="dot-circle me-2" style="background-color: <?= $operatorDots[$row['NamaProvider']] ?? '#64748b'; ?>;"></span>
                                    <span class="fw-bold" style="color: var(--navy);"><?= htmlspecialchars($row['NamaProvider']); ?></span>
                                    <?php if (isset($tags[$row['NamaProvider']])): ?>
                                        <span class="badge-sub-network <?= $tags[$row['NamaProvider']]['class']; ?>">
                                            <?= $tags[$row['NamaProvider']]['tag']; ?>
                                        </span>
                                    <?php endif; ?>
                                </div>
                            </td>
                            <td>
                                <span class="status-dot-active">
                                    <span class="dot-circle <?= $row['StatusData'] === 'AKTIF' ? 'bg-success' : 'bg-danger'; ?>"></span>
                                    <?= htmlspecialchars($row['StatusData']); ?>
                                </span>
                            </td>
                            <td class="text-muted small">
                                <?= htmlspecialchars($row['WaktuData']); ?>
                            </td>
                            <td class="text-end">
                                <div class="d-inline-flex align-items-center gap-3">
                                    <!-- Tombol Edit -->
                                    <button class="btn btn-link p-0 text-muted" 
                                            onclick="editProvider('<?= $row['KodeProvider']; ?>', '<?= htmlspecialchars(addslashes($row['NamaProvider'])); ?>', '<?= $row['StatusData']; ?>')">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <!-- Switch Active Toggle -->
                                    <div class="form-check form-switch mb-0">
                                        <input class="form-check-input" type="checkbox" role="switch" <?= $row['StatusData'] === 'AKTIF' ? 'checked' : ''; ?> 
                                               onchange="toggleStatus('<?= $row['KodeProvider']; ?>', '<?= htmlspecialchars(addslashes($row['NamaProvider'])); ?>', this.checked)">
                                    </div>
                                    <!-- Tombol Hapus -->
                                    <a href="provider_Controller.php?action=delete&id=<?= $row['KodeProvider']; ?>" 
                                       class="text-muted text-decoration-none" 
                                       onclick="return confirm('Hapus provider ini?')">
                                        <i class="bi bi-trash"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6" class="text-center py-5 text-muted">Belum ada data provider.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <!-- Pagination Bar -->
            <div class="p-3 bg-white border-top d-flex justify-content-between align-items-center">
                <span class="text-muted small">Menampilkan 1 - <?= isset($providers) ? count($providers) : 0; ?> dari <?= isset($providers) ? count($providers) : 0; ?> total provider seluler terdaftar</span>
                <nav>
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item disabled"><a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a></li>
                        <li class="page-item active"><a class="page-link" href="#" style="background:var(--navy); border-color:var(--navy);">1</a></li>
                        <li class="page-item disabled"><a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </main>

    <!-- Modal Tambah Data -->
    <div class="modal fade" id="modalTambah" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <form action="provider_Controller.php?action=store" method="POST" class="modal-content border-0 shadow-lg" style="border-radius:12px;">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold" style="color:var(--navy);"><i class="bi bi-plus-circle text-warning me-2"></i>Tambah Provider Seluler</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">Nama Provider <span class="text-danger">*</span></label>
                        <input type="text" name="NamaProvider" class="form-control" required placeholder="Misal: Telkomsel, XL, Smartfren">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">Status Data</label>
                        <select name="StatusData" class="form-select">
                            <option value="AKTIF">AKTIF</option>
                            <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-light rounded-3" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-add">Simpan Data</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Edit Data -->
    <div class="modal fade" id="modalEdit" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <form action="provider_Controller.php?action=update" method="POST" class="modal-content border-0 shadow-lg" style="border-radius:12px;">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold" style="color:var(--navy);"><i class="bi bi-pencil-square text-warning me-2"></i>Edit Data Provider</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="KodeProvider" id="editKodeProvider">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">Nama Provider <span class="text-danger">*</span></label>
                        <input type="text" name="NamaProvider" id="editNamaProvider" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">Status Data</label>
                        <select name="StatusData" id="editStatusData" class="form-select">
                            <option value="AKTIF">AKTIF</option>
                            <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-light rounded-3" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn text-white rounded-3" style="background:var(--navy);">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Hidden Auto-Update Form for Toggle Switch -->
    <form id="formToggleStatus" action="provider_Controller.php?action=update" method="POST" style="display:none;">
        <input type="hidden" name="KodeProvider" id="toggleKodeProvider">
        <input type="hidden" name="NamaProvider" id="toggleNamaProvider">
        <input type="hidden" name="StatusData" id="toggleStatusData">
    </form>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
    function editProvider(kode, nama, status) {
        document.getElementById('editKodeProvider').value = kode;
        document.getElementById('editNamaProvider').value = nama;
        document.getElementById('editStatusData').value = status;
        new bootstrap.Modal(document.getElementById('modalEdit')).show();
    }

    function toggleStatus(kode, nama, isChecked) {
        document.getElementById('toggleKodeProvider').value = kode;
        document.getElementById('toggleNamaProvider').value = nama;
        document.getElementById('toggleStatusData').value = isChecked ? 'AKTIF' : 'TIDAK AKTIF';
        document.getElementById('formToggleStatus').submit();
    }

    function filterTable() {
        let input = document.getElementById("searchInput").value.toLowerCase();
        let status = document.getElementById("filterStatus").value.toUpperCase();
        let table = document.getElementById("providerTable");
        let tr = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

        for (let i = 0; i < tr.length; i++) {
            let tdNama = tr[i].getElementsByTagName("td")[2];
            let tdStatus = tr[i].getElementsByTagName("td")[3];
            if (tdNama && tdStatus) {
                let txtValueNama = tdNama.textContent || tdNama.innerText;
                let txtValueStatus = tdStatus.textContent || tdStatus.innerText;
                let matchName = txtValueNama.toLowerCase().indexOf(input) > -1;
                let matchStatus = status === "" || txtValueStatus.toUpperCase().indexOf(status) > -1;
                tr[i].style.display = (matchName && matchStatus) ? "" : "none";
            }
        }
    }

    function resetFilter() {
        document.getElementById("searchInput").value = "";
        document.getElementById("filterStatus").value = "";
        filterTable();
    }
    </script>
</body>
</html>