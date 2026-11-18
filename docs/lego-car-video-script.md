---
title: Script Video Bisu – Merakit Mobil di Dunia LEGO
tags: [remotion, threejs, lego, video-script, sfx]
durasi: "10:00"
fps: 30
total-frame: 18000
resolusi: 1920x1080 (render supersample 2x)
---

# Script Video Bisu: Merakit Mobil di Dunia LEGO

> [!info] Spesifikasi singkat
> 10:00 · 30 fps · 18.000 frame · 1920×1080 · tanpa narasi, hanya SFX · Remotion + Three.js · gaya "ASMR build" + manual instruksi LEGO (step counter di layar, tanpa teks panjang).

---

## 1. Anti-low-poly: penyebab & perbaikan

| Penyebab tampilan low poly | Perbaikan wajib |
|---|---|
| `BoxGeometry` tepi tajam | `RoundedBox` radius **0.04 stud** (≈0.3 mm, sama dengan tepi brick asli), smoothness 6 |
| Silinder 8–12 segmen | Stud **48 segmen**, bagian bulat minifig 32–64 segmen |
| `flatShading` / normal kasar | Smooth normals, hapus `flatShading` |
| `MeshStandardMaterial` datar | `MeshPhysicalMaterial` preset ABS (lihat 1.2) |
| Tanpa environment map | HDRI indoor (Poly Haven, CC0) + PMREM |
| Tanpa AO & bayangan keras | N8AO/GTAO + shadow map 4096, `normalBias` 0.02 |
| Antialias mati, DPR 1 | MSAA 8× + render supersample 2× lalu downscale |
| Minifig dari primitive | Pakai **part LDraw asli** (lihat bagian 2) |

### 1.1 Satuan & ukuran asli
1 unit = **1 stud = 8 mm**.

| Elemen | Unit |
|---|---|
| Brick tinggi | 1.2 (9.6 mm) |
| Plate tinggi | 0.4 (3.2 mm) |
| Stud Ø × tinggi | 0.6 × 0.2125 (4.8 × 1.7 mm) |
| Minifig tinggi | ≈ 5 (40 mm) |

### 1.2 Preset material

| Material | Setting |
|---|---|
| ABS glossy | `roughness .30` `clearcoat .5` `clearcoatRoughness .25` `ior 1.45` + roughnessMap noise halus (efek butiran plastik) |
| Transparan (kaca, lampu) | `transmission 1` `thickness .15` `ior 1.5` `roughness .05`; lampu menyala = `emissive` + bloom |
| Ban karet | `roughness .85`, warna `#1A1A1A`, normal map tapak |
| Logam tool | `metalness 1` `roughness .35` |
| Lantai tile | `clearcoat 1` `roughness .2`, grout lewat normal map, refleksi |
| Pallet kayu | warna Tan, `roughness .7`, tekstur serat |

### 1.3 Palet warna LEGO

| Nama | Hex |
|---|---|
| Red | `#C91A09` |
| Blue | `#0055BF` |
| Yellow | `#F2CD37` |
| Black | `#05131D` |
| Light Bluish Gray | `#A0A5A9` |
| Dark Bluish Gray | `#6C6E68` |
| White | `#FFFFFF` |
| Orange (mobil) | `#FE8A18` |
| Tan | `#E4CD9E` |
| Dark Orange (bata ekspos) | `#A95500` |

### 1.4 Level of detail
- Shot **macro / close-up**: detail penuh (tube bawah brick, lubang Technic, bevel stud).
- Shot **wide**: instancing + geometry disederhanakan (InstancedMesh untuk stud dan tile).

---

## 2. Karakter: Minifig "Mekanik"

Desain mengikuti konsep: kepala kuning, torso merah, sabuk hitam, celana biru. Ditambah detail agar tidak low poly.

| Bagian | Spesifikasi |
|---|---|
| Kepala | Silinder sedikit meruncing, 48 segmen, bevel tepi atas, stud di kepala. Wajah = **decal PNG 1024 px** (dua titik oval hitam + senyum sederhana) di plane transparan menempel depan kepala |
| Torso | Trapesium tapering halus, tepi rounded, print sabuk hitam di bawah, tag kecil di dada (opsional) |
| Lengan | Peg bahu, bentuk silinder agak pipih, bisa berputar di bahu |
| Tangan | **C-clip** dengan lubang asli: `ExtrudeGeometry` dari `Shape` C + bevel. Bukan bola atau kotak |
| Pinggul & kaki | Celah hitam tengah antar kaki, kaki dengan "ledge" tebal, tepi rounded |
| Material | ABS glossy, kuning `#F2CD37`, merah `#C91A09`, biru `#0055BF` |

