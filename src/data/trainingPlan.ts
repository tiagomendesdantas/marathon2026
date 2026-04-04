import { addDays, format, parseISO } from 'date-fns';
import type { TrainingPlan, TrainingWeek, Workout, Phase, WorkoutType } from '../types';

interface WeekTemplate {
  easyDistance: number;
  longDistance: number;
  tempoDistance: number;
  recoveryDistance: number;
  hasIntervals: boolean;
}

interface PhaseConfig {
  phase: Phase;
  phaseLabel: string;
  weeks: number;
  templates: WeekTemplate[];
}

const PHASE_CONFIGS: PhaseConfig[] = [
  {
    phase: 'base',
    phaseLabel: 'Base Building',
    weeks: 8,
    templates: [
      { easyDistance: 5, longDistance: 8, tempoDistance: 0, recoveryDistance: 3, hasIntervals: false },
      { easyDistance: 5, longDistance: 9, tempoDistance: 0, recoveryDistance: 3, hasIntervals: false },
      { easyDistance: 6, longDistance: 10, tempoDistance: 0, recoveryDistance: 4, hasIntervals: false },
      { easyDistance: 5, longDistance: 8, tempoDistance: 0, recoveryDistance: 3, hasIntervals: false }, // recovery
      { easyDistance: 6, longDistance: 12, tempoDistance: 5, recoveryDistance: 4, hasIntervals: false },
      { easyDistance: 7, longDistance: 13, tempoDistance: 6, recoveryDistance: 4, hasIntervals: false },
      { easyDistance: 7, longDistance: 15, tempoDistance: 6, recoveryDistance: 5, hasIntervals: false },
      { easyDistance: 5, longDistance: 10, tempoDistance: 5, recoveryDistance: 4, hasIntervals: false }, // recovery
    ],
  },
  {
    phase: 'endurance',
    phaseLabel: 'Endurance',
    weeks: 8,
    templates: [
      { easyDistance: 8, longDistance: 17, tempoDistance: 8, recoveryDistance: 5, hasIntervals: false },
      { easyDistance: 8, longDistance: 19, tempoDistance: 8, recoveryDistance: 5, hasIntervals: true },
      { easyDistance: 9, longDistance: 21, tempoDistance: 8, recoveryDistance: 5, hasIntervals: false },
      { easyDistance: 7, longDistance: 15, tempoDistance: 6, recoveryDistance: 4, hasIntervals: false }, // recovery
      { easyDistance: 9, longDistance: 23, tempoDistance: 9, recoveryDistance: 5, hasIntervals: true },
      { easyDistance: 10, longDistance: 25, tempoDistance: 9, recoveryDistance: 6, hasIntervals: false },
      { easyDistance: 10, longDistance: 28, tempoDistance: 10, recoveryDistance: 6, hasIntervals: true },
      { easyDistance: 7, longDistance: 18, tempoDistance: 7, recoveryDistance: 5, hasIntervals: false }, // recovery
    ],
  },
  {
    phase: 'peak',
    phaseLabel: 'Peak Training',
    weeks: 6,
    templates: [
      { easyDistance: 10, longDistance: 29, tempoDistance: 10, recoveryDistance: 6, hasIntervals: true },
      { easyDistance: 10, longDistance: 32, tempoDistance: 10, recoveryDistance: 6, hasIntervals: false },
      { easyDistance: 9, longDistance: 28, tempoDistance: 8, recoveryDistance: 5, hasIntervals: true }, // recovery
      { easyDistance: 10, longDistance: 35, tempoDistance: 10, recoveryDistance: 6, hasIntervals: false },
      { easyDistance: 10, longDistance: 30, tempoDistance: 10, recoveryDistance: 6, hasIntervals: true },
      { easyDistance: 8, longDistance: 25, tempoDistance: 8, recoveryDistance: 5, hasIntervals: false }, // step down
    ],
  },
  {
    phase: 'taper',
    phaseLabel: 'Taper',
    weeks: 4,
    templates: [
      { easyDistance: 7, longDistance: 20, tempoDistance: 6, recoveryDistance: 5, hasIntervals: false },
      { easyDistance: 6, longDistance: 15, tempoDistance: 5, recoveryDistance: 4, hasIntervals: false },
      { easyDistance: 5, longDistance: 10, tempoDistance: 4, recoveryDistance: 3, hasIntervals: false },
      { easyDistance: 3, longDistance: 0, tempoDistance: 3, recoveryDistance: 3, hasIntervals: false }, // race week
    ],
  },
];

