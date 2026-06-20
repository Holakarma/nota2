import type { PaletteMode } from '@mui/material';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeModeState = {
	mode: PaletteMode;
	toggleMode: () => void;
};

export const useThemeModeStore = create<ThemeModeState>()(
	persist(
		(set) => ({
			mode: 'light',
			toggleMode: () =>
				set((state) => ({
					mode: state.mode === 'light' ? 'dark' : 'light',
				})),
		}),
		{
			name: 'theme-mode',
			storage: createJSONStorage(() => localStorage),
			partialize: ({ mode }) => ({ mode }),
		},
	),
);
