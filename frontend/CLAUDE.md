@AGENTS.md
# Konteks Project — Sistem Desa Ku

## Apa ini dan untuk apa
Sistem Desa Ku adalah dashboard monitoring **ketahanan desa**, dibuat untuk
kompetisi **Gemastik XIX 2026** kategori **PPL (Pengembangan Perangkat Lunak)**.
Tujuan utamanya: membantu pemerintah (DPMD) dan perangkat desa memantau kondisi
desa secara terukur di 8 aspek ketahanan, memverifikasi data yang masuk agar
kredibel, menampilkan hasilnya secara transparan ke masyarakat, dan membantu
pengambilan keputusan pembangunan lewat rekomendasi serta simulasi dampak
kebijakan (what-if).



## Siapa penggunanya dan apa yang mereka butuhkan
- **Admin (DPMD)** — butuh kepercayaan bahwa data yang tampil itu valid.
  Fitur intinya adalah *verifikasi* data sebelum resmi, dan bisa melihat
  kondisi semua desa sekaligus untuk perbandingan/prioritas.
- **Pengelola Desa (Perangkat Desa)** — orang di lapangan yang tahu kondisi
  riil desanya, tugasnya input data. Mereka bukan orang teknis, jadi form
  input harus jelas per indikator (bukan angka abstrak "skor kesehatan: 70"),
  supaya mereka tahu persis apa yang mereka laporkan.
- **Masyarakat** — publik umum, hanya ingin *melihat* kondisi desanya tanpa
  hambatan (makanya tanpa login). Transparansi adalah nilai jual utama di sini.

## Kenapa ada alur verifikasi
Data ketahanan desa itu sensitif dan bisa dipakai untuk pengambilan keputusan
anggaran/pembangunan. Sistem ini SENGAJA tidak langsung mempercayai input
mentah dari pengelola desa — harus dicek admin dulu (`status: pending →
verified/rejected`) sebelum masuk perhitungan `Score` yang tampil ke publik.
Ini bukan langkah birokrasi asal-asalan, tapi mekanisme kualitas data yang
jadi pembeda utama sistem ini dari sekadar spreadsheet biasa.

## Kenapa ada simulasi what-if
Salah satu nilai jual project ini ke juri: bukan cuma menampilkan data
(dashboard pasif), tapi membantu *pengambilan keputusan* — pengguna bisa
mencoba "kalau jumlah rumah sakit dikurangi dari 10 ke 5, dampaknya ke skor
kesehatan seperti apa?" sebelum keputusan itu benar-benar diambil di dunia
nyata. Ini area yang paling menunjukkan nilai AI/data science dari project
(scikit-learn akan dipakai untuk pemodelan dampak, meski di MVP 50% ini
boleh pakai perhitungan sederhana dulu seperti rata-rata tertimbang, asal
strukturnya sudah siap diganti dengan model yang lebih canggih nanti).

## Prinsip teknis yang perlu dipegang AI agent saat mengerjakan
- **Jangan hardcode secret/kredensial** apa pun (SECRET_KEY, password
  database, dll) — selalu lewat environment variable, karena project ini
  akan terus di-push ke GitHub repo publik/tim sepanjang development.
- **Ikuti struktur `models.py` yang sudah final** — jangan ubah desain
  skema tanpa didiskusikan, karena sudah disepakati lewat proses review
  bersama tim (bukan keputusan sepihak satu orang).
- **Backend dan frontend dikerjakan terpisah** (`backend/` dan `frontend/`
  dalam 1 repo/monorepo) — jangan campur dependency Python dan Node.js.
- **MVP 50% ini fokus backend API dulu**, divalidasi lewat Swagger UI
  (`/docs`), sebelum lanjut ke halaman frontend Next.js.
- Kode harus cukup rapi untuk dilanjutkan anggota tim lain (bukan cuma
  dikerjakan 1 orang) — beri nama variabel/fungsi yang jelas, karena ini
  project kolaboratif untuk lomba tim.