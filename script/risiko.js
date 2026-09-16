import {
  fetchRisikoSummary,
  fetchPelangganRisiko,
  fetchRisikoFilters,
  processRiskLevel,
  approvePriorityRanking,
} from "../api/risiko-api.js";

const state = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 5,
  search: "",
  levelRisiko: "",
  statusSurvei: "",
  unit: "",
};

const el = {
  tableBody: document.getElementById("tableBody"),
  tableEmpty: document.getElementById("tableEmptyState"),
  searchInput: document.getElementById("searchInput"),
  filterLevelRisiko: document.getElementById("filterLevelRisiko"),
  filterStatusSurvei: document.getElementById("filterStatusSurvei"),
  filterUnit: document.getElementById("filterUnit"),
  btnExport: document.getElementById("btnExport"),
  rowsInfo: document.getElementById("rowsInfo"),
  prevPage: document.getElementById("prevPage"),
  nextPage: document.getElementById("nextPage"),

  statTotal: document.getElementById("statTotal"),
  statTotalFoot: document.getElementById("statTotalFoot"),
  statSurvei: document.getElementById("statSurvei"),
  statSurveiFoot: document.getElementById("statSurveiFoot"),
  statSurveiBadge: document.getElementById("statSurveiBadge"),
  statMatriks: document.getElementById("statMatriks"),
  barTinggi: document.getElementById("barTinggi"),
  barSedang: document.getElementById("barSedang"),
  barRendah: document.getElementById("barRendah"),
  legendTinggi: document.getElementById("legendTinggi"),
  legendSedang: document.getElementById("legendSedang"),
  legendRendah: document.getElementById("legendRendah"),
  statPrioritas: document.getElementById("statPrioritas"),

  btnProcessRisk: document.getElementById("btnProcessRisk"),
  btnApprovePriority: document.getElementById("btnApprovePriority"),
};

/* ------------------------------------------------------------------ */
/* Rendering                                                          */
/* ------------------------------------------------------------------ */

function riskClass(level) {
  // level: "tinggi" | "sedang" | "rendah"
  return level || "rendah";
}

function scoreChip(kode, skor, level) {
  return `<span class="score-chip score-chip--${riskClass(level)}">${kode} (Skor ${skor})</span>`;
}

function surveyCell(text, level) {
  return `<div class="survey-text survey-text--${riskClass(level)}">${text}</div>`;
}

function riskPill(label, level) {
  return `<span class="risk-pill risk-pill--${riskClass(level)}">${label}</span>`;
}

function approvalPill(status) {
  const map = {
    disetujui: { cls: "approval-pill--approved", label: "Disetujui TLAP" },
    pending: { cls: "approval-pill--pending", label: "Pending Otorisasi" },
  };
  const s = map[status] || map.pending;
  return `<span class="approval-pill ${s.cls}">${s.label}</span>`;
}

function actionCell(p) {
  const secondBtn =
    p.statusApproval === "disetujui"
      ? `<button class="chip-action chip-action--ghost" data-action="riwayat" data-id="${p.id}">Riwayat</button>`
      : p.statusApproval === "pending" && p.levelRisiko === "sedang"
      ? `<button class="chip-action chip-action--ghost" data-action="review" data-id="${p.id}">Review Data</button>`
      : `<button class="chip-action chip-action--orange" data-action="verifikasi" data-id="${p.id}">Verifikasi SPK</button>`;

  return `
    <div class="row-actions">
      <button class="link-action" data-action="detail" data-id="${p.id}">Detail</button>
      ${secondBtn}
    </div>`;
}

function renderRows() {
  el.tableBody.innerHTML = "";

  if (!state.items.length) {
    el.tableEmpty.style.display = "flex";
    updateRowsInfo();
    return;
  }
  el.tableEmpty.style.display = "none";

  el.tableBody.innerHTML = state.items
    .map(
      (p) => `
      <tr>
        <td>
          <div class="risk-id-cell">
            <span class="risk-dot risk-dot--${riskClass(p.levelRisiko)}"></span>
            ${p.idPelanggan}
          </div>
        </td>
        <td>
          <div class="cell-stack">
            <span class="cell-stack__title">${p.nama}</span>
            <span class="cell-stack__sub">${p.unit}</span>
            <span class="cell-stack__sub">${p.tarifDaya}</span>
          </div>
        </td>
        <td>${scoreChip(p.kodeKepatuhan, p.skorKepatuhan, p.levelRisiko)}</td>
        <td>${surveyCell(p.kondisiSurveiSR, p.levelRisiko)}</td>
        <td>${riskPill(p.labelRisiko, p.levelRisiko)}</td>
        <td><span class="priority-rank">#${p.skalaPrioritas}</span></td>
        <td>${approvalPill(p.statusApproval)}</td>
        <td>${actionCell(p)}</td>
      </tr>`
    )
    .join("");

  el.tableBody.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", onRowAction);
  });
}

