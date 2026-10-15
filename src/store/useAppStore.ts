import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Goal, GoalPlan, Profile } from '@/engine';

export type PhotoPose = 'front' | 'side' | 'back';

export interface PhotoEntry {
  uri: string;
  pose: PhotoPose;
  date: string;
}

export interface CheckIn {
  date: string;
  weightKg: number;
}

interface AppState {
  /** Dados do onboarding em preenchimento. */
  draft: Partial<Profile>;
  draftPhotos: Partial<Record<PhotoPose, string>>;
  profile?: Profile;
  goal?: Goal;
  plan?: GoalPlan;
  startDate?: string;
  photos: PhotoEntry[];
  checkIns: CheckIn[];
  /** Datas (AAAA-MM-DD) com treino concluído. */
  completedWorkouts: string[];
  hydrated: boolean;

  updateDraft: (patch: Partial<Profile>) => void;
  setDraftPhoto: (pose: PhotoPose, uri: string | undefined) => void;
  setGoal: (goal: Goal) => void;
  startPlan: (plan: GoalPlan) => void;
  addCheckIn: (weightKg: number) => void;
  addPhotos: (photos: Partial<Record<PhotoPose, string>>) => void;
  toggleWorkout: (date: string) => void;
  restartAssessment: () => void;
  reset: () => void;
}

/** Data local no formato AAAA-MM-DD. */
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const initial = {
  draft: { restrictions: [] },
  draftPhotos: {},
  profile: undefined,
  goal: undefined,
  plan: undefined,
  startDate: undefined,
  photos: [],
  checkIns: [],
  completedWorkouts: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initial,
      hydrated: false,

      updateDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
      setDraftPhoto: (pose, uri) => set({ draftPhotos: { ...get().draftPhotos, [pose]: uri } }),
      setGoal: (goal) => set({ goal }),

      startPlan: (plan) => {
        const { draft, draftPhotos, photos, checkIns } = get();
        const profile = draft as Profile;
        const date = today();
        const newPhotos = Object.entries(draftPhotos)
          .filter(([, uri]) => !!uri)
          .map(([pose, uri]) => ({ pose: pose as PhotoPose, uri: uri!, date }));
        set({
          profile,
          plan,
          startDate: date,
          photos: [...photos, ...newPhotos],
          checkIns: [...checkIns.filter((c) => c.date !== date), { date, weightKg: profile.weightKg }],
          draftPhotos: {},
        });
      },

      addCheckIn: (weightKg) => {
        const { profile, checkIns } = get();
        const date = today();
        set({
          // O plano é recalculado a partir do peso atualizado.
          profile: profile ? { ...profile, weightKg } : profile,
          draft: { ...get().draft, weightKg },
          checkIns: [...checkIns.filter((c) => c.date !== date), { date, weightKg }].sort((a, b) =>
            a.date.localeCompare(b.date),
          ),
        });
      },

      addPhotos: (byPose) => {
        const date = today();
        const entries = Object.entries(byPose)
          .filter(([, uri]) => !!uri)
          .map(([pose, uri]) => ({ pose: pose as PhotoPose, uri: uri!, date }));
        set({ photos: [...get().photos, ...entries] });
      },

      toggleWorkout: (date) => {
        const list = get().completedWorkouts;
        set({ completedWorkouts: list.includes(date) ? list.filter((d) => d !== date) : [...list, date] });
      },

      restartAssessment: () => set({ draft: { ...get().profile, restrictions: get().profile?.restrictions ?? [] }, plan: undefined }),

      reset: () => set({ ...initial }),
    }),
    {
      name: 'bodybalance-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => () => useAppStore.setState({ hydrated: true }),
    },
  ),
);

/** Dias corridos entre duas datas AAAA-MM-DD. */
export const daysBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
