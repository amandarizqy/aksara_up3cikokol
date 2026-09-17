/* =========================================================
   DIGITA — API: Master Data Unit (Struktur Organisasi PLN)
   ---------------------------------------------------------
   Ganti API_BASE_URL & path endpoint di bawah ini agar
   sesuai dengan backend Anda yang sebenarnya.

   Kontrak response yang diharapkan dari GET /master-unit:
   {
     "data": [
       {
         "kode": "51000",
         "nama": "UID Jawa Timur",
         "deskripsi": "Unit Induk Distribusi Wilayah",
         "tingkat": 1,                 // 1=UI, 2=UP3, 3=ULP
         "parentKode": null,
         "parentNama": null,
         "pic": "Ir. Bambang Trihasto",
         "picJabatan": "Senior Manager Distribusi",
         "alamat": "Jl. Embong Trengguli No. 19-21, Surabaya",
         "telepon": "031-5345001",
         "status": "aktif"             // "aktif" | "nonaktif"
       },
       ...
     ],
     "meta": { "page": 1, "pageSize": 7, "totalItems": 131, "totalPages": 19 }
   }

   Kontrak response dari GET /master-unit/stats:
   {
     "unitInduk": 1,
     "unitIndukFoot": "UID Jawa Timur (Kantor Pusat)",
     "wilayahUp3": 16,
     "wilayahUp3Foot": "100% Aktif Tersinkronisasi S41",
     "poskoUlp": 114,
     "poskoUlpFoot": "Siaga Distribusi & Gardu Hubung"
   }
   ========================================================= */

const API_BASE_URL = "/api"; // TODO: sesuaikan, mis. "https://digita.pln.co.id/api"

/**
 * Ambil daftar unit master (dengan pencarian, filter tingkat & pagination).
 * @param {{search?:string, tingkat?:string|number, page?:number, pageSize?:number}} params
 */
export async function getMasterUnitList(params = {}) {
  const { search = "", tingkat = "", page = 1, pageSize = 7 } = params;

  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (tingkat) qs.set("tingkat", tingkat);
  qs.set("page", String(page));
  qs.set("pageSize", String(pageSize));

  const res = await fetch(`${API_BASE_URL}/master-unit?${qs.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Gagal memuat data unit (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Ambil ringkasan statistik untuk 3 kartu di bagian atas halaman.
 */
export async function getMasterUnitStats() {
  const res = await fetch(`${API_BASE_URL}/master-unit/stats`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Gagal memuat ringkasan unit (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Unduh data master unit (mis. sebagai file .xlsx/.csv) dan trigger
 * download langsung di browser. Sesuaikan path & format dengan backend.
 */
export async function exportMasterUnitData({ search = "", tingkat = "" } = {}) {
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (tingkat) qs.set("tingkat", tingkat);

  const res = await fetch(`${API_BASE_URL}/master-unit/export?${qs.toString()}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`Gagal mengekspor data (HTTP ${res.status})`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "master-unit.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Buat unit baru. Sambungkan ke form/modal "Tambah Unit Baru" saat sudah dibuat.
 * @param {object} payload
 */
export async function createMasterUnit(payload) {
  const res = await fetch(`${API_BASE_URL}/master-unit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Gagal menyimpan unit baru (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Perbarui data unit (dipakai tombol ✏️ edit di kolom Aksi).
 */
export async function updateMasterUnit(kode, payload) {
  const res = await fetch(`${API_BASE_URL}/master-unit/${encodeURIComponent(kode)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Gagal memperbarui unit (HTTP ${res.status})`);
  }
  return res.json();
}