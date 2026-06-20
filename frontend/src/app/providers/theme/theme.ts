import { createTheme, type PaletteMode } from '@mui/material';

import { typography } from './config/typography';

const designColors = {
	black: '#000000',
	white: '#ffffff',
	darkScrollbarTrack: '#121212',
	darkScrollbarThumb: '#545454',
	darkScrollbarThumbHover: '#747474',
	lightScrollbarTrack: '#ffffff',
	lightScrollbarThumb: '#b8b8b8',
	lightScrollbarThumbHover: '#8f8f8f',
	textSecondary: '#454545',
	disabled: '#4c4c4c',
	pressedText: '#7c7c7c',
	placeholder: '#8b8b8b',
	containedHoverText: '#c3c3c3',
	pressedBackground: '#d4d4d4',
	selectedBackground: '#eaeaea',
	hoverBackground: '#ededed',
	subtleHoverBackground: '#f7f7f7',
};

const scrollbarColors =
	(mode: PaletteMode) => ({
		track:
			mode === 'light'
				? designColors.lightScrollbarTrack
				: designColors.darkScrollbarTrack,
		thumb:
			mode === 'light'
				? designColors.lightScrollbarThumb
				: designColors.darkScrollbarThumb,
		thumbHover:
			mode === 'light'
				? designColors.lightScrollbarThumbHover
				: designColors.darkScrollbarThumbHover,
	});

export const createAppTheme = (mode: PaletteMode) => createTheme({
	palette: {
		mode,
		primary: {
			main: mode === 'light' ? designColors.black : designColors.white,
			contrastText: mode === 'light' ? designColors.white : designColors.black,
		},
	},

	typography,
	components: {
		MuiCssBaseline: {
			styleOverrides: (() => {
				const scrollbars = scrollbarColors(mode);

				return `
				@font-face {
					font-family: 'Rubik';
					font-style: normal;
					font-display: swap;
					font-weight: 300 900;
					src: url('/fonts/Rubik/Rubik-VariableFont_wght.ttf') format('truetype');
				}

				@font-face {
					font-family: 'Rubik';
					font-style: italic;
					font-display: swap;
					font-weight: 300 900;
					src: url('/fonts/Rubik/Rubik-Italic-VariableFont_wght.ttf') format('truetype');
				}

				@font-face {
					font-family: 'Molle';
					font-style: normal;
					font-display: swap;
					font-weight: 400;
					src: url('/fonts/Molle/Molle_400Regular_Italic.ttf') format('truetype');
				}

				html {
					color-scheme: ${mode};
				}

				* {
					scrollbar-width: thin;
					scrollbar-color: ${scrollbars.thumb} ${scrollbars.track};
				}

				*::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}

				*::-webkit-scrollbar-track {
					background: ${scrollbars.track};
				}

				*::-webkit-scrollbar-thumb {
					background-color: ${scrollbars.thumb};
					border: 2px solid ${scrollbars.track};
					border-radius: 999px;
				}

				*::-webkit-scrollbar-thumb:hover {
					background-color: ${scrollbars.thumbHover};
				}

				*::-webkit-scrollbar-corner {
					background: ${scrollbars.track};
				}
				`;
			})(),
		},
		MuiListItemButton: {
			defaultProps: {
				disableRipple: true,
				disableTouchRipple: true
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true
			},

		},
		MuiIconButton: {
			defaultProps: {
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true
			},

		},

	},
});
