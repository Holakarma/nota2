import type { ReactNode } from 'react';

import { useMemo } from 'react';
import { useThemeModeStore } from '@shared/model/theme-mode';
import { createAppTheme } from './theme';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type AppThemeProviderProps = {
	children: ReactNode;
};

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
	const mode = useThemeModeStore((state) => state.mode);
	const theme = useMemo(() => createAppTheme(mode), [mode]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};
