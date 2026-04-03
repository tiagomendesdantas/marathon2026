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

function buildWeekWorkouts(weekStart: Date, template: WeekTemplate, isRaceWeek: boolean): Workout[] {
  const workouts: Workout[] = [];
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
    { day: 2, type: 'recovery' as WorkoutType, distance: template.recoveryDistance, desc: 'Recovery run — short and gentle', pace: 'RPE 2-3, very easy' },
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
      const workouts = buildWeekWorkouts(weekStart, template, isRaceWeek);
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
