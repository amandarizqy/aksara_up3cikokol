/* =========================================================
   DIGITA — Halaman "Struktur & Master Unit PLN"
   Merender kartu statistik, tabel hierarki unit, filter,
   pencarian, dan pagination. Sumber data: master-unit.api.js
   (fallback otomatis ke master-unit.mock.js bila API gagal).
   ========================================================= */

import {
  getMasterUnitList,
  getMasterUnitStats,
  exportMasterUnitData,
} from "../api/master-unit.api.js";
import { MOCK_MASTER_UNIT, MOCK_STATS } from "../api/master-unit.mock.js";

/* ---------- State halaman ---------- */

const state = {
  search: "",
  tingkat: "",
  page: 1,
  pageSize: 7,
  usingMock: false,
};

/* ---------- Referensi elemen DOM ---------- */

const el = {
  searchInput: document.getElementById("searchInput"),
  filterTingkat: document.getElementById("filterTingkat"),
  btnReset: document.getElementById("btnReset"),
  btnEksporData: document.getElementById("btnEksporData"),
  btnTambahUnit: document.getElementById("btnTambahUnit"),
  tableBody: document.getElementById("tableBody"),
  tableEmptyState: document.getElementById("tableEmptyState"),
  filterResultInfo: document.getElementById("filterResultInfo"),
  pageInfoText: document.getElementById("pageInfoText"),
  paginationControls: document.getElementById("paginationControls"),
  prevPage: document.getElementById("prevPage"),
  nextPage: document.getElementById("nextPage"),
  apiFallbackBanner: document.getElementById("apiFallbackBanner"),
  statUnitInduk: document.getElementById("statUnitInduk"),
  statUnitIndukFoot: document.getElementById("statUnitIndukFoot"),
  statWilayahUp3: document.getElementById("statWilayahUp3"),
  statWilayahUp3Foot: document.getElementById("statWilayahUp3Foot"),
  statPoskoUlp: document.getElementById("statPoskoUlp"),
  statPoskoUlpFoot: document.getElementById("statPoskoUlpFoot"),
};

/* ---------- Util ---------- */

function debounce(fn, delay = 350) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function tingkatMeta(tingkat) {
  if (tingkat === 1) return { tag: "UI", cls: "ui", label: "UI (Tingkat I)" };
  if (tingkat === 2) return { tag: "UP3", cls: "up3", label: "UP3 (Tingkat II)" };
  return { tag: "ULP", cls: "ulp", label: "ULP (Tingkat III)" };
}

/* ---------- Fallback: filter + paginate manual dari data mock ---------- */

function queryMock({ search, tingkat, page, pageSize }) {
  let rows = MOCK_MASTER_UNIT;

  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((u) =>
      [u.kode, u.nama, u.pic, u.alamat].join(" ").toLowerCase().includes(q)
    );
  }
  if (tingkat) {
    rows = rows.filter((u) => String(u.tingkat) === String(tingkat));
  }

  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);

  return {
    data,
    meta: { page: safePage, pageSize, totalItems, totalPages },
  };
}

/* ---------- Render: Kartu Statistik ---------- */

function renderStats(stats) {
  el.statUnitInduk.textContent = stats.unitInduk ?? "–";
  el.statUnitIndukFoot.textContent = stats.unitIndukFoot ?? "-";
  el.statWilayahUp3.textContent = stats.wilayahUp3 ?? "–";
  el.statWilayahUp3Foot.textContent = stats.wilayahUp3Foot ?? "-";
  el.statPoskoUlp.textContent = stats.poskoUlp ?? "–";
  el.statPoskoUlpFoot.textContent = stats.poskoUlpFoot ?? "-";
}

/* ---------- Render: Baris Tabel ---------- */

