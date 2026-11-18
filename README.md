# Merakit Mobil Mini — Remotion + React + Three.js

Video tutorial 3D berbahasa Indonesia tentang cara merakit mobil mini. Animasi dibangun dengan **React**, **Remotion**, dan **Three.js** melalui `@remotion/three`, sehingga dapat dipreview dan dirender sepenuhnya secara lokal.

Karakter pembuatnya adalah figur balok orisinal bernuansa kuning, merah, dan biru, mengikuti bahasa visual low-poly dari referensi yang diberikan. Dunia videonya berupa bengkel mainan yang terang, lengkap dengan sasis, roda, kabin, lampu, dan papan progres tutorial.

## Prasyarat

- Node.js 20 atau lebih baru
- npm 10 atau lebih baru

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka Remotion Studio yang dicetak di terminal, lalu pilih komposisi **CarAssembly**.

## Render video

```bash
npm run render
```

Hasil render berada di:

```text
out/car-assembly.mp4
```

Untuk membuat gambar poster dari frame akhir:

```bash
npm run still
```

## Spesifikasi video

| Properti | Nilai |
| --- | --- |
| Komposisi | `CarAssembly` |
| Ukuran | 1920 × 1080 |
| FPS | 30 |
| Durasi | 600 frame / 20 detik |
| Bahasa | Indonesia |

## Alur video

1. **Siapkan rangka** — sasis turun ke meja perakitan.
2. **Pasang empat roda** — roda dikunci satu per satu di poros.
3. **Kunci bodi & kabin** — bodi merah dan kabin masuk ke rangka.
4. **Tambahkan detail** — lampu dan atap menyelesaikan mobil.
5. **Mobil siap jalan** — mobil bergerak maju sebagai penutup.

## Struktur proyek

```text
src/
  index.ts              # Entry point Remotion
  Root.tsx              # Definisi komposisi
  CarAssembly.tsx       # Scene Three.js, karakter, mobil, dan overlay tutorial
public/reference/
  block-builder-reference.jpg  # Referensi visual yang diberikan pengguna
```

## Kustomisasi cepat

- Ubah durasi/FPS/resolusi di `src/Root.tsx`.
- Ubah teks langkah dan warna aksen pada konstanta `STEPS` di `src/CarAssembly.tsx`.
- Ubah nama bengkel dari `defaultProps.workshopName` di `src/Root.tsx`.
- Ubah bentuk mobil, figur, maupun bengkel pada komponen `Car`, `BlockyBuilder`, dan `Workshop`.
