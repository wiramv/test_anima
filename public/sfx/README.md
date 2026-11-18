# SFX asset manifest

The video is designed to be silent except for sound effects. No third-party audio
is checked into this repository. Add licensed WAV files here using the cue IDs in
`src/audio/cues.ts` and `docs/lego-car-video-script.md`, then set
`defaultProps.soundEnabled` to `true` in `src/Root.tsx`.

Required ambience loops:

- `AMB_garage_room.wav`
- `AMB_tube_hum.wav`
- `AMB_clock_tick.wav`
- `ENG_idle.wav`

All one-shot files use the IDs from `CUES`. For a variant cue such as
`BRK_snap_l`, add names like `BRK_snap_l_01.wav`, `BRK_snap_l_02.wav`, etc.
