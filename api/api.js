/**
 * api.js
 * -----------------------------------------------------------------------
 * Lapisan API untuk modul "Manajemen Akun & Hak Akses Personel".
 *
 * PENTING: Belum ada database/backend yang terhubung.
 * Semua fungsi di bawah ini sudah dibuat dengan bentuk request/response
 * final (async, mengembalikan Promise, format JSON), tapi datanya masih
 * kosong / dummy. Ketika backend sudah siap, cukup ganti isi fungsi
 * `request()` agar benar-benar memanggil endpoint, tanpa perlu mengubah
 * kode di script.js.
 * -----------------------------------------------------------------------
 */

const API_CONFIG = {
  // Ganti dengan base URL backend/API asli kamu, contoh:
  // baseUrl: "https://api.digita.pln.co.id/v1"
  baseUrl: "",
  endpoints: {
    listPersonnel: "/personnel",          // GET  ?search=&role=&unit=&page=&pageSize=
    personnelDetail: "/personnel/:id",    // GET
    createPersonnel: "/personnel",        // POST
    updatePersonnel: "/personnel/:id",    // PUT
    deletePersonnel: "/personnel/:id",    // DELETE
    exportPersonnel: "/personnel/export", // POST { ids: [] }
    stats: "/personnel/stats",            // GET -> total, aktif, dinonaktifkan
    roles: "/roles",                      // GET -> daftar peran untuk filter
    units: "/units",                      // GET -> daftar unit kerja untuk filter
  },
};

/**
 * Wrapper fetch generik. Saat ini di-nonaktifkan (belum ada server),
 * sehingga selalu melempar/mengembalikan data kosong secara terkendali.
 * Hapus blok "TODO" di bawah dan aktifkan fetch() asli saat backend siap.
 */
async function request(path, options = {}) {
  const url = `${API_CONFIG.baseUrl}${path}`;

  // ------------------------------------------------------------------
  // TODO: Aktifkan kode ini saat backend sudah tersedia.
  //
  // const res = await fetch(url, {
  //   method: options.method || "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     ...(options.headers || {}),
  //   },
  //   body: options.body ? JSON.stringify(options.body) : undefined,
  // });
  // if (!res.ok) {
  //   throw new Error(`API error ${res.status}: ${res.statusText}`);
  // }
  // return res.json();
  // ------------------------------------------------------------------

  console.warn(
    `[api.js] Belum terhubung ke database. Memanggil "${url}" (mock).`
  );
  return Promise.resolve(null);
}

/**
 * Mengambil daftar personel beserta filter & pagination.
 * @param {{search?:string, role?:string, unit?:string, page?:number, pageSize?:number}} params
 * @returns {Promise<{items: Array, total: number, page: number, pageSize: number}>}
 */
export async function fetchPersonnel(params = {}) {
  await request(API_CONFIG.endpoints.listPersonnel, { method: "GET" });

  // Belum ada data dari database -> kembalikan struktur kosong.
  return {
    items: [],
    total: 0,
    page: params.page || 1,
    pageSize: params.pageSize || 10,
  };
}

/** Mengambil ringkasan statistik (total, aktif, nonaktif). */
export async function fetchStats() {
  await request(API_CONFIG.endpoints.stats, { method: "GET" });
  return {
    totalPersonel: 0,
    penggunaAktif: 0,
    akunDinonaktifkan: 0,
    persentaseUnit: 0,
    persentaseHakAksesValid: 0,
  };
}

/** Mengambil daftar peran/role untuk dropdown filter. */
export async function fetchRoles() {
  await request(API_CONFIG.endpoints.roles, { method: "GET" });
  return [];
}

/** Mengambil daftar unit kerja untuk dropdown filter. */
export async function fetchUnits() {
  await request(API_CONFIG.endpoints.units, { method: "GET" });
  return [];
}

/** Membuat personel baru. */
export async function createPersonnel(payload) {
  return request(API_CONFIG.endpoints.createPersonnel, {
    method: "POST",
    body: payload,
  });
}

/** Memperbarui data personel. */
export async function updatePersonnel(id, payload) {
  return request(API_CONFIG.endpoints.updatePersonnel.replace(":id", id), {
    method: "PUT",
    body: payload,
  });
}

/** Menghapus / menonaktifkan personel. */
export async function deletePersonnel(id) {
  return request(API_CONFIG.endpoints.deletePersonnel.replace(":id", id), {
    method: "DELETE",
  });
}

/**
 * Meminta backend menyiapkan file export untuk baris-baris yang dicentang.
 * Jika backend belum ada, fallback-nya adalah generate CSV di sisi klien
 * (lihat downloadSelectedAsCSV di script.js).
 * @param {string[]} ids
 */
export async function exportPersonnel(ids) {
  return request(API_CONFIG.endpoints.exportPersonnel, {
    method: "POST",
    body: { ids },
  });
}