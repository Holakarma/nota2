export type NoteMarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type NoteInlineToken =
	| {
		type: 'text';
		value: string;
	}
	| {
		type: 'strong' | 'emphasis';
		children: NoteInlineToken[];
	}
	| {
		type: 'code';
		value: string;
	};

export type NoteMarkdownLine =
	| {
		type: 'blank';
		rawMarkdown: string;
	}
	| {
		type: 'paragraph';
		rawMarkdown: string;
		content: NoteInlineToken[];
	}
	| {
		type: 'heading';
		rawMarkdown: string;
		level: NoteMarkdownHeadingLevel;
		content: NoteInlineToken[];
	}
	| {
		type: 'unordered-list-item';
		rawMarkdown: string;
		content: NoteInlineToken[];
	}
	| {
		type: 'ordered-list-item';
		rawMarkdown: string;
		marker: string;
		content: NoteInlineToken[];
	};

const ESCAPABLE_MARKDOWN_CHARACTERS = new Set([
	'\\',
	'#',
	'-',
	'.',
	'*',
	'_',
	'`',
]);

const isEscapableMarkdownCharacter = (character: string | undefined) =>
	character !== undefined && ESCAPABLE_MARKDOWN_CHARACTERS.has(character);

const appendTextToken = (tokens: NoteInlineToken[], value: string) => {
	if (!value) {
		return;
	}

	const previousToken = tokens.at(-1);

	if (previousToken?.type === 'text') {
		previousToken.value += value;
		return;
	}

	tokens.push({
		type: 'text',
		value,
	});
};

const unescapeMarkdownText = (markdown: string) => {
	let text = '';
	let index = 0;

	while (index < markdown.length) {
		const character = markdown[index];
		const nextCharacter = markdown[index + 1];

		if (
			character === '\\' &&
			isEscapableMarkdownCharacter(nextCharacter)
		) {
			text += nextCharacter;
			index += 2;
			continue;
		}

		text += character;
		index += 1;
	}

	return text;
};

const findClosingDelimiter = (
	markdown: string,
	delimiter: '*' | '_' | '`',
	startIndex: number,
) => {
	for (let index = startIndex; index < markdown.length; index += 1) {
		if (
			markdown[index] === '\\' &&
			isEscapableMarkdownCharacter(markdown[index + 1])
		) {
			index += 1;
			continue;
		}

		if (markdown[index] === delimiter) {
			return index;
		}
	}

	return -1;
};

const parseInlineMarkdown = (markdown: string): NoteInlineToken[] => {
	const tokens: NoteInlineToken[] = [];
	let textBuffer = '';
	let index = 0;

	const flushText = () => {
		appendTextToken(tokens, textBuffer);
		textBuffer = '';
	};

	while (index < markdown.length) {
		const character = markdown[index];
		const nextCharacter = markdown[index + 1];

		if (
			character === '\\' &&
			isEscapableMarkdownCharacter(nextCharacter)
		) {
			textBuffer += nextCharacter;
			index += 2;
			continue;
		}

		if (character === '*' || character === '_' || character === '`') {
			const closingIndex = findClosingDelimiter(
				markdown,
				character,
				index + 1,
			);

			if (closingIndex > index + 1) {
				const content = markdown.slice(index + 1, closingIndex);

				flushText();

				if (character === '`') {
					tokens.push({
						type: 'code',
						value: unescapeMarkdownText(content),
					});
				} else {
					tokens.push({
						type: character === '*' ? 'strong' : 'emphasis',
						children: parseInlineMarkdown(content),
					});
				}

				index = closingIndex + 1;
				continue;
			}
		}

		textBuffer += character;
		index += 1;
	}

	flushText();

	return tokens;
};

const parsePreviewLine = (rawMarkdown: string): NoteMarkdownLine => {
	if (!rawMarkdown.trim()) {
		return {
			type: 'blank',
			rawMarkdown,
		};
	}

	const headingMatch = /^(#{1,6})[ \t]+(.*)$/.exec(rawMarkdown);

	if (headingMatch) {
		return {
			type: 'heading',
			rawMarkdown,
			level: headingMatch[1].length as NoteMarkdownHeadingLevel,
			content: parseInlineMarkdown(headingMatch[2]),
		};
	}

	const unorderedListItemMatch = /^-[ \t]+(.*)$/.exec(rawMarkdown);

	if (unorderedListItemMatch) {
		return {
			type: 'unordered-list-item',
			rawMarkdown,
			content: parseInlineMarkdown(unorderedListItemMatch[1]),
		};
	}

	const orderedListItemMatch = /^(\d+)\.[ \t]+(.*)$/.exec(rawMarkdown);

	if (orderedListItemMatch) {
		return {
			type: 'ordered-list-item',
			rawMarkdown,
			marker: `${orderedListItemMatch[1]}.`,
			content: parseInlineMarkdown(orderedListItemMatch[2]),
		};
	}

	return {
		type: 'paragraph',
		rawMarkdown,
		content: parseInlineMarkdown(rawMarkdown),
	};
};

export const parseNoteMarkdownLines = (
	markdownLines: readonly string[],
): NoteMarkdownLine[] =>
	markdownLines.map((rawMarkdown) => parsePreviewLine(rawMarkdown));
