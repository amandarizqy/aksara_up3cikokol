import { fetchPersonnel, fetchStats, fetchRoles, fetchUnits } from "./api.js";

/** State halaman */
const state = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  search: "",
  role: "",
  unit: "",
  selectedIds: new Set(),
};

const el = {
  tableBody: document.getElementById("tableBody"),
  tableEmpty: document.getElementById("tableEmptyState"),
  checkAll: document.getElementById("checkAll"),
  searchInput: document.getElementById("searchInput"),
  filterRole: document.getElementById("filterRole"),
  filterUnit: document.getElementById("filterUnit"),
  btnReset: document.getElementById("btnReset"),
  btnDownloadSelected: document.getElementById("btnDownloadSelected"),
  selectedCount: document.getElementById("selectedCount"),
  statTotal: document.getElementById("statTotal"),
  statTotalFoot: document.getElementById("statTotalFoot"),
  statAktif: document.getElementById("statAktif"),
  statAktifFoot: document.getElementById("statAktifFoot"),
  statNonaktif: document.getElementById("statNonaktif"),
  statNonaktifFoot: document.getElementById("statNonaktifFoot"),
  rowsInfo: document.getElementById("rowsInfo"),
  pageSize: document.getElementById("pageSize"),
  prevPage: document.getElementById("prevPage"),
  nextPage: document.getElementById("nextPage"),
};

/* ------------------------------------------------------------------ */
/* Rendering                                                          */
/* ------------------------------------------------------------------ */

function statusPill(status) {
  const map = {
    aktif: { cls: "status-pill--active", label: "Aktif" },
    pending: { cls: "status-pill--pending", label: "Pending Approval" },
    nonaktif: { cls: "status-pill--inactive", label: "Nonaktif" },
  };
  const s = map[status] || map.nonaktif;
  return `<span class="status-pill ${s.cls}"><span class="status-dot"></span>${s.label}</span>`;
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function renderRows() {
  el.tableBody.innerHTML = "";

  if (!state.items.length) {
    el.tableEmpty.style.display = "flex";
    updateRowsInfo();
    return;
  }
  el.tableEmpty.style.display = "none";

  const rowsHtml = state.items
    .map((p) => {
      const checked = state.selectedIds.has(p.id) ? "checked" : "";
      return `
        <tr data-id="${p.id}">
          <td class="col-check"><input type="checkbox" class="row-check" data-id="${p.id}" ${checked} /></td>
          <td>
            <div class="person-cell">
              <div class="person-avatar">${initials(p.nama)}</div>
              <div>
                <div class="person-name">${p.nama}</div>
                <div class="person-nip">NIP. ${p.nip}</div>
              </div>
            </div>
          </td>
          <td>${p.role}</td>
          <td>${p.unit}</td>
          <td>${p.hakAkses}</td>
          <td>${statusPill(p.status)}</td>
          <td class="col-action"><button class="page-btn" title="Edit">✎</button></td>
        </tr>`;
    })
    .join("");

  el.tableBody.innerHTML = rowsHtml;

  document.querySelectorAll(".row-check").forEach((cb) => {
    cb.addEventListener("change", onRowCheckChange);
  });
}

function updateRowsInfo() {
  const start = state.total === 0 ? 0 : (state.page - 1) * state.pageSize + 1;
  const end = Math.min(state.page * state.pageSize, state.total);
  el.rowsInfo.textContent = `${start}–${end} dari ${state.total} baris data`;
  el.prevPage.disabled = state.page <= 1;
  el.nextPage.disabled = end >= state.total;
}

function updateSelectionUI() {
  const count = state.selectedIds.size;
  el.selectedCount.textContent = count;
  el.btnDownloadSelected.disabled = count === 0;
  el.checkAll.checked = state.items.length > 0 && count === state.items.length;
}

function renderStats(stats) {
  el.statTotal.textContent = stats.totalPersonel || 0;
  el.statTotalFoot.textContent =
    stats.totalPersonel > 0 ? `${stats.persentaseUnit || 0}% lintas unit kerja` : "Belum ada data";

  el.statAktif.textContent = stats.penggunaAktif || 0;
  el.statAktifFoot.textContent =
    stats.penggunaAktif > 0
      ? `${stats.persentaseHakAksesValid || 0}% memiliki hak akses valid`
      : "Belum ada data";

  el.statNonaktif.textContent = stats.akunDinonaktifkan || 0;
  el.statNonaktifFoot.textContent = stats.akunDinonaktifkan > 0 ? "Revoked" : "Belum ada data";
}

/* ------------------------------------------------------------------ */
/* Data loading                                                       */
/* ------------------------------------------------------------------ */

async function loadRoleAndUnitFilters() {
  const [roles, units] = await Promise.all([fetchRoles(), fetchUnits()]);

  roles.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.id ?? r;
    opt.textContent = r.label ?? r;
    el.filterRole.appendChild(opt);
  });

  units.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.id ?? u;
    opt.textContent = u.label ?? u;
    el.filterUnit.appendChild(opt);
  });
}