function onRowAction(e) {
  const { action, id } = e.currentTarget.dataset;
  console.log(`[risiko.js] Aksi "${action}" untuk pelanggan ${id} (belum terhubung ke backend).`);
}

function updateRowsInfo() {
  const start = state.total === 0 ? 0 : (state.page - 1) * state.pageSize + 1;
  const end = Math.min(state.page * state.pageSize, state.total);
  el.rowsInfo.textContent = `Menampilkan ${start} - ${end} dari ${state.total} total pelanggan target`;
  el.prevPage.disabled = state.page <= 1;
  el.nextPage.disabled = end >= state.total;
}

function renderSummary(s) {
  el.statTotal.textContent = s.totalTargetPelanggan || 0;
  el.statTotalFoot.textContent =
    s.totalTargetPelanggan > 0
      ? `✓ ${s.persentaseBillingTervalidasi}% Data Billing Tervalidasi`
      : "Belum ada data";

  el.statSurvei.textContent = `${s.surveiSelesai || 0} / ${s.totalTargetPelanggan || 0}`;
  el.statSurveiBadge.textContent = `${s.persentaseSurveiSelesai || 0}% Selesai`;
  el.statSurveiFoot.textContent =
    s.sisaPelangganSurvei > 0
      ? `${s.sisaPelangganSurvei} Pelanggan tersisa · Staf AP & Mitra`
      : "Belum ada data";

  el.statMatriks.textContent = s.matriksTeranalisis || 0;

  const d = s.distribusiRisiko || { tinggi: 0, sedang: 0, rendah: 0 };
  el.barTinggi.style.width = `${d.tinggi}%`;
  el.barSedang.style.width = `${d.sedang}%`;
  el.barRendah.style.width = `${d.rendah}%`;
  el.legendTinggi.textContent = `Tinggi ${d.tinggi}%`;
  el.legendSedang.textContent = `Sedang ${d.sedang}%`;
  el.legendRendah.textContent = `Rendah ${d.rendah}%`;

  el.statPrioritas.textContent = s.targetPrioritasKuadran1 || 0;
}

/* ------------------------------------------------------------------ */
/* Data loading                                                       */
/* ------------------------------------------------------------------ */

async function loadFilters() {
  const { levelRisiko, unit } = await fetchRisikoFilters();

  levelRisiko.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v.id ?? v;
    opt.textContent = v.label ?? v;
    el.filterLevelRisiko.appendChild(opt);
  });

  unit.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v.id ?? v;
    opt.textContent = v.label ?? v;
    el.filterUnit.appendChild(opt);
  });
}

async function loadSummary() {
  const summary = await fetchRisikoSummary();
  renderSummary(summary);
}

async function loadTable() {
  const { items, total, page, pageSize } = await fetchPelangganRisiko({
    search: state.search,
    levelRisiko: state.levelRisiko,
    statusSurvei: state.statusSurvei,
    unit: state.unit,
    page: state.page,
    pageSize: state.pageSize,
  });

  state.items = items;
  state.total = total;
  state.page = page;
  state.pageSize = pageSize;

  renderRows();
  updateRowsInfo();
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

let searchTimer;
el.searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = e.target.value.trim();
    state.page = 1;
    loadTable();
  }, 300);
});

el.filterLevelRisiko.addEventListener("change", (e) => {
  state.levelRisiko = e.target.value;
  state.page = 1;
  loadTable();
});

el.filterStatusSurvei.addEventListener("change", (e) => {
  state.statusSurvei = e.target.value;
  state.page = 1;
  loadTable();
});

el.filterUnit.addEventListener("change", (e) => {
  state.unit = e.target.value;
  state.page = 1;
  loadTable();
});

el.prevPage.addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    loadTable();
  }
});

el.nextPage.addEventListener("click", () => {
  state.page += 1;
  loadTable();
});

el.btnExport.addEventListener("click", () => {
  console.log("[risiko.js] Export ditekan (belum terhubung ke backend/export endpoint).");
});

el.btnProcessRisk?.addEventListener("click", async () => {
  await processRiskLevel();
  await Promise.all([loadSummary(), loadTable()]);
});

el.btnApprovePriority?.addEventListener("click", async () => {
  await approvePriorityRanking([]);
  await Promise.all([loadSummary(), loadTable()]);
});

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */

(async function init() {
  await Promise.all([loadFilters(), loadSummary(), loadTable()]);
})();