import { useMemo } from 'react';

import { buildFullPlan } from '@/engine';

import { daysBetween, today, useAppStore } from './useAppStore';

/** Plano completo derivado do perfil atual (recalculado a cada check-in de peso). */
export function usePlan() {
  const profile = useAppStore((s) => s.profile);
  const plan = useAppStore((s) => s.plan);
  const startDate = useAppStore((s) => s.startDate);

  return useMemo(() => {
    if (!profile || !plan) return undefined;
    const elapsedDays = startDate ? daysBetween(startDate, today()) : 0;
    return {
      profile,
      goal: plan,
      week: Math.min(Math.floor(elapsedDays / 7) + 1, plan.weeks),
      ...buildFullPlan(profile, plan),
    };
  }, [profile, plan, startDate]);
}
