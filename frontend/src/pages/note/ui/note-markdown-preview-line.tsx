import { Box, Typography, type TypographyProps } from '@mui/material';
import type { ReactNode } from 'react';
import type {
	NoteInlineToken,
	NoteMarkdownHeadingLevel,
	NoteMarkdownLine,
} from '../model/note-markdown-parser';

type NoteMarkdownPreviewLineProps = {
	line: NoteMarkdownLine;
};

const headingVariantByLevel: Record<
	NoteMarkdownHeadingLevel,
	TypographyProps['variant']
> = {
	1: 'NoteMarkdownH1',
	2: 'NoteMarkdownH2',
	3: 'NoteMarkdownH3',
	4: 'NoteMarkdownH4',
	5: 'NoteMarkdownH5',
	6: 'NoteMarkdownH6',
};

const renderInlineTokens = (
	tokens: readonly NoteInlineToken[],
	keyPrefix = 'token',
): ReactNode[] =>
	tokens.map((token, tokenIndex) => {
		const key = `${keyPrefix}-${tokenIndex}`;

		if (token.type === 'text') {
			return token.value;
		}

		if (token.type === 'code') {
			return (
				<Box
					key={key}
					component="code"
					sx={{
						typography: 'NoteMarkdownInlineCode',
						bgcolor: 'action.hover',
						borderRadius: 0.5,
						px: 0.5,
					}}
				>
					{token.value}
				</Box>
			);
		}

		return (
			<Box
				key={key}
				component={token.type === 'strong' ? 'strong' : 'em'}
				sx={{
					typography:
						token.type === 'strong'
							? 'NoteMarkdownInlineBold'
							: 'NoteMarkdownInlineItalic',
				}}
			>
				{renderInlineTokens(token.children, key)}
			</Box>
		);
	});

export const NoteMarkdownPreviewLine = ({
	line,
}: NoteMarkdownPreviewLineProps) => {
	if (line.type === 'blank') {
		return (
			<Box
				sx={{
					typography: 'NoteMarkdownBody',
					minHeight: '1.25em',
				}}
			/>
		);
	}

	if (line.type === 'heading') {
		return (
			<Typography
				component={`h${line.level}`}
				variant={headingVariantByLevel[line.level]}
				sx={{
					m: 0,
					whiteSpace: 'pre-wrap',
					overflowWrap: 'anywhere',
				}}
			>
				{renderInlineTokens(line.content)}
			</Typography>
		);
	}

	if (line.type === 'unordered-list-item') {
		return (
			<Box
				component="ul"
				sx={{
					m: 0,
					pl: 3,
					typography: 'NoteMarkdownBody',
					whiteSpace: 'pre-wrap',
					overflowWrap: 'anywhere',
				}}
			>
				<Box
					component="li"
					sx={{
						pl: 0.5,
					}}
				>
					{renderInlineTokens(line.content)}
				</Box>
			</Box>
		);
	}

	if (line.type === 'ordered-list-item') {
		return (
			<Box
				component="ol"
				start={Number.parseInt(line.marker, 10)}
				sx={{
					m: 0,
					pl: 3,
					typography: 'NoteMarkdownBody',
					whiteSpace: 'pre-wrap',
					overflowWrap: 'anywhere',
				}}
			>
				<Box
					component="li"
					sx={{
						pl: 0.5,
					}}
				>
					{renderInlineTokens(line.content)}
				</Box>
			</Box>
		);
	}


	return (
		<Typography
			component="div"
			variant="NoteMarkdownBody"
			sx={{
				whiteSpace: 'pre-wrap',
				overflowWrap: 'anywhere',
			}}
		>
			{renderInlineTokens(line.content)}
		</Typography>
	);
};
