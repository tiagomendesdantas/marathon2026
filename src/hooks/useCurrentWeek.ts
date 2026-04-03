import { useMemo } from 'react';
import { getCurrentWeekNumber } from '../utils/dates';
import { PLAN_START_DATE } from '../data/trainingPlan';

export function useCurrentWeek(): number {
  return useMemo(() => getCurrentWeekNumber(PLAN_START_DATE), []);
}