### 2.1 Cara dapat geometry halus (pilih satu)
1. **LDrawLoader** (`three/examples/jsm/loaders/LDrawLoader`) dengan part library resmi. ID part: head `3626`, torso `973`, lengan kanan `3818`, kiri `3819`, tangan `3820`, hips `3815`, kaki kanan `3816`, kiri `3817`.
2. **Blender + ImportLDraw** → export glTF (Draco) → `GLTFLoader`.
3. Model minifig CC0 dari Sketchfab, lalu ganti material ke preset ABS.

Muat tiap bagian **sebagai grup terpisah** (head, torso, armL, armR, handL, handR, hips, legL, legR) dan pasang pivot manual untuk animasi.

### 2.2 Aturan gerak (harus kaku ala LEGO)
- Sendi hanya: leher (putar kiri-kanan), bahu (ayun depan-belakang & samping), pergelangan (tangan berputar 360°), pinggul (kaki ayun depan-belakang; duduk = tekuk 90°).
- Jalan: kaki ayun bergantian ±35°, torso twist ±8°, bobbing kecil naik-turun. Tidak ada tekukan lutut atau siku.
- Berbaring (di creeper): seluruh badan rebah 90° kaku, tangan terangkat.
- Ekspresi wajah **tidak berubah**. Emosi lewat gerak kepala dan lengan.

### 2.3 Karakter pendukung
Tidak ada. Hanya satu minifig di sepanjang video, supaya fokus dan hemat render.

---

## 3. Mobil: Orange Retro Coupe

Gaya coupe klasik dua pintu, orange `#FE8A18`, strip balap putih di kap dan atap, trim hitam, velg abu terang. Ukuran ±8 stud lebar × 22 stud panjang × ±4 brick tinggi. Skala sinematik, boleh dilebih-lebihkan agar minifig terasa "bekerja" di atasnya.

Dirakit dari **16 modul** (tiap modul = 1 atau beberapa langkah):

| # | Modul |
|---|---|
| 1 | Rangka chassis (balok Technic + baseplate 8×24) |
| 2 | Gardan depan + belakang |
| 3 | Shock + pegas |
| 4 | Rack steering + kolom |
| 5 | Mesin V8 + intake + header |
| 6 | Gearbox + driveshaft |
| 7 | Tangki + aki |
| 8 | Knalpot |
| 9 | Roda ×4 (hub, ban, 4 mur) |
| 10 | Lantai bodi + firewall |
| 11 | Panel samping / rangka pintu L & R |
| 12 | Fender ×4 |
| 13 | Kap mesin + bagasi |
| 14 | Atap + tiang + kaca (depan, belakang, samping) |
| 15 | Jok ×2, dashboard, setir, tuas |
| 16 | Lampu, bumper, grille, spion, wiper, plat nomor |

---

## 4. Background: Garasi (referensi gambar 1)

Diorama garasi **cutaway**: dua dinding (belakang + kiri/kanan), sisi depan terbuka untuk kamera.

| Zona | Isi |
|---|---|
| Dinding belakang | Bata putih dengan tambalan bata oranye ekspos (distressed); jendela bingkai hitam 2×3 panel (cahaya utama dari sini); jam dinding bulat; unit AC/ventilasi abu di kiri atas; plint hitam di bawah |
| Kiri | Toolbox merah 3 laci + pegboard berisi kunci pas; rak kecil berisi botol/kaleng; kursi bar bulat hitam; troli tool merah |
| Kanan | Rak tabung gas (hijau, merah, abu) + tangki abu dengan selang; creeper merah; tong abu |
| Tengah | **Lift 2-tiang merah** dengan swing arm; kisi grating abu gelap; strip hazard kuning-hitam di lantai |
| Depan | Pallet kayu Tan; mesin V8 di atas pallet (kanan depan) |
| Lantai | Tile abu terang 2×2 plate, glossy, refleksi lembut |
| **Tambahan** | Engine hoist merah (dipakai di Scene 4), stool pendek (dipakai di Scene 8) |

Atmosfer: debu halus di berkas cahaya jendela (particle instanced), jam dinding berdetak, kilau lantai.

---

## 5. Look, lighting & kamera

| Aspek | Setting |
|---|---|
| Key light | Cahaya jendela kanan: `DirectionalLight` dingin, shadow 4096, `shadow.radius` 4, `bias -0.0002`, `normalBias 0.02` |
| Fill | HDRI indoor hangar/studio, intensitas 0.6 |
| Practical | Lampu tube langit-langit: spot hangat 2–3 titik, kedip halus hanya di intro |
| Post | N8AO (radius 0.5), DoF (miniatur tilt-shift), bloom tipis hanya pada emissive, SMAA, vignette 0.15 |
| Tone mapping | ACES Filmic, exposure 1.0 |
| Grade | Highlight sedikit hangat, saturasi +8%, kontras sedang. Abu netral supaya merah/oranye/kuning menonjol |
| Lensa | Wide: FOV 30 · Medium: 28 · Macro: 18–22 (DoF sempit) |