function renderRow(unit) {
  const t = tingkatMeta(unit.tingkat);
  const level = unit.tingkat; // 1 | 2 | 3
  const marker = level === 2 ? "·" : level === 3 ? "–" : "";

  const statusAktif = unit.status === "aktif";
  const statusCls = statusAktif ? "status-pill--aktif" : "status-pill--nonaktif";
  const statusLabel = statusAktif ? "Aktif" : "Nonaktif";

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="font-mono">${unit.kode}</td>
    <td>
      <div class="unit-name-cell" data-level="${level}">
        ${marker ? `<span class="unit-name-cell__marker">${marker}</span>` : ""}
        <span class="unit-tag unit-tag--${t.cls}">${t.tag}</span>
        <div class="unit-name-cell__text">
          <span class="unit-name-cell__title">${unit.nama}</span>
          <span class="unit-name-cell__desc">${unit.deskripsi ?? ""}</span>
        </div>
      </div>
    </td>
    <td><span class="tingkat-pill tingkat-pill--${t.cls}">${t.label}</span></td>
    <td>
      <div class="pic-cell__name">${unit.pic ?? "-"}</div>
      <div class="pic-cell__role">${unit.picJabatan ?? ""}</div>
    </td>
    <td>
      <div class="contact-cell__address">${unit.alamat ?? "-"}</div>
      <div class="contact-cell__phone">${unit.telepon ?? ""}</div>
    </td>
    <td>
      <span class="status-pill ${statusCls}">
        <span class="status-pill__dot"></span>${statusLabel}
      </span>
    </td>
    <td class="col-action">
      <div class="action-icon-group">
        <button class="action-icon-btn" title="Lihat Detail" data-action="view" data-kode="${unit.kode}">👁</button>
        <button class="action-icon-btn" title="Edit Unit" data-action="edit" data-kode="${unit.kode}">✏️</button>
      </div>
    </td>
  `;
  return tr;
}

function renderTable(rows) {
  el.tableBody.innerHTML = "";

  if (!rows.length) {
    el.tableEmptyState.classList.remove("is-hidden");
    return;
  }
  el.tableEmptyState.classList.add("is-hidden");

  const fragment = document.createDocumentFragment();
  rows.forEach((unit) => fragment.appendChild(renderRow(unit)));
  el.tableBody.appendChild(fragment);
}

/* ---------- Render: Pagination ---------- */

function buildPageNumberList(current, total) {
  // Pola: 1 2 3 ... total  (mirip desain: selalu tampilkan 3 halaman awal + ... + halaman terakhir)
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [1, 2, 3];
  if (current > 4 && current < total - 1) {
    // sisipkan halaman aktif di tengah jika jauh dari awal/akhir
    pages.splice(2, 0, "...", current);
  } else {
    pages.push("...");
  }
  pages.push(total);
  return pages;
}

function renderPagination(meta) {
  const { page, totalPages, totalItems, pageSize } = meta;

  el.pageInfoText.textContent = `Memuat halaman ${page} dari ${totalPages} halaman data master unit`;

  const shownCount = Math.min(pageSize, totalItems - (page - 1) * pageSize);
  el.filterResultInfo.textContent = `Menampilkan ${Math.max(shownCount, 0)} dari ${totalItems} unit`;

  // Bersihkan tombol nomor lama (di antara prevPage & nextPage)
  [...el.paginationControls.querySelectorAll(".pagination__page-btn, .pagination__ellipsis")].forEach((n) =>
    n.remove()
  );

  const pageList = buildPageNumberList(page, totalPages);
  pageList.forEach((p) => {
    if (p === "...") {
      const span = document.createElement("span");
      span.className = "pagination__ellipsis";
      span.textContent = "...";
      el.paginationControls.insertBefore(span, el.nextPage);
      return;
    }
    const btn = document.createElement("button");
    btn.className = "pagination__page-btn" + (p === page ? " pagination__page-btn--active" : "");
    btn.textContent = String(p);
    btn.addEventListener("click", () => {
      state.page = p;
      loadData();
    });
    el.paginationControls.insertBefore(btn, el.nextPage);
  });

  el.prevPage.disabled = page <= 1;
  el.nextPage.disabled = page >= totalPages;
}

/* ---------- Ambil & render data (API asli, fallback ke mock jika gagal) ---------- */

async function loadData() {
  const params = {
    search: state.search,
    tingkat: state.tingkat,
    page: state.page,
    pageSize: state.pageSize,
  };

  try {
    const [listRes, statsRes] = await Promise.all([
      getMasterUnitList(params),
      getMasterUnitStats(),
    ]);

    state.usingMock = false;
    el.apiFallbackBanner.classList.add("is-hidden");

    renderStats(statsRes);
    renderTable(listRes.data);
    renderPagination(listRes.meta);
  } catch (err) {
    console.warn(
      "[master-unit] API backend belum tersedia, memakai data contoh untuk pratinjau:",
      err.message
    );
    state.usingMock = true;
    el.apiFallbackBanner.classList.remove("is-hidden");

    const mockRes = queryMock(params);
    renderStats(MOCK_STATS);
    renderTable(mockRes.data);
    renderPagination(mockRes.meta);
  }
}

/* ---------- Event handlers ---------- */

const onSearchInput = debounce((value) => {
  state.search = value.trim();
  state.page = 1;
  loadData();
}, 350);

el.searchInput.addEventListener("input", (e) => onSearchInput(e.target.value));

el.filterTingkat.addEventListener("change", (e) => {
  state.tingkat = e.target.value;
  state.page = 1;
  loadData();
});

el.btnReset.addEventListener("click", () => {
  state.search = "";
  state.tingkat = "";
  state.page = 1;
  el.searchInput.value = "";
  el.filterTingkat.value = "";
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

el.btnEksporData.addEventListener("click", async () => {
  try {
    await exportMasterUnitData({ search: state.search, tingkat: state.tingkat });
  } catch (err) {
    alert(
      "Ekspor gagal: endpoint /master-unit/export belum tersedia di backend.\n" +
        "Detail: " + err.message
    );
  }
});

// TODO: sambungkan ke modal/form "Tambah Unit Baru" saat komponennya sudah dibuat.
el.btnTambahUnit.addEventListener("click", () => {
  alert("Form Tambah Unit Baru belum tersedia. Hubungkan tombol ini ke modal/route pembuatan unit.");
});

// Delegasi klik untuk tombol aksi (lihat/edit) di setiap baris tabel
el.tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest(".action-icon-btn");
  if (!btn) return;
  const { action, kode } = btn.dataset;
  if (action === "view") {
    // TODO: arahkan ke halaman/modal detail unit sesuai kode
    console.log("Lihat detail unit:", kode);
  } else if (action === "edit") {
    // TODO: arahkan ke form edit unit sesuai kode
    console.log("Edit unit:", kode);
  }
});

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", loadData);