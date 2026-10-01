# Mengedit portfolio

Buka `/studio`, login, edit lalu Publish. Perubahan konten tampil lewat revalidasi 60 detik. Untuk perubahan kode/schema Studio di Vercel, commit, push, lalu tunggu deployment selesai.

| Menu Studio | Yang diatur |
| --- | --- |
| Profile & About → Hero & navbar | Nama, inisial logo, role bergantian |
| Profile & About → About | Deskripsi singkat, foto, lokasi, tempat/tanggal lahir, tinggi, tanggal mulai IT, bahasa, link PDDIKTI cadangan |
| Education · About | Gelar, kampus, GPA, link PDDIKTI; hanya dokumen dengan urutan pertama yang tampil |
| Profile & About → Contact & CV | Email, WhatsApp, GitHub, LinkedIn, Instagram, Letterboxd, file/link CV |
| Profile & About → Tech Stack | Enam kelompok skill; logo mengikuti nama masing-masing skill |
| Profile & About → Volunteer photos | Tiga foto homepage; bila kosong memakai foto dari aktivitas |
| Profile & About → Music | Upload audio; baru dimuat saat pengunjung menekan Play |
| Profile & About → Search & sharing | Judul profesi dan deskripsi untuk metadata |
| Publications · About | Judul paper, jurnal, edisi, tanggal dan DOI; tampil ringkas di bawah pendidikan |
| Projects | Judul, kategori Mobile/Full Stack Web, periode, deskripsi, stack, fitur, screenshot dan link |
| Work Experience | Perusahaan, posisi, periode, Responsibilities / job description, stack, foto |
| Volunteer | Ringkasan homepage, cerita detail, cover dan empat Documentation photos |

Homepage menampilkan maksimum empat proyek sesuai eligibility dan urutan; seluruh proyek terbit tersedia di `/projects`. Featured memprioritaskan urutan, bukan mengubah ukuran kartu.

Foto kerja memakai First work photo disusul Additional work photos: tiga preview, foto tambahan tersedia di viewer. Dokumentasi volunteer menampilkan empat foto pertama. Drag foto untuk mengubah urutan.

Umur, total proyek dan tahun IT dihitung otomatis. Languages memakai nama bahasa yang dimasukkan tanpa proficiency. Jika kosong, memakai Bahasa Indonesia dan English.

External CV link mendapat prioritas atas file CV. Foto About memakai Fallback About photo bila foto utama kosong. Field yang belum diisi dapat memakai data awal portfolio; tech stack kosong eksplisit menyembunyikan kartu skill.

Field layout lama, statistik manual, terjemahan yang belum aktif, serta bagian case study yang tidak dirender disembunyikan. Dokumen skillGroup dan certification lama tidak muncul di navigasi atau menu pembuatan dokumen. Data dan schema lamanya tetap disimpan; tidak perlu seed/import ulang.

Tombol Download CV membuka pilihan bahasa. Upload English CV file dan CV Bahasa Indonesia di Profile & About → Contact & CV. File CV lama tetap menjadi versi English; pastikan bahasanya benar. External English CV link menggantikan file English saja. Versi Indonesia yang kosong ditandai Not available yet.
