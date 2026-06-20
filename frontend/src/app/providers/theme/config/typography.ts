import type { TypographyVariantsOptions } from '@mui/material/styles';
import type { CSSProperties } from 'react';

import type { CustomTypographyVariant } from './typography.d';

type AppTypographyVariantsOptions = TypographyVariantsOptions &
	Partial<Record<CustomTypographyVariant, CSSProperties>>;

export const typography: AppTypographyVariantsOptions = {
	fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
	Logo: {
		fontFamily: '"Molle", cursive',
		fontSize: 56,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
		color: '#000000',
		padding: '8px 16px',
	},
	M40: {
		fontSize: 40,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M32: {
		fontSize: 32,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M24: {
		fontSize: 24,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M20: {
		fontSize: 20,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M16: {
		fontSize: 16,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	M12: {
		fontSize: 12,
		fontWeight: 500,
		lineHeight: 1,
		letterSpacing: 0,
	},
	R48: {
		fontSize: 48,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
	},
	R20: {
		fontSize: 20,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
	},
	R16: {
		fontSize: 16,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
	},
	R12: {
		fontSize: 12,
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: 0,
	},
	L24: {
		fontSize: 24,
		fontWeight: 300,
		lineHeight: 1,
		letterSpacing: 0,
	},
	L20: {
		fontSize: 20,
		fontWeight: 300,
		lineHeight: 1,
		letterSpacing: 0,
	},
	L16: {
		fontSize: 16,
		fontWeight: 300,
		lineHeight: 1,
		letterSpacing: 0,
	},
	L12: {
		fontSize: 12,
		fontWeight: 300,
		lineHeight: 1,
		letterSpacing: 0,
	},
	NoteMarkdownH1: {
		fontSize: 40,
		fontWeight: 500,
		lineHeight: 1.15,
		letterSpacing: 0,
	},
	NoteMarkdownH2: {
		fontSize: 32,
		fontWeight: 500,
		lineHeight: 1.15,
		letterSpacing: 0,
	},
	NoteMarkdownH3: {
		fontSize: 24,
		fontWeight: 500,
		lineHeight: 1.2,
		letterSpacing: 0,
	},
	NoteMarkdownH4: {
		fontSize: 20,
		fontWeight: 500,
		lineHeight: 1.25,
		letterSpacing: 0,
	},
	NoteMarkdownH5: {
		fontSize: 16,
		fontWeight: 500,
		lineHeight: 1.25,
		letterSpacing: 0,
	},
	NoteMarkdownH6: {
		fontSize: 12,
		fontWeight: 500,
		lineHeight: 1.25,
		letterSpacing: 0,
	},
	NoteMarkdownBody: {
		fontSize: 20,
		fontWeight: 400,
		lineHeight: 1.25,
		letterSpacing: 0,
	},
	NoteMarkdownInput: {
		fontSize: 20,
		fontWeight: 400,
		lineHeight: 1.25,
		letterSpacing: 0,
	},
	NoteMarkdownInlineBold: {
		fontFamily: 'inherit',
		fontSize: 'inherit',
		fontWeight: 500,
		lineHeight: 'inherit',
		letterSpacing: 'inherit',
	},
	NoteMarkdownInlineItalic: {
		fontFamily: 'inherit',
		fontSize: 'inherit',
		fontWeight: 'inherit',
		fontStyle: 'italic',
		lineHeight: 'inherit',
		letterSpacing: 'inherit',
	},
	NoteMarkdownInlineCode: {
		fontFamily: '"Roboto Mono", "Courier New", monospace',
		fontSize: '0.92em',
		fontWeight: 400,
		lineHeight: 'inherit',
		letterSpacing: 0,
	},
	NoteMarkdownCodeBlock: {
		fontFamily: '"Roboto Mono", "Courier New", monospace',
		fontSize: 18,
		fontWeight: 400,
		lineHeight: 1.4,
		letterSpacing: 0,
	},
};
