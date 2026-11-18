export type Cue = {
  f: number;
  id: string;
  v?: number;
  variants?: number;
};

/**
 * Global, deterministic SFX cue sheet. Add matching .wav files in public/sfx
 * and set soundEnabled=true in the composition props to activate it.
 */
export const CUES: readonly Cue[] = [
  {f: 0, id: 'LIGHT_switch_click', v: 0.1},
  {f: 5, id: 'LIGHT_flicker', v: 0.1},
  {f: 450, id: 'UI_title', v: 0.1},
  {f: 760, id: 'FOL_step', v: 0.1, variants: 4},
  {f: 960, id: 'TLS_drawer_open', v: 0.25},
  {f: 1050, id: 'TLS_clink', v: 0.25},
  {f: 1130, id: 'TLS_drawer_close', v: 0.25},
  {f: 1500, id: 'MCH_lift_down', v: 0.16},
  {f: 1950, id: 'MCH_lift_up', v: 0.16},
  {f: 2070, id: 'BRK_snap_l', v: 0.2, variants: 3},
  {f: 2320, id: 'BRK_press', v: 0.2},
  {f: 2660, id: 'BRK_pin', v: 0.2, variants: 4},
  {f: 3600, id: 'UI_step_ding', v: 0.1},
  {f: 3840, id: 'MCH_creeper_roll', v: 0.16},
  {f: 4120, id: 'TLS_ratchet', v: 0.25, variants: 3},
  {f: 4420, id: 'MCH_spring_boing', v: 0.16},
  {f: 5350, id: 'UI_step_ding', v: 0.1},
  {f: 5580, id: 'MCH_hoist_roll', v: 0.16},
  {f: 5830, id: 'MCH_chain_clink', v: 0.16},
  {f: 5960, id: 'MCH_hoist_pump', v: 0.16, variants: 3},
  {f: 6300, id: 'BRK_snap_l', v: 0.2, variants: 3},
  {f: 6500, id: 'TLS_ratchet', v: 0.25, variants: 3},
  {f: 7480, id: 'UI_step_ding', v: 0.1},
  {f: 7700, id: 'BRK_slide', v: 0.2},
  {f: 8370, id: 'BRK_snap_m', v: 0.2, variants: 4},
  {f: 8950, id: 'UI_step_ding', v: 0.1},
  {f: 9020, id: 'CAR_tire_squeak', v: 0.18},
  {f: 9300, id: 'TLS_impact', v: 0.25, variants: 3},
  {f: 9540, id: 'TLS_impact', v: 0.25, variants: 3},
  {f: 9780, id: 'TLS_impact', v: 0.25, variants: 3},
  {f: 10020, id: 'TLS_impact', v: 0.25, variants: 3},
  {f: 10400, id: 'MCH_lift_down', v: 0.16},
  {f: 10720, id: 'UI_step_ding', v: 0.1},
  {f: 10860, id: 'BRK_press', v: 0.2},
  {f: 11420, id: 'BRK_slide', v: 0.2},
  {f: 12520, id: 'UI_step_ding', v: 0.1},
  {f: 12680, id: 'BRK_snap_m', v: 0.2, variants: 4},
  {f: 13180, id: 'BRK_press', v: 0.2},
  {f: 13850, id: 'BRK_snap_l', v: 0.2, variants: 3},
  {f: 14370, id: 'UI_step_ding', v: 0.1},
  {f: 14500, id: 'BRK_snap_m', v: 0.2, variants: 4},
  {f: 15050, id: 'FOL_sit', v: 0.1},
  {f: 15400, id: 'CAR_door', v: 0.18},
  {f: 15660, id: 'BRK_snap_s', v: 0.2, variants: 6},
  {f: 16080, id: 'TLS_cloth_wipe', v: 0.25},
  {f: 16420, id: 'UI_step_ding', v: 0.1},
  {f: 16520, id: 'ENG_crank', v: 0.32},
  {f: 16590, id: 'ENG_start', v: 0.32},
  {f: 16820, id: 'EXH_puff', v: 0.2},
  {f: 17010, id: 'CAR_horn', v: 0.2},
  {f: 17030, id: 'CAR_wiper', v: 0.18},
  {f: 17200, id: 'ENG_rev', v: 0.32, variants: 2},
  {f: 17320, id: 'ENG_rev', v: 0.32, variants: 2},
  {f: 17410, id: 'ENG_drive_away', v: 0.32},
  {f: 17680, id: 'ENG_off', v: 0.32},
  {f: 17880, id: 'UI_end', v: 0.1},
] as const;