### 5.1 Aturan editing agar 10 menit tidak membosankan
- Potong shot tiap **4–8 detik**. Tiap langkah wajib punya 1 shot macro "memuaskan" (stud masuk, klik).
- Variasi 3 rig: wide, medium, macro. Jangan ulang sudut sama lebih dari 2× berturut-turut.
- Sisipkan **speed ramp / time-lapse** untuk langkah repetitif (pasang mur, tumpuk panel).
- Setiap akhir modul: orbit pendek 360° + `UI_step_ding`.

---

## 6. Overlay ala manual LEGO

- **Step counter** kotak rounded putih, kiri bawah, angka besar (1–50). Animasi pop-in 8 frame.
- **PLI box** (daftar part) kiri atas: ikon part + "×2", muncul 1 detik sebelum part masuk.
- **Callout panah** kuning ke titik pemasangan, hilang saat part terpasang.
- Highlight part: outline glow putih 6 frame saat part diangkat.
- Teks sangat minim (hanya angka & ikon). Judul di Scene 0 dan penutup saja.

Pemetaan step: S2 = 1–6 · S3 = 7–12 · S4 = 13–19 · S5 = 20–24 · S6 = 25–30 · S7 = 31–36 · S8 = 37–43 · S9 = 44–47 · S10 = 48–50.

---

## 7. Sistem audio (tanpa narasi, tanpa musik)

> [!tip] Rekam sendiri
> Klik brick asli paling autentik. Rekam dengan HP di ruangan sepi (snap kecil, besar, tekan, jatuh, sliding), lalu layer dengan sample library.
> Sumber lain: Freesound (filter CC0), Pixabay SFX, Zapsplat, atau generate via ElevenLabs Sound Effects.
> Musik opsional: lo-fi instrumental sangat pelan (−26 dB), default **tanpa musik**.

### 7.1 Library SFX (nama file = ID, simpan di `public/sfx/`)

| Grup | ID (varian → `_01`, `_02`, …) |
|---|---|
| Ambience (loop) | `AMB_garage_room`, `AMB_tube_hum`, `AMB_clock_tick` |
| Cahaya | `LIGHT_switch_click`, `LIGHT_flicker` |
| Foley minifig | `FOL_step` (4), `FOL_turn`, `FOL_grab`, `FOL_sit`, `FOL_clap`, `FOL_lay` |
| Brick | `BRK_snap_s` (6), `BRK_snap_m` (4), `BRK_snap_l` (3), `BRK_press`, `BRK_slide`, `BRK_drop` (4), `BRK_spill`, `BRK_pin` (4) |
| Tool | `TLS_ratchet` (3), `TLS_impact` (3), `TLS_clink`, `TLS_drawer_open`, `TLS_drawer_close`, `TLS_hammer`, `TLS_cloth_wipe` |
| Mesin bengkel | `MCH_lift_up`, `MCH_lift_down`, `MCH_lift_lock`, `MCH_hoist_pump` (3), `MCH_hoist_roll`, `MCH_chain_clink`, `MCH_creeper_roll`, `MCH_cart_roll`, `MCH_spring_boing` |
| Mesin mobil | `ENG_crank`, `ENG_start`, `ENG_idle` (loop), `ENG_rev` (2), `ENG_off`, `ENG_drive_away`, `EXH_puff` |
| Mobil | `CAR_door`, `CAR_horn`, `CAR_wiper`, `CAR_tire_squeak`, `CAR_bounce` |
| UI | `UI_step_ding`, `UI_whoosh`, `UI_title`, `UI_end`, `UI_sparkle` |

### 7.2 Level mixing

| Layer | dB | `volume` Remotion |
|---|---|---|
| Ambience | −30 | 0.03 |
| Foley minifig | −20 | 0.10 |
| UI | −20 | 0.10 |
| Mesin bengkel | −16 | 0.16 |
| Brick snap | −14 | 0.20 |
| Tool | −12 | 0.25 |
| Engine | −10 | 0.32 |

- Target master: **−14 LUFS integrated, true peak −1 dBTP**.
- Bus SFX diberi reverb ruang kecil (RT60 ≈ 0.4 s), kecuali UI.
- Saat engine menyala: ambience turun −6 dB.
- Remotion tidak punya pan. Jika ingin stereo placement, bake varian L/R di DAW atau mix akhir di DAW memakai export cue list (bagian 9.4).
- Variasi: pilih varian SFX dengan seed deterministik per frame agar render ulang konsisten dan suara tidak monoton.

---

## 8. Script scene by scene

Format tabel: **waktu** (mm:ss) · kamera · aksi · SFX. Frame @30 fps.