function buildWorkout(
  date: Date,
  dayOfWeek: number,
  type: WorkoutType,
  distanceKm: number | null,
  description: string,
  paceGuidance: string
): Workout {
  return {
    dayOfWeek,
    date: format(date, 'yyyy-MM-dd'),
    type,
    distanceKm,
    description,
    paceGuidance,
  };
}

const STRENGTH_BY_PHASE: Record<Phase, { desc: string; pace: string }> = {
  base: {
    desc: 'Strength — Bodyweight foundations: squats 3x12, lunges 3x10/side, glute bridges 3x15, plank 3x30s, calf raises 3x15',
    pace: '30-40 min, focus on form',
  },
  endurance: {
    desc: 'Strength — Build load: goblet squats 3x10, single-leg deadlifts 3x8/side, step-ups 3x10/side, side plank 3x30s/side, hip thrusts 3x12',
    pace: '40-45 min, moderate weight',
  },
  peak: {
    desc: 'Strength — Power & stability: barbell squats 4x6, Romanian deadlifts 3x8, Bulgarian split squats 3x8/side, dead bugs 3x10, box jumps 3x6',
    pace: '40-45 min, heavier weight, fewer reps',
  },
  taper: {
    desc: 'Strength — Maintenance: bodyweight squats 2x10, lunges 2x8/side, plank 2x30s, glute bridges 2x12, light stretching',
    pace: '20-25 min, keep it light',
  },
};

