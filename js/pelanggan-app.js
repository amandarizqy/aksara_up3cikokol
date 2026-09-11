/* =========================================================
   PLN Smart Grid — Halaman "Data Pelanggan"
   App Logic: merender baris tabel dari js/pelanggan-data.js
   Membutuhkan: pelanggan-data.js (dimuat sebelum file ini)
   ========================================================= */

/* ---------- Util ---------- */

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Skor 7-9 = Tinggi, 4-6 = Sedang, 1-3 = Rendah
function skorInfo(skor) {
  if (skor >= 7) return { label: "Tinggi", level: "tinggi" };
  if (skor >= 4) return { label: "Sedang", level: "sedang" };
  return { label: "Rendah", level: "rendah" };
}

/* ---------- Badge builders ---------- */

function badgeIdPelanggan(p) {
  if (p.kritis) {
    return `
      <td class="py-space-sm px-space-base font-telemetry-data text-telemetry-data font-bold text-error flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-[16px]">priority_high</span>
        <span>${p.idpel}</span>
      </td>`;
  }
  return `<td class="py-space-sm px-space-base font-telemetry-data text-telemetry-data font-semibold text-primary">${p.idpel}</td>`;
}

function badgeNama(p) {
  const catatan = p.catatan
    ? `<span class="block font-label-sm text-label-sm text-error font-medium">${p.catatan}</span>`
    : "";
  const cls = p.kritis
    ? "font-title-sm text-title-sm font-bold text-on-surface"
    : "font-title-sm text-title-sm";
  return `<td class="py-space-sm px-space-base ${cls}">${p.nama}${catatan}</td>`;
}

function badgeTarif(p) {
  const bg = p.kritis ? "bg-surface-container-highest" : "bg-surface-container-high";
  return `
    <td class="py-space-sm px-space-base">
      <span class="px-space-xs py-space-2xs ${bg} rounded text-on-surface-variant font-label-sm text-label-sm font-semibold">${p.tarif}</span>
    </td>`;
}

function badgeStatusBayar(p) {
  if (p.statusBayar === "lunas") {
    return `
      <span class="inline-flex items-center gap-space-2xs px-space-sm py-space-2xs rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>Lunas
      </span>`;
  }
  if (p.statusBayar === "menunggak-kritis") {
    return `
      <span class="inline-flex items-center gap-space-2xs px-space-sm py-space-2xs rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-on-error"></span>Menunggak
      </span>`;
  }
  return `
    <span class="inline-flex items-center gap-space-2xs px-space-sm py-space-2xs rounded-full bg-error-container text-error font-label-sm text-label-sm">
      <span class="w-1.5 h-1.5 rounded-full bg-error"></span>Menunggak
    </span>`;
}

function badgeKeterlambatan(p) {
  const base = "py-space-sm px-space-base text-center font-telemetry-data text-telemetry-data";
  if (p.tunggakanHari === null) {
    return `<td class="${base} text-outline">-</td>`;
  }
  const cls = p.kritis
    ? "text-error font-bold"
    : p.tunggakanWarna === "error"
    ? "text-error font-semibold"
    : "text-on-surface-variant font-semibold";
  return `<td class="${base} ${cls}">${p.tunggakanHari} Hari</td>`;
}

function badgeSkor(p) {
  const { label, level } = skorInfo(p.skor);
  let boxCls, labelCls;
  if (level === "tinggi") {
    boxCls = p.kritis ? "bg-error text-on-error" : "bg-error-container text-error";
    labelCls = p.kritis ? "text-error font-bold" : "text-error font-semibold";
  } else if (level === "sedang") {
    boxCls = "bg-surface-container-highest text-on-surface-variant";
    labelCls = "text-on-surface-variant font-semibold";
  } else {
    boxCls = "bg-surface-container text-primary";
    labelCls = "text-primary font-semibold";
  }
  return `
    <div class="flex items-center gap-space-xs">
      <span class="w-6 h-6 rounded ${boxCls} font-telemetry-data text-telemetry-data font-bold flex items-center justify-center">${p.skor}</span>
      <span class="font-label-sm text-label-sm ${labelCls}">${label}</span>
    </div>`;
}

function badgeKategori(p) {
  const cls = p.kritis
    ? "bg-error-container text-error"
    : "bg-surface-variant text-on-surface-variant";
  return `<span class="px-space-xs py-space-2xs ${cls} font-label-sm text-label-sm font-bold rounded">${p.kategori}</span>`;
}

function badgeProfit(p) {
  return p.profit
    ? `<span class="px-space-sm py-space-2xs bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm rounded-full font-semibold">Profit</span>`
    : `<span class="px-space-sm py-space-2xs bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm rounded-full font-semibold">Tidak Profit</span>`;
}

function badgeListrik(p) {
  if (p.listrik === "ON") {
    return `
      <span class="inline-flex items-center gap-space-2xs px-space-sm py-space-2xs bg-surface-container-highest text-primary font-label-sm text-label-sm rounded-full font-semibold">
        <span class="w-2 h-2 rounded-full bg-primary"></span>ON
      </span>`;
  }
  return `
    <span class="inline-flex items-center gap-space-xs px-space-sm py-space-2xs bg-error text-on-error font-label-sm text-label-sm rounded-full font-bold shadow-sm">
      <span class="material-symbols-outlined text-[14px]">tap_and_play</span>
      <span>OFF (Shunt Trip)</span>
    </span>`;
}