### Scene 0: Intro · 00:00–00:25 · f0–750

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 0:00–0:03 | Hitam → fade-in | Lampu tube menyala dengan 3 kedipan | `LIGHT_switch_click`, `LIGHT_flicker`, fade-in `AMB_garage_room` + `AMB_tube_hum` |
| 0:03–0:10 | Wide dolly-in pelan, setara gambar referensi | Debu di berkas cahaya jendela. Part mobil tertata di lantai depan. Jam berdetak | `AMB_clock_tick` |
| 0:10–0:15 | Macro pan rak tool → rack focus ke jam (08:00) | Pantulan lantai, kilau toolbox | `UI_whoosh` ringan |
| 0:15–0:22 | Medium, sedikit low-angle | Brick jatuh satu per satu membentuk judul "MERAKIT MOBIL" | cascade `BRK_drop` ×6, `UI_title` |
| 0:22–0:25 | Whip pan kiri | Minifig masuk frame dari kiri | `FOL_step` mulai |

### Scene 1: Persiapan · 00:25–01:05 · f750–1950

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 0:25–0:33 | Medium tracking sejajar | Minifig jalan ke toolbox, laci geser keluar, ambil kunci pas | `FOL_step` ×N, `TLS_drawer_open`, `TLS_clink`, `TLS_drawer_close` |
| 0:33–0:42 | Medium → low angle | Dorong troli part, tata part rapi di lantai (knolling), tiap part pop kecil | `MCH_cart_roll`, `BRK_drop` lembut ×N |
| 0:42–0:55 | **Top-down** | 16 grup part menyala berurutan dengan ikon | `UI_step_ding` ×16 (pitch naik bertahap) |
| 0:55–1:05 | Medium | Minifig tepuk tangan (clip), lihat blueprint di dinding, lift turun ke level kerja | `FOL_clap`, `MCH_lift_down`, `MCH_lift_lock` |

### Scene 2: Chassis · 01:05–02:05 · f1950–3750 · Step 1–6

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 1:05–1:15 | Medium | Lift naik ke tinggi pinggang. Dua balok Technic panjang diletakkan di swing arm | `MCH_lift_up`, `MCH_lift_lock`, `BRK_snap_l` |
| 1:15–1:28 | **Macro stud** | 3 cross member dipasang, tube bawah masuk ke stud (squish halus) | `BRK_snap_s` ×3 |
| 1:28–1:40 | Medium samping | Baseplate 8×24 ditekan dengan dua tangan, tekanan bertahap lalu klik | `BRK_press` |
| 1:40–1:52 | Macro | Pin Technic dimasukkan satu per satu, kamera ikut tiap pin | `BRK_pin` ×6 |
| 1:52–2:05 | Orbit 360° pelan | Braket steering terpasang. Chassis selesai, kilau di tepi bevel | `BRK_snap_m`, `UI_step_ding`, `UI_sparkle` |

### Scene 3: Gardan & suspensi · 02:05–03:05 · f3750–5550 · Step 7–12

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 2:05–2:20 | Low wide | Minifig berbaring di creeper, meluncur ke bawah chassis | `FOL_lay`, `MCH_creeper_roll` |
| 2:20–2:38 | Under-chassis POV | Gardan depan dipasang, mur diputar dengan kunci pas | `BRK_snap_l`, `TLS_ratchet` ×4 |
| 2:38–2:50 | Macro | Shock + pegas dipasang, pegas ditekan lalu memantul | `BRK_snap_m`, `MCH_spring_boing` |
| 2:50–2:58 | Medium | Gardan belakang + diferensial dipasang | `BRK_snap_l`, `TLS_ratchet` |
| 2:58–3:05 | Macro | Rack steering dihubungkan, tie rod diputar, hub roda berputar. Step selesai | `BRK_snap_s`, `UI_step_ding` |

### Scene 4: Mesin · 03:05–04:15 · f5550–7650 · Step 13–19

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 3:05–3:18 | Medium | Engine hoist merah didorong ke pallet, rantai dikaitkan ke mesin | `MCH_hoist_roll`, `MCH_chain_clink` |
| 3:18–3:35 | Low angle dramatis | Handle pompa ditekan, mesin V8 naik pelan dari pallet | `MCH_hoist_pump` ×5 |
| 3:35–3:50 | Wide tracking | Mesin diayun melintasi garasi ke atas chassis, bayangan menyapu lantai | `MCH_hoist_roll`, rantai berderit halus |
| 3:50–4:00 | Macro | Mesin diturunkan, tangan mengarahkan, 4 engine mount pas | `BRK_snap_l`, `BRK_press` |
| 4:00–4:10 | Macro ×4 cut cepat | 4 baut engine mount dikencangkan | `TLS_ratchet` ×4 |
| 4:10–4:15 | Medium | Air filter dan radiator + selang dipasang, mesin ditepuk dua kali | `BRK_snap_m` ×3, `UI_step_ding` |

