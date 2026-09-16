/**
 * api/risiko-api.js
 * -----------------------------------------------------------------------
 * Lapisan API untuk "Modul Perencanaan & Analisis Risiko Pelanggan S41".
 *
 * PENTING: Belum ada database/backend yang terhubung. Sama seperti
 * api/api.js pada modul Pengguna & Akses, seluruh fungsi di sini sudah
 * berbentuk final (async, Promise, JSON) tapi masih mengembalikan data
 * kosong. Saat backend siap, cukup aktifkan fetch() di dalam request()
 * tanpa mengubah script/risiko.js.
 * -----------------------------------------------------------------------
 */

const API_CONFIG = {
  baseUrl: "", // contoh: "https://api.digita.pln.co.id/v1"
  endpoints: {
    summary: "/risiko/summary",                 // GET -> kartu statistik
    listPelanggan: "/risiko/pelanggan",         // GET ?search=&levelRisiko=&statusSurvei=&unit=&page=&pageSize=
    detailPelanggan: "/risiko/pelanggan/:id",   // GET
    uploadBillingHistory: "/risiko/billing/upload", // POST (multipart)
    inputSurveySR: "/risiko/survey",            // POST
    processRiskLevel: "/risiko/process-risk",   // POST -> hitung ulang matriks K x D
    approvePriorityRanking: "/risiko/approve-priority", // POST { ids: [] }
    verifySPK: "/risiko/pelanggan/:id/verifikasi-spk",  // POST
    exportPelanggan: "/risiko/pelanggan/export", // POST { ids: [] }
    filters: "/risiko/filters",                  // GET -> daftar level risiko & unit ULP
  },
};

async function request(path, options = {}) {
  const url = `${API_CONFIG.baseUrl}${path}`;

  // ------------------------------------------------------------------
  // TODO: Aktifkan saat backend tersedia.
  //
  // const res = await fetch(url, {
  //   method: options.method || "GET",
  //   headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  //   body: options.body ? JSON.stringify(options.body) : undefined,
  // });
  // if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  // return res.json();
  // ------------------------------------------------------------------

  console.warn(`[risiko-api.js] Belum terhubung ke database. Memanggil "${url}" (mock).`);
  return Promise.resolve(null);
}

/** Ringkasan 4 kartu statistik di bagian atas halaman. */
export async function fetchRisikoSummary() {
  await request(API_CONFIG.endpoints.summary, { method: "GET" });
  return {
    totalTargetPelanggan: 0,
    persentaseBillingTervalidasi: 0,
    surveiSelesai: 0,
    persentaseSurveiSelesai: 0,
    sisaPelangganSurvei: 0,
    matriksTeranalisis: 0,
    distribusiRisiko: { tinggi: 0, sedang: 0, rendah: 0 },
    targetPrioritasKuadran1: 0,
  };
}

/** Daftar pelanggan untuk tabel rekapitulasi, dengan filter & pagination. */
export async function fetchPelangganRisiko(params = {}) {
  await request(API_CONFIG.endpoints.listPelanggan, { method: "GET" });
  return {
    items: [],
    total: 0,
    page: params.page || 1,
    pageSize: params.pageSize || 5,
  };
}

/** Opsi filter (level risiko & unit ULP) untuk dropdown. */
export async function fetchRisikoFilters() {
  await request(API_CONFIG.endpoints.filters, { method: "GET" });
  return { levelRisiko: [], unit: [] };
}

export async function uploadBillingHistory(file) {
  return request(API_CONFIG.endpoints.uploadBillingHistory, { method: "POST", body: { file } });
}

export async function inputSurveySR(payload) {
  return request(API_CONFIG.endpoints.inputSurveySR, { method: "POST", body: payload });
}

export async function processRiskLevel() {
  return request(API_CONFIG.endpoints.processRiskLevel, { method: "POST" });
}

export async function approvePriorityRanking(ids) {
  return request(API_CONFIG.endpoints.approvePriorityRanking, { method: "POST", body: { ids } });
}

export async function verifySPK(id) {
  return request(API_CONFIG.endpoints.verifySPK.replace(":id", id), { method: "POST" });
}

export async function exportPelanggan(ids) {
  return request(API_CONFIG.endpoints.exportPelanggan, { method: "POST", body: { ids } });
}