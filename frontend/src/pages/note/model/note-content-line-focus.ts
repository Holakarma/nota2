import { useCallback, useEffect, useRef, useState } from 'react';

export type NoteContentInputElement =
	| HTMLInputElement
	| HTMLTextAreaElement;

type UseNoteContentLineFocusParams = {
	disabled: boolean;
	lineCount: number;
};

export const useNoteContentLineFocus = ({
	disabled,
	lineCount,
}: UseNoteContentLineFocusParams) => {
	const [focusedLineIndex, setFocusedLineIndex] = useState<number | null>(
		null,
	);
	const activeInputRef = useRef<NoteContentInputElement | null>(null);
	const pendingSelectionRef = useRef<number | null>(null);

	const focusLine = useCallback(
		(lineIndex: number, selectionPosition: number | null = null) => {
			if (disabled) {
				return;
			}

			const clampedLineIndex = Math.min(
				Math.max(lineIndex, 0),
				lineCount - 1,
			);

			pendingSelectionRef.current = selectionPosition;
			setFocusedLineIndex(clampedLineIndex);
		},
		[disabled, lineCount],
	);

	const resetFocusedLine = useCallback(() => {
		setFocusedLineIndex(null);
	}, []);

	useEffect(() => {
		if (focusedLineIndex === null || focusedLineIndex < lineCount) {
			return;
		}

		setFocusedLineIndex(lineCount - 1);
	}, [focusedLineIndex, lineCount]);

	useEffect(() => {
		if (focusedLineIndex === null) {
			return;
		}

		const input = activeInputRef.current;

		if (!input) {
			return;
		}

		const animationFrameId = window.requestAnimationFrame(() => {
			const selectionPosition =
				pendingSelectionRef.current ?? input.value.length;

			input.focus();
			input.setSelectionRange(selectionPosition, selectionPosition);
			pendingSelectionRef.current = null;
		});

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	}, [focusedLineIndex]);

	return {
		activeInputRef,
		focusedLineIndex,
		focusLine,
		resetFocusedLine,
	};
};
