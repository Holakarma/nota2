import type { Virtualizer } from '@tanstack/react-virtual';
import { type RefObject, useLayoutEffect, useRef } from 'react';

type MessageListAutoScrollMessage = {
	id: string;
};

type UseMessageListAutoScrollOptions<
	TMessage extends MessageListAutoScrollMessage,
> = {
	messages: TMessage[];
	hasNextPage: boolean;
	parentRef: RefObject<HTMLDivElement | null>;
	virtualizer: Virtualizer<HTMLDivElement, HTMLDivElement>;
};

const getLastVirtualItemIndex = (
	messageCount: number,
	hasNextPage: boolean,
) => {
	const itemCount = messageCount + Number(hasNextPage);

	return itemCount > 0 ? itemCount - 1 : null;
};

export const useMessageListAutoScroll = <
	TMessage extends MessageListAutoScrollMessage,
>({
	messages,
	hasNextPage,
	parentRef,
	virtualizer,
}: UseMessageListAutoScrollOptions<TMessage>) => {
	const previousMessageCountRef = useRef<number | null>(null);
	const previousFirstMessageIdRef = useRef<string | null>(null);
	const previousTotalSizeRef = useRef(0);
	const initialScrollFrameRef = useRef<number | null>(null);
	const didInitialScrollRef = useRef(false);

	const messageCount = messages.length;
	const firstMessageId = messages[0]?.id ?? null;

	useLayoutEffect(() => {
		if (initialScrollFrameRef.current !== null) {
			cancelAnimationFrame(initialScrollFrameRef.current);
			initialScrollFrameRef.current = null;
		}

		const previousMessageCount = previousMessageCountRef.current;
		const previousFirstMessageId = previousFirstMessageIdRef.current;
		const previousTotalSize = previousTotalSizeRef.current;
		const totalSize = virtualizer.getTotalSize();
		const lastVirtualItemIndex = getLastVirtualItemIndex(
			messageCount,
			hasNextPage,
		);

		if (!didInitialScrollRef.current) {
			if (lastVirtualItemIndex !== null) {
				initialScrollFrameRef.current = requestAnimationFrame(() => {
					virtualizer.scrollToIndex(lastVirtualItemIndex, {
						align: 'end',
					});
					initialScrollFrameRef.current = null;
					didInitialScrollRef.current = true;
				});
			}
		} else if (
			previousMessageCount !== null &&
			previousMessageCount < messageCount
		) {
			const isPrepend =
				previousFirstMessageId !== null &&
				firstMessageId !== null &&
				previousFirstMessageId !== firstMessageId;

			if (isPrepend) {
				const scrollElement = parentRef.current;

				if (scrollElement) {
					virtualizer.scrollToOffset(
						scrollElement.scrollTop +
						totalSize -
						previousTotalSize,
					);
				}
			} else if (lastVirtualItemIndex !== null) {
				virtualizer.scrollToIndex(lastVirtualItemIndex, {
					align: 'end',
					behavior: 'auto',
				});
			}
		}

		previousMessageCountRef.current = messageCount;
		previousFirstMessageIdRef.current = firstMessageId;
		previousTotalSizeRef.current = totalSize;

		return () => {
			if (initialScrollFrameRef.current !== null) {
				cancelAnimationFrame(initialScrollFrameRef.current);
				initialScrollFrameRef.current = null;
			}
		};
	}, [firstMessageId, hasNextPage, messageCount, parentRef, virtualizer]);
};