### Scene 5: Drivetrain & sistem · 04:15–05:00 · f7650–9000 · Step 20–24

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 4:15–4:30 | Macro sepanjang driveshaft | Gearbox + driveshaft disambung | `BRK_snap_m`, `BRK_slide` |
| 4:30–4:40 | Macro | Puli mesin diputar tangan → driveshaft berputar → hub roda belakang berputar (demonstrasi mekanik) | `BRK_slide` ritmis, klik roda gigi |
| 4:40–4:52 | Medium belakang | Knalpot disambung bagian demi bagian dari header ke belakang | `BRK_snap_m` ×4 |
| 4:52–5:00 | Macro | Tangki + aki dipasang, terminal diklem. Step selesai | `BRK_snap_s`, `UI_step_ding` |

### Scene 6: Roda · 05:00–06:00 · f9000–10800 · Step 25–30

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 5:00–5:12 | Low wide | Roda digulirkan satu per satu melintasi lantai glossy | `CAR_tire_squeak`, `FOL_step` |
| 5:12–5:45 | Medium + macro bergantian | Hub dipasang, 4 mur per roda diputar dengan impact gun (pola bintang). Time-lapse untuk roda ke-3 dan ke-4 | `TLS_impact` ×16 |
| 5:45–5:52 | Medium | Lift turun, roda menyentuh lantai, bodi memantul di suspensi | `MCH_lift_down`, `CAR_bounce` |
| 5:52–6:00 | Wide | Minifig mendorong chassis maju 2 stud. **Rolling chassis selesai** | `CAR_tire_squeak`, `UI_step_ding`, `UI_sparkle` |

### Scene 7: Bodi bawah · 06:00–07:00 · f10800–12600 · Step 31–36

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 6:00–6:15 | Medium | Lantai bodi + firewall abu diturunkan ke chassis | `BRK_snap_l`, `BRK_press` |
| 6:15–6:30 | Macro | Sill pintu dan bulkhead belakang dipasang | `BRK_snap_m` ×3 |
| 6:30–6:48 | Dolly samping sejajar mobil | Panel samping oranye kiri, lalu kanan, diselipkan dan ditekan sepanjang bodi | `BRK_snap_l` ×2, `BRK_slide` |
| 6:48–7:00 | Macro | Plat lantai interior abu dipasang. Step selesai | `BRK_snap_s` ×4, `UI_step_ding` |

### Scene 8: Bodi atas · 07:00–08:00 · f12600–14400 · Step 37–43

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 7:00–7:15 | Medium | 4 fender di-clip satu per satu | `BRK_snap_m` ×4 |
| 7:15–7:30 | Macro | Engsel kap, kap mesin dipasang, dibuka-tutup sekali | `BRK_snap_m`, `BRK_press` |
| 7:30–7:40 | Medium | Tutup bagasi + tiang A/C dipasang | `BRK_snap_m` ×3 |
| 7:40–7:52 | Low → high angle | Minifig naik stool pendek, mengangkat atap dengan dua tangan, menurunkan ke tiang | `FOL_step`, `BRK_snap_l` |
| 7:52–8:00 | Macro | Kaca depan, belakang, samping meluncur masuk. Strip putih ditempel di kap dan atap | `BRK_slide`, `BRK_snap_s`, `UI_step_ding` |

### Scene 9: Interior · 08:00–08:40 · f14400–15600 · Step 44–47

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 8:00–8:12 | Macro lewat jendela | 2 jok dipasang | `BRK_snap_m` ×2 |
| 8:12–8:22 | Macro | Dashboard dengan tile gauge dipasang | `BRK_snap_s` ×3 |
| 8:22–8:30 | Macro | Setir di-clip, center cap, tuas gigi | `BRK_snap_s` ×2 |
| 8:30–8:40 | Medium | Minifig duduk (pinggul 90°) uji fit, lalu turun dan menutup pintu | `FOL_sit`, `CAR_door`, `UI_step_ding` |

### Scene 10: Detail akhir · 08:40–09:10 · f15600–16500 · Step 48–50

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 8:40–8:52 | Macro depan | Lampu depan transparan, grille, bumper dipasang | `BRK_snap_s` ×4 |
| 8:52–9:02 | Macro belakang | Lampu belakang, bumper, plat nomor "BRICK 01" | `BRK_snap_s` ×3 |
| 9:02–9:10 | Medium | Spion, wiper dipasang. Minifig mengelap bodi dengan kain, kilau bergerak di cat | `TLS_cloth_wipe`, `UI_sparkle`, `UI_step_ding` |

### Scene 11: Uji nyala · 09:10–09:40 · f16500–17400

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 9:10–9:18 | Macro dashboard | Kunci diputar | `ENG_crank` |
| 9:18–9:28 | Medium + macro knalpot | Mesin menyala, kamera bergetar halus, asap abu kecil dari knalpot | `ENG_start` → `ENG_idle` loop, `EXH_puff`, ambience turun −6 dB |
| 9:28–9:34 | Macro depan | Lampu depan menyala (emissive + bloom), klakson, wiper menyapu | `CAR_horn`, `CAR_wiper` |
| 9:34–9:40 | Medium | Rev ×2, minifig mengacungkan jempol (angkat lengan) | `ENG_rev` ×2 |

