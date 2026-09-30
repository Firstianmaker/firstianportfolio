# Mengedit portfolio

Buka `/studio`, login ke Sanity, edit dokumen lalu Publish. Situs mengambil pembaruan CMS dengan revalidasi 60 detik. Revisi ini menambahkan field tanpa menghapus data lama.

| Bagian | Lokasi pengaturan |
| --- | --- |
| Role bergantian | Profile & About → Animated career roles |
| Deskripsi About singkat | Profile & About → Short About description |
| Foto pribadi | Profile & About → About personal photo (Hero personal photo menjadi cadangan) |
| Tempat/tanggal lahir, tinggi | Profile & About → Place of birth, Date of birth, Height (cm) |
| Mulai pengalaman IT | Profile & About → IT experience start date |
| Lokasi dan email | Profile & About → Location, Email |
| GPA | Dokumen pendidikan pertama → GPA |
| GitHub, LinkedIn, Instagram | Profile & About → URL masing-masing platform |
| CV | Profile & About → CV file atau External CV link |
| Kartu/detail proyek | Dokumen project → nama, summary/description, period, tech stack, highlights, cover image, gallery, GitHub URL |
| Foto kerja | Dokumen experience → image dan gallery; foto pertama menjadi preview kartu |
| Tiga foto volunteer | Profile & About → Volunteer showcase (3 images), sesuai urutan |
| Daftar volunteer | Dokumen community/activity yang sudah ada |
| Kelompok dan skill | Profile & About → Technical skills (GitHub README) → Group name, Skills |

CV eksternal mendapat prioritas; jika kosong, tombol memakai file yang diunggah melalui `/cv`. Tanpa file/link, situs menampilkan status belum tersedia. URL sosial kosong juga tidak menjadi tautan palsu.

Data awal yang disetujui ada di `src/data/presentation.ts`: Jakarta, 11 Agustus 2004, tinggi 175 cm, mulai IT 1 Agustus 2022 untuk perhitungan bulan/tahun. Berat tidak ditampilkan. Data CMS mengungguli nilai awal tersebut. Field yang belum ada memakai nilai awal; string kosong eksplisit tetap kosong. About singkat dan tiga career role kini mengikuti README GitHub yang diberikan. GitHub dan LinkedIn juga sudah terisi dari README; Instagram belum ada URL.

Umur dihitung otomatis dari tanggal lahir. Tahun IT menghitung tahun penuh sejak tanggal mulai, dengan keterangan study & projects. Total proyek mengikuti jumlah proyek pada data, bukan angka manual di field legacy Profile metrics.

Tech stack mengikuti enam kelompok dari README: Languages, Web & Backend, Mobile, Machine Learning, Databases & Caching, Tools & Deployment. Nilai awal ada di `src/data/technical-stack.ts`; jika field Technical skills di CMS diisi, nilainya menggantikan seluruh daftar awal. Array kosong menyembunyikan seluruh daftar. Nama skill yang dikenal memakai ikon lokal di `public/images/skills`, nama baru memakai inisial sampai pemetaan ikon ditambahkan. Daftar stack pembangun situs di hero tetap mengikuti implementasi sebenarnya.

Jika Volunteer showcase belum berisi foto, situs mencoba cover/gallery aktivitas sebelum menampilkan placeholder. Gambar project bawaan masih placeholder; ganti dengan screenshot asli melalui CMS. Galeri mendukung zoom 100–300%, scroll untuk menggeser gambar, tombol sebelumnya/berikutnya, dan Escape untuk menutup.

Field lama tetap disimpan untuk kompatibilitas. Introduction, About panjang, About tagline, Experience introduction, dan Profile metrics bukan sumber tampilan About baru.


Contact di header, hero dan footer kini menuju WhatsApp dari field WhatsApp number dan WhatsApp default message. Foto pengalaman memakai image + gallery, dengan maksimum tiga preview di atas jobdesk. Isi jobdesk dan stack tetap berasal dari dokumen experience. Dev indicator Next.js dimatikan melalui `devIndicators: false`.
