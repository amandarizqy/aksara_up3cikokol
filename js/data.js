/* =========================================================
   PLN Smart Grid Dashboard — Data Layer (Mock API)
   Berperan sebagai sumber data (pengganti pemanggilan API asli).
   Nanti tinggal ganti isi PELANGGAN_PRIORITAS dengan hasil
   fetch() dari endpoint backend tanpa mengubah kode render (app.js).
   ========================================================= */

const PELANGGAN_PRIORITAS = [
  {
    idpel: "PLN-5321098",
    nama: "PT Sinar Graha Logistik",
    segmen: "B-3 / 330 kVA • Kawasan Industri Cikarang",
    tagihan: 48250000,
    tunggakanHari: 68,
    tunggakanSeverity: "high",
    skor: 8,
    skorKategori: "K1",
    profit: true,
    listrik: "ON",
    sms: "sent",
  },
  {
    idpel: "PLN-2144901",
    nama: "CV Anugerah Berkah Makmur",
    segmen: "I-2 / 33 kVA • Komp. Pergudangan Marunda",
    tagihan: 22100000,
    tunggakanHari: 45,
    tunggakanSeverity: "high",
    skor: 7,
    skorKategori: "K2",
    profit: false,
    listrik: "ON",
    sms: "waiting",
  },
  {
    idpel: "PLN-7712390",
    nama: "Hendra Kurniawan",
    segmen: "R-1 / 3500 VA • Jl. Dahlia Raya No. 42",
    tagihan: 1450000,
    tunggakanHari: 75,
    tunggakanSeverity: "high",
    skor: 8,
    skorKategori: "K1",
    profit: false,
    listrik: "OFF",
    sms: "disconnect",
  },
  {
    idpel: "PLN-8840192",
    nama: "Workshop Baja Nusantara",
    segmen: "I-3 / 197 kVA • Jl. Industri Karawang Barat Km 12",
    tagihan: 31800000,
    tunggakanHari: 32,
    tunggakanSeverity: "medium",
    skor: 6,
    skorKategori: "K2",
    profit: true,
    listrik: "ON",
    sms: "none",
  },
  {
    idpel: "PLN-9102834",
    nama: "Koperasi Mitra Mandiri",
    segmen: "B-2 / 16.5 kVA • Jl. Pahlawan Serpong Kav 3",
    tagihan: 9750000,
    tunggakanHari: 51,
    tunggakanSeverity: "high",
    skor: 7,
    skorKategori: "K1",
    profit: true,
    listrik: "ON",
    sms: "sent",
  },
];