### Scene 12: Finale · 09:40–10:00 · f17400–18000

| Waktu | Kamera | Aksi | SFX |
|---|---|---|---|
| 9:40–9:50 | Wide, kamera diam | Mobil melaju keluar mendekati kamera, melintas, keluar frame | `ENG_drive_away` (Doppler), `CAR_tire_squeak` |
| 9:50–9:56 | Pull-back ke top shot | Garasi rapi, minifig melambai sendirian | `ENG_off`, `AMB_clock_tick` |
| 9:56–10:00 | Fade ke hitam | End card: tanda centang + "Selesai". Credit kecil "Remotion + Three.js" | `UI_end` |

---

## 9. Implementasi Remotion

### 9.1 Timeline

```ts
// src/scenes.ts
export const FPS = 30;
export const SCENES = [
  {id: 'intro',      from: 0,     dur: 750},
  {id: 'prep',       from: 750,   dur: 1200},
  {id: 'chassis',    from: 1950,  dur: 1800},
  {id: 'axle',       from: 3750,  dur: 1800},
  {id: 'engine',     from: 5550,  dur: 2100},
  {id: 'drivetrain', from: 7650,  dur: 1350},
  {id: 'wheels',     from: 9000,  dur: 1800},
  {id: 'lowerbody',  from: 10800, dur: 1800},
  {id: 'upperbody',  from: 12600, dur: 1800},
  {id: 'interior',   from: 14400, dur: 1200},
  {id: 'details',    from: 15600, dur: 900},
  {id: 'test',       from: 16500, dur: 900},
  {id: 'finale',     from: 17400, dur: 600},
] as const; // total 18000
```

```tsx
// src/Root.tsx
<Composition id="LegoCar" component={Main} durationInFrames={18000} fps={30} width={1920} height={1080} />
```

### 9.2 Brick & material (anti-low-poly)

```tsx
// src/lego/Brick.tsx
import {RoundedBox} from '@react-three/drei';
import {useMemo} from 'react';

export const BRICK_H = 1.2, PLATE_H = 0.4, STUD_R = 0.3, STUD_H = 0.2125;

export const ABS: React.FC<{color: string}> = ({color}) => (
  <meshPhysicalMaterial
    color={color} roughness={0.3} metalness={0}
    clearcoat={0.5} clearcoatRoughness={0.25} ior={1.45}
  />
);

export const Brick: React.FC<{
  w: number; d: number; h?: number; color: string; position?: [number, number, number];
}> = ({w, d, h = BRICK_H, color, position = [0, 0, 0]}) => {
  const studs = useMemo(() => {
    const a: [number, number][] = [];
    for (let x = 0; x < w; x++) for (let z = 0; z < d; z++) a.push([x - (w - 1) / 2, z - (d - 1) / 2]);
    return a;
  }, [w, d]);
  return (
    <group position={position}>
      <RoundedBox args={[w, h, d]} radius={0.04} smoothness={6} position={[0, h / 2, 0]} castShadow receiveShadow>
        <ABS color={color} />
      </RoundedBox>
      {studs.map(([x, z], i) => (
        <mesh key={i} position={[x, h + STUD_H / 2, z]} castShadow>
          <cylinderGeometry args={[STUD_R, STUD_R, STUD_H, 48]} />
          <ABS color={color} />
        </mesh>
      ))}
    </group>
  );
};
```

> [!warning] Performa
> Komponen di atas untuk brick tunggal / close-up. Untuk ratusan brick (dinding, lantai, bodi mobil) gunakan `InstancedMesh` atau `mergeGeometries`. Untuk tepi atas stud yang lebih halus, ganti cylinder dengan `LatheGeometry` berprofil bevel.

### 9.3 Scene, post-processing, kamera

