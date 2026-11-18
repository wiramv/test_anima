# Merakit Mobil di Dunia LEGO — Remotion + Three.js

Proyek video **10 menit**, tanpa dialog dan tanpa musik, yang menampilkan
perakitan mobil coupe retro oranye di diorama garasi LEGO. Video dibangun dengan
**React**, **Remotion**, React Three Fiber, dan `@remotion/three`.

Seluruh pengembangan mengikuti naskah produksi di
[`docs/lego-car-video-script.md`](docs/lego-car-video-script.md): 18.000 frame
pada 30 fps, 50 langkah instruksi, 13 scene, kamera editorial 6-detik,
minifig mekanik ber-rig kaku, serta sistem cue SFX deterministik.

## Fitur visual

- Brick skala LEGO dengan stud 48-segmen, bevel `0.04`, dan material ABS fisik
  (clearcoat, IOR, roughness plastik).
- Minifig mekanik kuning/merah/biru dengan kepala 48-segmen, print wajah tetap,
  torso tapered, tangan C-clip berongga, serta pose sendi kaku ala LEGO.
- Coupe retro oranye 8×22 stud yang dibangun dalam 16 modul: chassis, gardan,
  suspensi, V8, drivetrain, knalpot, roda, panel, fender, kabin, interior, dan
  detail akhir.
- Garasi cutaway mengacu pada referensi yang Anda berikan: dinding bata,
  jendela, jam, AC, toolbox, pegboard, lift dua tiang, grating, hazard stripe,
  rak cairan/tabung gas, creeper, stool, hoist, pallet, dan mesin V8.
- Kamera deterministik dengan wide/medium/macro/top-down, DOF, AO, bloom tipis,
  SMAA, vignette, bayangan 4096, dan ACES Filmic tone mapping.
- Overlay manual minimal: step counter 01–50, PLI parts panel, dan panah callout.

## Mulai lokal

```bash
npm install
npm run dev
```

Buka Remotion Studio dan pilih komposisi **LegoCar**.

## Render

Render video penuh (10 menit):

```bash
npm run render
```

Render vertical slice Scene 2 / chassis dengan supersample 2×:

```bash
npm run render:scene2
```

Buat poster frame final:

```bash
npm run still
```

Output tersimpan di direktori `out/`.

> Render penuh memiliki 18.000 frame. Untuk QA, render scene per scene terlebih
> dahulu dan gunakan concurrency rendah seperti yang sudah ditetapkan pada script.

## Audio SFX

Naskah mensyaratkan SFX, tanpa narasi atau musik. Karena tidak ada file audio
berlisensi yang diberikan, cue sheet sudah tersedia di `src/audio/cues.ts`,
namun mix dinonaktifkan secara default supaya render tidak gagal akibat aset yang
hilang.

1. Tambahkan file WAV berlisensi ke `public/sfx/` sesuai
   [`public/sfx/README.md`](public/sfx/README.md).
2. Ubah `soundEnabled: false` menjadi `true` dalam `src/Root.tsx`.

## Struktur

```text
src/
  Main.tsx                    # Komposisi 10-menit dan post-processing
  lego/
    Brick.tsx                 # ABS, rounded parts, brick/stud, Technic pin
    Minifigure.tsx            # Mekanik LEGO dengan rig sendi kaku
    RetroCoupe.tsx            # Coupe 16-modul dan animasi snap-in
    snapIn.ts                 # Animasi klik deterministik
  scenes/
    timeline.ts               # 13 scene, 18.000 frame, 100 camera shots
    CameraRig.tsx             # Kamera keyframe berbasis useCurrentFrame
    Garage.tsx                # Diorama garage cutaway
  overlay/ManualOverlay.tsx   # Step, PLI, dan callout
  audio/
    cues.ts                   # Cue sheet SFX deterministik
    SfxTrack.tsx              # Router audio opsional
public/
  reference/                  # Gambar referensi dari pengguna
  sfx/README.md               # Manifest file audio yang diperlukan
docs/
  lego-car-video-script.md    # Naskah produksi sumber
```

## Spesifikasi

| Properti | Nilai |
| --- | --- |
| Komposisi | `LegoCar` |
| Durasi | 18.000 frame / 10:00 |
| Frame rate | 30 fps |
| Resolusi | 1920×1080 |
| Render macro | `--scale=2` disarankan |
| Audio | SFX saja, tanpa narasi/musik |