const SMS_STYLE_MAP = {
  sukses: { wrapCls: "text-primary", icon: "check_circle", iconCls: "" },
  menunggu: { wrapCls: "text-on-surface-variant", icon: "hourglass_empty", iconCls: "text-outline" },
  belum: { wrapCls: "text-outline", icon: "cancel", iconCls: "" },
  mendesak: { wrapCls: "text-error font-semibold", icon: "notifications_active", iconCls: "" },
};

function badgeSms(p) {
  const s = SMS_STYLE_MAP[p.sms.tipe];
  return `
    <div class="flex items-center gap-space-2xs ${s.wrapCls} font-label-sm text-label-sm">
      <span class="material-symbols-outlined text-[16px] ${s.iconCls}">${s.icon}</span>
      <span>${p.sms.label}</span>
    </div>`;
}

function aksiOperasional(p) {
  if (p.kritis) {
    return `
      <div class="flex items-center justify-center gap-space-xs">
        <a class="px-space-sm py-space-xs bg-primary text-on-primary font-title-sm text-title-sm rounded-lg flex items-center gap-space-2xs hover:bg-primary-container transition-all shadow-sm" data-path="detail-pelanggan" href="#" title="Lihat Detail Pelanggan">
          <span class="material-symbols-outlined text-[16px]">visibility</span><span>Detail</span>
        </a>
        <button class="p-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg transition-colors" title="Riwayat SMS">
          <span class="material-symbols-outlined text-[18px]">sms</span>
        </button>
        <a class="p-space-xs bg-error text-on-error hover:bg-on-error-container rounded-lg transition-colors" data-path="kontrol-listrik-shunt-trip" href="#" title="Panel Kontrol Shunt Trip">
          <span class="material-symbols-outlined text-[18px]">settings_power</span>
        </a>
      </div>`;
  }
  return `
    <div class="flex items-center justify-center gap-space-xs">
      <a class="p-space-xs bg-surface-container hover:bg-surface-container-high text-primary rounded-lg transition-colors" data-path="detail-pelanggan" href="#" title="Lihat Detail">
        <span class="material-symbols-outlined text-[18px]">visibility</span>
      </a>
      <button class="p-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-lg transition-colors" title="Kirim SMS Gateway">
        <span class="material-symbols-outlined text-[18px]">sms</span>
      </button>
      <a class="p-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-lg transition-colors" data-path="kontrol-listrik-shunt-trip" href="#" title="Kontrol Shunt Trip">
        <span class="material-symbols-outlined text-[18px]">power_settings_new</span>
      </a>
    </div>`;
}

/* ---------- Render baris tabel ---------- */

function renderPelangganRow(p) {
  const rowCls = p.kritis
    ? "bg-error-container/20 hover:bg-error-container/30 transition-colors"
    : "hover:bg-surface-container-low transition-colors";

  return `
    <tr class="${rowCls}">
      ${badgeIdPelanggan(p)}
      ${badgeNama(p)}
      <td class="py-space-sm px-space-base font-telemetry-data text-telemetry-data ${p.kritis ? "text-on-surface font-semibold" : "text-on-surface-variant"}">${p.noMeter}</td>
      ${badgeTarif(p)}
      <td class="py-space-sm px-space-base font-telemetry-data text-telemetry-data text-right ${p.kritis ? "font-bold text-error" : "font-semibold"}">${formatRupiah(p.tagihan)}</td>
      <td class="py-space-sm px-space-base">${badgeStatusBayar(p)}</td>
      ${badgeKeterlambatan(p)}
      <td class="py-space-sm px-space-base">${badgeSkor(p)}</td>
      <td class="py-space-sm px-space-base text-center">${badgeKategori(p)}</td>
      <td class="py-space-sm px-space-base text-center">${badgeProfit(p)}</td>
      <td class="py-space-sm px-space-base text-center">${badgeListrik(p)}</td>
      <td class="py-space-sm px-space-base">${badgeSms(p)}</td>
      <td class="py-space-sm px-space-base text-center">${aksiOperasional(p)}</td>
    </tr>`;
}

function renderPelangganTable() {
  const tbody = document.getElementById("pelangganTableBody");
  if (!tbody) return;
  tbody.innerHTML = DATA_PELANGGAN.map(renderPelangganRow).join("");
}

/* ---------- Sidebar: tandai menu aktif ---------- */

function setActiveSidebarLink(path) {
  const aside = document.querySelector("aside");
  if (!aside) return;
  aside.querySelectorAll("nav a").forEach((link) => {
    if (link.getAttribute("data-path") === path) {
      link.className =
        "flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-title-sm text-title-sm shadow-sm transition-all";
    }
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderPelangganTable();
  setActiveSidebarLink("data-pelanggan");
});
