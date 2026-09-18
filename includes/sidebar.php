<?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'SF.UI'): ?>
    <li class="nav-item">
        <a class="nav-link" href="/modules/master/provider_Controller.php?action=index">
            <i class="bi bi-broadcast"></i> Master Provider
        </a>
    </li>
<?php endif; ?>