```tsx
import {ThreeCanvas} from '@remotion/three';
import {EffectComposer, N8AO, DepthOfField, Bloom, SMAA} from '@react-three/postprocessing';
import {Environment} from '@react-three/drei';
import {Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

export const World: React.FC<{shots: Shot[]; children: React.ReactNode}> = ({shots, children}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows gl={{antialias: true}}
      camera={{fov: 30, near: 0.1, far: 2000, position: [30, 20, 40]}}>
      <Environment files={staticFile('hdri/garage_2k.hdr')} environmentIntensity={0.6} />
      <directionalLight position={[40, 50, 20]} intensity={2.2} castShadow
        shadow-mapSize={[4096, 4096]} shadow-bias={-0.0002} shadow-normalBias={0.02} shadow-radius={4} />
      <CameraRig shots={shots} />
      {children}
      <EffectComposer multisampling={8}>
        <N8AO aoRadius={0.5} intensity={2} />
        <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3} />
        <Bloom intensity={0.25} luminanceThreshold={0.9} />
        <SMAA />
      </EffectComposer>
    </ThreeCanvas>
  );
};

type V3 = [number, number, number];
export type Shot = {f0: number; f1: number;
  from: {pos: V3; target: V3; fov: number}; to: {pos: V3; target: V3; fov: number}};

const CameraRig: React.FC<{shots: Shot[]}> = ({shots}) => {
  const f = useCurrentFrame();
  const {camera} = useThree();
  const s = shots.find((x) => f >= x.f0 && f < x.f1) ?? shots[shots.length - 1];
  const t = interpolate(f, [s.f0, s.f1], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const mix = (a: V3, b: V3): V3 => a.map((v, i) => v + (b[i] - v) * t) as V3;
  camera.position.set(...mix(s.from.pos, s.to.pos));
  camera.lookAt(...mix(s.from.target, s.to.target));
  (camera as THREE.PerspectiveCamera).fov = s.from.fov + (s.to.fov - s.from.fov) * t;
  camera.updateProjectionMatrix();
  return null;
};
```

> [!warning] Aturan Remotion + Three
> - Semua animasi **hanya** dari `useCurrentFrame()`. Jangan pakai `useFrame`, `clock`, atau `Math.random()` tanpa seed.
> - Pastikan HDRI, glTF, dan texture selesai dimuat sebelum frame di-capture (`delayRender()` / `continueRender()` atau Suspense).
> - Uji versi paket `@react-three/postprocessing` (N8AO) dengan render 1 frame sebelum lanjut.

### 9.4 Animasi "snap" & cue SFX

```ts
// src/lego/snapIn.ts
import {Easing, interpolate} from 'remotion';
const o = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// y = finalY + lift + press. lift = jarak dari posisi akhir (stud), press = "klik" turun sedikit
export const snapIn = (f: number, start: number, dur = 12) => {
  const t = interpolate(f, [start, start + dur], [0, 1], {...o, easing: Easing.out(Easing.cubic)});
  const press = interpolate(f, [start + dur, start + dur + 3, start + dur + 8], [0, -0.06, 0], o);
  return {lift: (1 - t) * 1.5, press};
};
```

```ts
// src/audio/cues.ts  (frame global, bukan lokal scene)
export type Cue = {f: number; id: string; v?: number; variants?: number};
export const cues: Cue[] = [
  {f: 0,    id: 'LIGHT_switch_click', v: 0.1},
  {f: 5,    id: 'LIGHT_flicker',      v: 0.1},
  {f: 2300, id: 'BRK_snap_l',         v: 0.2, variants: 3},
  // ... isi dari tabel SFX per scene di bagian 8
];
```

```tsx
// src/audio/SfxTrack.tsx
import {Audio, Sequence, staticFile, interpolate} from 'remotion';
import {cues} from './cues';

const pick = (f: number, n: number) => (Math.imul(f, 2654435761) >>> 0) % n; // seed deterministik

export const SfxTrack: React.FC = () => (
  <>
    <Audio src={staticFile('sfx/AMB_garage_room.wav')} loop
      volume={(f) => interpolate(f, [0, 90], [0, 0.03], {extrapolateRight: 'clamp'})} />
    {cues.map((c, i) => {
      const n = c.variants ?? 1;
      const file = n > 1 ? `${c.id}_${String(pick(c.f, n) + 1).padStart(2, '0')}` : c.id;
      return (
        <Sequence key={i} from={c.f} layout="none">
          <Audio src={staticFile(`sfx/${file}.wav`)} volume={c.v ?? 0.2} />
        </Sequence>
      );
    })}
  </>
);
```

Opsional: export `cues` ke CSV (`frame, id, volume`) untuk mix stereo di DAW.

---

## 10. Master prompt (copy-paste ke AI coding agent)

