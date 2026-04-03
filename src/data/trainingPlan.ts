import { addDays, format } from 'date-fns';
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
  const days = [
    { day: 0, type: 'easy' as WorkoutType, distance: template.easyDistance, desc: 'Easy run — keep it conversational', pace: 'RPE 3-4, easy effort' },
    {
      day: 1,
      type: (template.hasIntervals ? 'intervals' : template.tempoDistance > 0 ? 'tempo' : 'easy') as WorkoutType,
      distance: template.hasIntervals ? template.tempoDistance : template.tempoDistance > 0 ? template.tempoDistance : template.easyDistance,
      desc: template.hasIntervals
        ? 'Intervals — 5-6x 800m hard with 400m jog recovery'
        : template.tempoDistance > 0
          ? 'Tempo run — sustained comfortably hard effort'
          : 'Easy run — keep it conversational',
      pace: template.hasIntervals ? 'RPE 8, hard effort with recovery' : template.tempoDistance > 0 ? 'RPE 6-7, comfortably hard' : 'RPE 3-4, easy effort',
    },
    { day: 2, type: 'strength' as WorkoutType, distance: null, desc: strength.desc, pace: strength.pace },
    { day: 3, type: 'easy' as WorkoutType, distance: template.easyDistance, desc: 'Easy run — active recovery', pace: 'RPE 3-4, easy effort' },
    {
      day: 4,
      type: (isRaceWeek ? 'race' : 'long') as WorkoutType,
      distance: isRaceWeek ? 42.2 : template.longDistance,
      desc: isRaceWeek ? 'RACE DAY — Marathon! You are ready!' : `Long run — ${template.longDistance}km at easy pace`,
      pace: isRaceWeek ? 'Run your race, trust your training!' : 'RPE 3-5, slightly slower than easy',
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
  let weekStart = new Date(startDate);
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
