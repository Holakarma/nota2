import type { CSSProperties } from 'react';

export type CustomTypographyVariant =
    | 'Logo'
    | 'M40'
    | 'M32'
    | 'M24'
    | 'M20'
    | 'M16'
    | 'M12'
    | 'R48'
    | 'R20'
    | 'R16'
    | 'R12'
    | 'L24'
    | 'L20'
    | 'L16'
    | 'L12'
    | 'NoteMarkdownH1'
    | 'NoteMarkdownH2'
    | 'NoteMarkdownH3'
    | 'NoteMarkdownH4'
    | 'NoteMarkdownH5'
    | 'NoteMarkdownH6'
    | 'NoteMarkdownBody'
    | 'NoteMarkdownInput'
    | 'NoteMarkdownInlineBold'
    | 'NoteMarkdownInlineItalic'
    | 'NoteMarkdownInlineCode'
    | 'NoteMarkdownCodeBlock';

declare module '@mui/material/styles' {
    interface TypographyVariants extends Record<CustomTypographyVariant, CSSProperties> {}

    interface TypographyVariantsOptions extends Partial<Record<CustomTypographyVariant, CSSProperties>> {}
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides extends Record<CustomTypographyVariant, true> {}
}