```text
Buat project Remotion + @remotion/three + React Three Fiber untuk video 10:00 (18000 frame, 30 fps, 1920x1080) berjudul "Merakit Mobil di Dunia LEGO". Video bisu: tanpa narasi, hanya sound effect.

TUJUAN VISUAL
Gaya render LEGO fotorealistik, BUKAN low poly. Satuan: 1 unit = 1 stud = 8 mm. Brick tinggi 1.2, plate 0.4, stud diameter 0.6 tinggi 0.2125. Semua brick pakai RoundedBox radius 0.04 smoothness 6; stud 48 segmen; MeshPhysicalMaterial ABS (roughness .3, clearcoat .5); HDRI indoor; directional light shadow 4096; post-processing N8AO + DoF + bloom tipis + SMAA; ACES tone mapping; multisampling 8.

KARAKTER
Satu minifig mekanik: kepala kuning (wajah decal PNG: dua titik oval hitam + senyum), torso merah dengan sabuk hitam, kaki biru, tangan C-clip berlubang. Geometry dari part LDraw (head 3626, torso 973, arms 3818/3819, hands 3820, hips 3815, legs 3816/3817) via LDrawLoader atau glTF hasil Blender ImportLDraw. Rig per bagian dengan pivot sendiri. Gerak kaku ala LEGO: sendi hanya leher, bahu, pergelangan, pinggul; tidak ada tekukan lutut/siku; wajah tidak berubah.

MOBIL
Orange retro coupe (#FE8A18), strip putih di kap & atap, trim hitam, 8 stud lebar x 22 panjang. 16 modul: chassis, gardan, suspensi, steering, mesin V8, drivetrain, tangki+aki, knalpot, roda x4, lantai bodi, panel samping, fender, kap+bagasi, atap+kaca, interior, lampu+bumper+detail. Tiap modul dirakit dengan animasi snapIn (part datang dari atas, ease-out, overshoot kecil "klik").

BACKGROUND
Diorama garasi cutaway (dua dinding, depan terbuka): dinding bata putih dengan tambalan bata oranye, jendela bingkai hitam, jam dinding, AC unit, toolbox merah 3 laci + pegboard, rak botol, troli tool merah, kursi bar hitam, lift 2-tiang merah, grating abu gelap, strip hazard kuning-hitam, pallet Tan, mesin V8 di pallet, rak tabung gas, creeper merah, tong abu. Tambahan: engine hoist merah, stool pendek. Lantai tile abu glossy dengan refleksi. Debu di berkas cahaya jendela.

SCENE (frame @30fps)
0 Intro 0-750 | 1 Persiapan 750-1950 | 2 Chassis 1950-3750 | 3 Gardan&suspensi 3750-5550 | 4 Mesin 5550-7650 | 5 Drivetrain 7650-9000 | 6 Roda 9000-10800 | 7 Bodi bawah 10800-12600 | 8 Bodi atas 12600-14400 | 9 Interior 14400-15600 | 10 Detail 15600-16500 | 11 Uji nyala 16500-17400 | 12 Finale 17400-18000.
Detail shot, aksi, dan SFX tiap scene ada di dokumen script (bagian 8). Ikuti persis.

KAMERA
CameraRig berbasis keyframe Shot[] {f0,f1,from,to} dengan interpolate + Easing.inOut(cubic). Potong shot tiap 4-8 detik. 3 jenis: wide (FOV 30), medium (28), macro (18-22 + DoF).

OVERLAY
Step counter ala manual LEGO (kotak putih rounded, kiri bawah, angka 1-50), PLI box part list kiri atas, callout panah kuning. Teks minim.

AUDIO
SfxTrack berbasis array cues {f, id, v, variants} dari tabel SFX, varian dipilih dengan seed deterministik. Ambience loop dengan fade-in. Level: ambience .03, foley .10, UI .10, mesin bengkel .16, brick .20, tool .25, engine .32. Tanpa musik.

ATURAN TEKNIS
Animasi hanya dari useCurrentFrame(); dilarang useFrame/clock/Math.random tanpa seed. Muat semua aset dengan delayRender/continueRender. Struktur: src/scenes/*, src/lego/*, src/audio/*, src/overlay/*. Kerjakan bertahap: (1) Brick + material + 1 frame test, (2) garasi, (3) minifig + rig, (4) Scene 2 sebagai vertical slice lengkap dengan SFX, (5) sisanya.
```

---

## 11. Render & QA

### 11.1 Estimasi beban
18.000 frame dengan AO + DoF + supersample berat. **Ukur dulu**: render Scene 2 selama 10 detik dan catat detik/frame. Jika > 5 s/frame, kurangi: shot wide pakai AO ringan, supersample 2× hanya di macro, atau turun ke 24 fps (14.400 frame).

### 11.2 Perintah render
```bash
# per scene, lalu gabung dengan ffmpeg
npx remotion render LegoCar out/scene02.mp4 --frames=1950-3749 \
  --gl=angle --concurrency=2 --scale=2 --codec=h264 --crf=16
```
- Render **per scene** supaya bisa diulang tanpa render semua.
- `--scale=2` = supersample, lalu downscale ke 1080p dengan ffmpeg (`-vf scale=1920:1080:flags=lanczos`).
- `--concurrency` rendah agar VRAM tidak habis.
- Untuk master, render `--codec=prores` jika storage cukup.

### 11.3 Checklist QA
- [ ] Stud dan tepi brick terlihat bevel di macro (tidak kotak tajam)
- [ ] Tidak ada flicker shadow / acne
- [ ] Minifig tidak menembus part mobil
- [ ] Setiap snap punya SFX tepat di frame kontak
- [ ] Ambience tidak terputus saat sambungan scene
- [ ] Step counter berurutan 1–50
- [ ] Loudness −14 LUFS, true peak ≤ −1 dBTP
- [ ] Render ulang satu frame dua kali → hasil identik (deterministik)
