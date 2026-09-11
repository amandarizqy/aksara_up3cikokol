/* =========================================================
   PLN Smart Grid — Halaman "Data Pelanggan"
   Data Layer (Mock API)
   Sumber data tabel pelanggan. Nanti tinggal diganti hasil
   fetch() dari endpoint backend tanpa mengubah kode render
   (lihat pelanggan-app.js).

   Skema tiap pelanggan:
   - idpel, nama, catatan (opsional, subjudul di bawah nama)
   - noMeter, tarif (daya/tarif)
   - tagihan (angka, dirupiahkan otomatis)
   - statusBayar: 'lunas' | 'menunggak' | 'menunggak-kritis'
   - tunggakanHari (null jika lunas)
   - tunggakanWarna: 'error' | 'netral' (warna teks jumlah hari)
   - skor (1-9), kategori: 'K1' | 'K2' | 'K3'
   - profit (boolean)
   - listrik: 'ON' | 'OFF'
   - sms: { tipe: 'sukses' | 'menunggu' | 'belum' | 'mendesak', label }
   - kritis (boolean) -> baris prioritas shunt trip, style diperkuat
   ========================================================= */

const DATA_PELANGGAN = [
  {
    idpel: "PLN-5321098",
    nama: "PT Sinar Graha Logistik",
    noMeter: "542100981234",
    tarif: "B-3 / 330 kVA",
    tagihan: 48250000,
    statusBayar: "menunggak",
    tunggakanHari: 68,
    tunggakanWarna: "error",
    skor: 8,
    kategori: "K1",
    profit: true,
    listrik: "ON",
    sms: { tipe: "sukses", label: "Pengingat Terkirim" },
    kritis: false,
  },
  {
    idpel: "PLN-2144901",
    nama: "CV Anugerah Berkah Makmur",
    noMeter: "542100982211",
    tarif: "I-2 / 33 kVA",
    tagihan: 22100000,
    statusBayar: "menunggak",
    tunggakanHari: 45,
    tunggakanWarna: "error",
    skor: 7,
    kategori: "K2",
    profit: false,
    listrik: "ON",
    sms: { tipe: "menunggu", label: "Menunggu" },
    kritis: false,
  },
  {
    idpel: "PLN-7712390",
    nama: "Hendra Kurniawan",
    catatan: "Jadwal Shunt Trip Aktif",
    noMeter: "542100983344",
    tarif: "R-1 / 3500 VA",
    tagihan: 1450000,
    statusBayar: "menunggak-kritis",
    tunggakanHari: 75,
    tunggakanWarna: "error",
    skor: 8,
    kategori: "K1",
    profit: false,
    listrik: "OFF",
    sms: { tipe: "mendesak", label: "Pemutusan Terkirim" },
    kritis: true,
  },
  {
    idpel: "PLN-8840192",
    nama: "Workshop Baja Nusantara",
    noMeter: "542100984455",
    tarif: "I-3 / 197 kVA",
    tagihan: 31800000,
    statusBayar: "menunggak",
    tunggakanHari: 32,
    tunggakanWarna: "netral",
    skor: 6,
    kategori: "K2",
    profit: true,
    listrik: "ON",
    sms: { tipe: "belum", label: "Belum Dikirim" },
    kritis: false,
  },
  {
    idpel: "PLN-9102834",
    nama: "Koperasi Mitra Mandiri",
    noMeter: "542100985566",
    tarif: "B-2 / 16.5 kVA",
    tagihan: 9750000,
    statusBayar: "menunggak",
    tunggakanHari: 51,
    tunggakanWarna: "error",
    skor: 7,
    kategori: "K1",
    profit: true,
    listrik: "ON",
    sms: { tipe: "sukses", label: "Pengingat Terkirim" },
    kritis: false,
  },
  {
    idpel: "PLN-1049281",
    nama: "Rumah Sakit Mitra Sehat",
    noMeter: "542100986677",
    tarif: "S-3 / 555 kVA",
    tagihan: 18200000,
    statusBayar: "lunas",
    tunggakanHari: null,
    skor: 2,
    kategori: "K3",
    profit: true,
    listrik: "ON",
    sms: { tipe: "sukses", label: "Terkirim" },
    kritis: false,
  },
  {
    idpel: "PLN-3382910",
    nama: "Sentra Industri Kayu",
    noMeter: "542100987788",
    tarif: "I-2 / 66 kVA",
    tagihan: 14300000,
    statusBayar: "lunas",
    tunggakanHari: null,
    skor: 3,
    kategori: "K3",
    profit: true,
    listrik: "ON",
    sms: { tipe: "sukses", label: "Terkirim" },
    kritis: false,
  },
];