async function loadData() {
  const { items, total, page, pageSize } = await fetchPersonnel({
    search: state.search,
    role: state.role,
    unit: state.unit,
    page: state.page,
    pageSize: state.pageSize,
  });

  state.items = items;
  state.total = total;
  state.page = page;
  state.pageSize = pageSize;

  renderRows();
  updateSelectionUI();
  updateRowsInfo();
}

async function loadStats() {
  const stats = await fetchStats();
  renderStats(stats);
}

/* ------------------------------------------------------------------ */
/* Event handlers                                                     */
/* ------------------------------------------------------------------ */

function onRowCheckChange(e) {
  const id = e.target.dataset.id;
  if (e.target.checked) state.selectedIds.add(id);
  else state.selectedIds.delete(id);
  updateSelectionUI();
}

el.checkAll.addEventListener("change", () => {
  if (el.checkAll.checked) {
    state.items.forEach((p) => state.selectedIds.add(p.id));
  } else {
    state.items.forEach((p) => state.selectedIds.delete(p.id));
  }
  renderRows();
  updateSelectionUI();
});

let searchTimer;
el.searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = e.target.value.trim();
    state.page = 1;
    loadData();
  }, 300);
});

el.filterRole.addEventListener("change", (e) => {
  state.role = e.target.value;
  state.page = 1;
  loadData();
});

el.filterUnit.addEventListener("change", (e) => {
  state.unit = e.target.value;
  state.page = 1;
  loadData();
});

el.btnReset.addEventListener("click", () => {
  state.search = "";
  state.role = "";
  state.unit = "";
  state.page = 1;
  el.searchInput.value = "";
  el.filterRole.value = "";
  el.filterUnit.value = "";
  loadData();
});

el.pageSize.addEventListener("change", (e) => {
  state.pageSize = Number(e.target.value);
  state.page = 1;
  loadData();
});

el.prevPage.addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    loadData();
  }
});

el.nextPage.addEventListener("click", () => {
  state.page += 1;
  loadData();
});

/**
 * Download baris terpilih sebagai file CSV di sisi klien.
 * Ini adalah fallback selama belum ada endpoint export di backend
 * (lihat exportPersonnel() di api.js untuk versi server-side).
 */
el.btnDownloadSelected.addEventListener("click", () => {
  const selected = state.items.filter((p) => state.selectedIds.has(p.id));
  if (!selected.length) return;

  const header = ["Nama", "NIP", "Peran/Role", "Unit Penempatan", "Hak Akses Utama S41", "Status"];
  const rows = selected.map((p) => [p.nama, p.nip, p.role, p.unit, p.hakAkses, p.status]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `personel-terpilih-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */

(async function init() {
  await Promise.all([loadRoleAndUnitFilters(), loadStats(), loadData()]);
})();