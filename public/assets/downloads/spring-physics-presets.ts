/**
 * Production-Ready Spring Physics Presets
 * Dev Playbook - Interaction Engineering Standards
 */

export const SPRING_PRESETS = {
  /** Responsive micro-interaction: button clicks, badge pops */
  snappy: {
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  /** Smooth page transitions, drawer slides, accordion toggles */
  smooth: {
    stiffness: 240,
    damping: 24,
    mass: 1.0,
  },
  /** Playful alerts, toast notices, celebration confetti */
  bouncy: {
    stiffness: 300,
    damping: 15,
    mass: 1.0,
  },
  /** Heavy modal backdrops, bottom sheet drags */
  deliberate: {
    stiffness: 180,
    damping: 26,
    mass: 1.2,
  },
} as const;

export type SpringPresetName = keyof typeof SPRING_PRESETS;