function buildWeekWorkouts(weekStart: Date, template: WeekTemplate, isRaceWeek: boolean, phase: Phase): Workout[] {
  const workouts: Workout[] = [];
  const strength = STRENGTH_BY_PHASE[phase];
  const easyDesc = `Easy Run — ${template.easyDistance}km\n`
    + `1. Warm up: walk 2 min, then start running slowly\n`
    + `2. Run the full distance at a pace where you can hold a conversation\n`
    + `3. If you're breathing too hard to talk, slow down\n`
    + `4. Cool down: walk 2-3 min at the end`;

  const tempoDesc = `Tempo Run — ${template.tempoDistance}km\n`
    + `1. Warm up: 1km easy at 6:45+ /km\n`
    + `2. Tempo portion: ${Math.max(template.tempoDistance - 2, 1)}km at 5:40-5:50 /km — you should only be able to speak in short sentences\n`
    + `3. Cool down: 1km easy at 6:45+ /km\n`
    + `4. This pace should feel "comfortably hard" — not a sprint, but a sustained push`;

  const intervalsDesc = `Intervals — ${template.tempoDistance}km total\n`
    + `1. Warm up: 1.5km easy at 6:45+ /km\n`
    + `2. Run 5-6x 800m at 5:00-5:15 /km (each rep takes ~4 min)\n`
    + `3. Between each rep: jog 400m slowly at 7:30+ /km (about 3 min recovery)\n`
    + `4. Cool down: 1km easy at 6:45+ /km\n`
    + `5. Focus on consistent splits — don't go faster on the first rep`;

  const longRunDesc = `Long Run — ${template.longDistance}km\n`
    + `1. Start slower than you think: first 2-3km at 7:00+ /km\n`
    + `2. Settle into 6:30-7:00 /km for the middle section\n`
    + `3. If you feel strong in the last 3km, you can pick it up slightly\n`
    + `4. Walk breaks are OK — try run 10 min / walk 1 min if needed\n`
    + (template.longDistance >= 20
      ? `5. Bring water and take a gel or snack every 45-60 min\n6. Practice the fueling you'll use on race day`
      : `5. Bring water if it's warm — hydrate before you start`);

  const raceDesc = `RACE DAY — Marathon 42.2km\n`
    + `\n`
    + `Before the race:\n`
    + `• Eat a familiar breakfast 2-3 hours before (toast, banana, coffee)\n`
    + `• Sip water, don't chug. Use the bathroom before the start\n`
    + `• Apply anti-chafe cream (thighs, nipples, armpits)\n`
    + `\n`
    + `Km 1-5 — Start SLOW (6:15-6:30 /km):\n`
    + `• You will feel amazing. Everyone does. Don't speed up.\n`
    + `• Let people pass you. You will pass them later.\n`
    + `• Find your rhythm, relax your shoulders\n`
    + `\n`
    + `Km 6-15 — Find your cruise (6:00-6:15 /km):\n`
    + `• Settle into a comfortable, steady rhythm\n`
    + `• Take water at every station, small sips\n`
    + `• Take your first gel around km 8-10\n`
    + `\n`
    + `Km 16-25 — Stay steady (6:00-6:15 /km):\n`
    + `• This is where the race really starts\n`
    + `• Gel every 45-60 min (around km 17, km 25, km 33)\n`
    + `• Focus on one km at a time, don't think about the finish\n`
    + `\n`
    + `Km 26-35 — The tough part (6:15-6:30 /km):\n`
    + `• "The wall" may hit around km 30-32. This is normal.\n`
    + `• It's OK to slow down slightly. Walk for 1 min if you must.\n`
    + `• Break it into small chunks: "just get to the next water station"\n`
    + `• Keep eating and drinking\n`
    + `\n`
    + `Km 36-42.2 — Bring it home:\n`
    + `• You're almost there. 6km is just a Tuesday morning run.\n`
    + `• Run whatever pace feels right. If you have energy, pick it up.\n`
    + `• Smile for the cameras in the last km\n`
    + `• Cross the finish line. You're a marathoner. 🏅`;

  const days = [
    { day: 0, type: 'easy' as WorkoutType, distance: template.easyDistance, desc: easyDesc, pace: '6:15 - 6:45 /km — conversational pace' },
    {
      day: 1,
      type: (template.hasIntervals ? 'intervals' : template.tempoDistance > 0 ? 'tempo' : 'easy') as WorkoutType,
      distance: template.hasIntervals ? template.tempoDistance : template.tempoDistance > 0 ? template.tempoDistance : template.easyDistance,
      desc: template.hasIntervals ? intervalsDesc : template.tempoDistance > 0 ? tempoDesc : easyDesc,
      pace: template.hasIntervals ? '5:00 - 5:15 /km reps, 7:30+ /km recovery' : template.tempoDistance > 0 ? '5:40 - 5:50 /km tempo, 6:45+ /km warm-up/cool-down' : '6:15 - 6:45 /km — conversational pace',
    },
    { day: 2, type: 'strength' as WorkoutType, distance: null, desc: strength.desc, pace: strength.pace },
    { day: 3, type: 'easy' as WorkoutType, distance: template.easyDistance, desc: easyDesc, pace: '6:15 - 6:45 /km — conversational pace' },
    {
      day: 4,
      type: (isRaceWeek ? 'race' : 'long') as WorkoutType,
      distance: isRaceWeek ? 42.2 : template.longDistance,
      desc: isRaceWeek ? raceDesc : longRunDesc,
      pace: isRaceWeek ? 'Start at 6:15-6:30, cruise at 6:00-6:15, adjust as needed' : '6:30 - 7:00 /km — start slow, stay relaxed',
    },
    { day: 5, type: 'rest' as WorkoutType, distance: null, desc: 'Rest day — enjoy the weekend', pace: '' },
    { day: 6, type: 'rest' as WorkoutType, distance: null, desc: 'Rest day — recover and recharge', pace: '' },
  ];

  for (const d of days) {
    workouts.push(buildWorkout(addDays(weekStart, d.day), d.day, d.type, d.distance, d.desc, d.pace));
  }

  return workouts;
}

export function generatePlan(startDate: string): TrainingPlan {
  const weeks: TrainingWeek[] = [];
  let weekStart = parseISO(startDate + 'T00:00:00');
  let weekNum = 1;

  for (const config of PHASE_CONFIGS) {
    for (let i = 0; i < config.weeks; i++) {
      const template = config.templates[i];
      const isRaceWeek = config.phase === 'taper' && i === config.weeks - 1;
      const workouts = buildWeekWorkouts(weekStart, template, isRaceWeek, config.phase);
      const totalDistanceKm = workouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0);

      weeks.push({
        weekNumber: weekNum,
        phase: config.phase,
        phaseLabel: config.phaseLabel,
        totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
        workouts,
      });

      weekStart = addDays(weekStart, 7);
      weekNum++;
    }
  }

  return { startDate, weeks };
}

export const PLAN_START_DATE = '2026-04-06';
export const trainingPlan = generatePlan(PLAN_START_DATE);
