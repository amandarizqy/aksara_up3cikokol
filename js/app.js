/* =========================================================
   PLN Smart Grid Dashboard — App Logic
   1) renderPriorityTable() -> merender tabel "Pelanggan Prioritas"
      dari data.js (PELANGGAN_PRIORITAS)
   2) Fungsi interaksi: showToast, sendSMS, confirmTrip,
      closeModal, executeTrip
   Membutuhkan: data.js (dimuat sebelum file ini)
   ========================================================= */

/* ---------- Util ---------- */

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

/* ---------- Badge builders (biar markup tabel tidak diulang manual) ---------- */

function badgeTunggakan(hari, severity) {
  const color = severity === "high" ? "error" : "secondary";
  return `
    <span class="inline-flex items-center gap-1 font-semibold text-${color} font-body-sm">
      <span class="w-1.5 h-1.5 rounded-full bg-${color}"></span> Menunggak ${hari} Hari
    </span>`;
}

function badgeSkor(skor, kategori) {
  const tinggi = skor >= 7;
  const label = tinggi ? "Tinggi" : "Sedang";
  const cls = tinggi
    ? "bg-error-container text-on-error-container"
    : "bg-surface-container-high text-secondary";
  return `
    <span class="inline-flex items-center px-2 py-0.5 rounded-full ${cls} font-label-sm text-label-sm font-semibold">
      Skor ${skor} (${label} / ${kategori})
    </span>`;
}

function badgeProfit(isProfit) {
  return isProfit
    ? `<span class="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">Profit</span>`
    : `<span class="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-medium">Tidak Profit</span>`;
}

function badgeListrik(status) {
  if (status === "ON") {
    return `
      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span> ON
      </span>`;
  }
  return `
    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
      <span class="w-2 h-2 rounded-full bg-error"></span> OFF (Shunt Trip)
    </span>`;
}

const SMS_BADGE_MAP = {
  sent: {
    cls: "bg-surface-container-high text-primary",
    icon: "check",
    label: "Pengingat Terkirim",
  },
  waiting: {
    cls: "bg-surface-container text-secondary",
    icon: "hourglass_empty",
    label: "Menunggu",
  },
  none: {
    cls: "bg-surface-container text-on-surface-variant",
    icon: "remove",
    label: "Belum Dikirim",
  },
  disconnect: {
    cls: "bg-error-container text-on-error-container",
    icon: "check",
    label: "Pemberitahuan Pemutusan Terkirim",
  },
};

function badgeSms(type) {
  const s = SMS_BADGE_MAP[type];
  return `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.cls} font-label-sm text-label-sm font-medium">
      <span class="material-symbols-outlined text-[14px]">${s.icon}</span> ${s.label}
    </span>`;
}

function aksiOperasional(p) {
  const detailBtn = `
    <button class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface text-label-sm font-medium transition-all"
      onclick="showToast('Membuka profil ${p.idpel}')" title="Detail Profil Pelanggan">
      <span class="material-symbols-outlined text-[16px]">open_in_new</span><span>Detail</span>
    </button>`;

  const smsBtn = `
    <button class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface text-label-sm font-medium transition-all"
      onclick="sendSMS('${p.idpel}')" title="Kirim SMS Pengingat">
      <span class="material-symbols-outlined text-[16px]">sms</span><span>SMS</span>
    </button>`;

  const controlBtn =
    p.listrik === "OFF"
      ? `
    <button class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary text-label-sm font-medium transition-all"
      onclick="showToast('Evaluasi pemulihan / penyambungan ulang siap diproses')" title="Sambung Kembali (Reclose)">
      <span class="material-symbols-outlined text-[16px]">replay</span><span>Kontrol</span>
    </button>`
      : `
    <button class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-error-container hover:bg-error hover:text-on-error text-on-error-container text-label-sm font-medium transition-all"
      onclick="confirmTrip('${p.idpel}', '${p.nama.replace(/'/g, "\\'")}')" title="Pemicu Shunt Trip Breaker">
      <span class="material-symbols-outlined text-[16px]">power_settings_new</span><span>Kontrol</span>
    </button>`;

  return `<div class="flex items-center justify-center gap-1.5">${detailBtn}${smsBtn}${controlBtn}</div>`;
}

/* ---------- Render baris tabel ---------- */

function renderPriorityRow(p) {
  const rowHighlight = p.listrik === "OFF" ? " bg-error-container/10" : "";
  return `
    <tr class="hover:bg-surface-container-low/70 transition-colors group${rowHighlight}">
      <td class="py-3 px-space-base font-telemetry-data text-telemetry-data font-semibold text-primary">${p.idpel}</td>
      <td class="py-3 px-space-base">
        <div class="flex flex-col">
          <span class="font-title-sm text-title-sm text-on-surface">${p.nama}</span>
          <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">${p.segmen}</span>
        </div>
      </td>
      <td class="py-3 px-space-base text-right font-telemetry-data text-telemetry-data font-bold text-on-surface">${formatRupiah(p.tagihan)}</td>
      <td class="py-3 px-space-base">${badgeTunggakan(p.tunggakanHari, p.tunggakanSeverity)}</td>
      <td class="py-3 px-space-base text-center">${badgeSkor(p.skor, p.skorKategori)}</td>
      <td class="py-3 px-space-base text-center">${badgeProfit(p.profit)}</td>
      <td class="py-3 px-space-base text-center">${badgeListrik(p.listrik)}</td>
      <td class="py-3 px-space-base text-center">${badgeSms(p.sms)}</td>
      <td class="py-3 px-space-base text-center">${aksiOperasional(p)}</td>
    </tr>`;
}

function renderPriorityTable() {
  const tbody = document.getElementById("priorityTableBody");
  if (!tbody) return;
  tbody.innerHTML = PELANGGAN_PRIORITAS.map(renderPriorityRow).join("");
}

/* ---------- Interaksi: Toast ---------- */

function showToast(msg, isSuccess = true) {
  const toast = document.getElementById("actionToast");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  msgEl.innerText = msg;
  iconEl.innerText = isSuccess ? "check_circle" : "warning";
  iconEl.className = isSuccess
    ? "material-symbols-outlined text-[20px] text-primary"
    : "material-symbols-outlined text-[20px] text-error";

  toast.classList.remove("translate-y-20", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-20", "opacity-0");
  }, 3500);
}

/* ---------- Interaksi: SMS ---------- */

function sendSMS(idpel) {
  showToast(`SMS Pengingat Keterlambatan Terkirim ke ID: ${idpel}`, true);
}

/* ---------- Interaksi: Modal Konfirmasi Shunt Trip ---------- */

function confirmTrip(idpel, name) {
  document.getElementById("modalIdpel").innerText = idpel;
  document.getElementById("modalName").innerText = name;
  document.getElementById("shuntModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("shuntModal").classList.add("hidden");
}

function executeTrip() {
  const idpel = document.getElementById("modalIdpel").innerText;
  closeModal();
  showToast(`Perintah Shunt Trip Berhasil Dikirim ke Unit Breaker (${idpel})`, true);
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", renderPriorityTable);
