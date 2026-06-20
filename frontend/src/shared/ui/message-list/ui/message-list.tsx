import {
	type ComponentPropsWithoutRef,
	type ReactNode,
	memo,
	useRef,
	useCallback,
} from 'react';
import { useResizeObserver } from '../hooks/resize-observer';
import { useVirtualizer } from '../hooks/virtualizer';
import { useIntersectionObserver } from '../hooks/intersecrion-observer';
import { useMessageListAutoScroll } from '../hooks/message-list-auto-scroll';
import { VirtualList } from './virtual-list';

export type MessageListMessage = {
	id: string;
};

export type ItemProps<TMessage extends MessageListMessage> = {
	message: TMessage;
};

export type MessageListProps<TMessage extends MessageListMessage> = Omit<
	ComponentPropsWithoutRef<'div'>,
	'children'
> & {
	messages: TMessage[];
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void | Promise<unknown>;
	itemHeight: number;
	item: (props: ItemProps<TMessage>) => ReactNode;
	loader: () => ReactNode;
};

export type MessageListType<TMessage extends MessageListMessage> =
	MessageListProps<TMessage>;

function MessageListComponent<TMessage extends MessageListMessage>({
	messages,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	itemHeight,
	item,
	loader,
}: MessageListProps<TMessage>) {
	const parentRef = useRef<HTMLDivElement | null>(null);
	const topRef = useRef<HTMLDivElement | null>(null);

	const containerHeight = useResizeObserver(parentRef);

	const itemCount = hasNextPage ? messages.length + 1 : messages.length;

	const getScrollElement = useCallback(() => parentRef.current, []);

	const estimateSize = useCallback(() => itemHeight, [itemHeight]);

	const getItemKey = useCallback(
		(index: number) => {
			if (hasNextPage && index === 0) return 'loader';

			const messageIndex = hasNextPage ? index - 1 : index;
			return messages[messageIndex]?.id ?? `row-${index}`;
		},
		[hasNextPage, messages],
	);

	const virtualizer = useVirtualizer<HTMLDivElement, HTMLDivElement>({
		count: itemCount,
		getScrollElement,
		estimateSize,
		getItemKey,
	});

	const items = virtualizer.getVirtualItems();
	const totalSize = virtualizer.getTotalSize();
	const pad = Math.max(0, containerHeight - totalSize);

	const onIntersect = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			void fetchNextPage();
		}
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	useIntersectionObserver({
		rootRef: parentRef,
		observeRef: topRef,
		onIntersect,
	});

	useMessageListAutoScroll({
		messages,
		hasNextPage,
		parentRef,
		virtualizer,
	});

	return (
		<div
			ref={parentRef}
			style={{
				height: '100%',
				overflow: 'auto',
				contain: 'strict',
			}}
		>
			{pad > 0 && <div style={{ height: pad }} />}

			<div
				style={{
					height: totalSize,
					width: '100%',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						transform: `translateY(${items[0]?.start ?? 0}px)`,
					}}
				>
					<div
						id="top"
						ref={topRef}
					/>

					<VirtualList
						messages={messages}
						items={items}
						item={item}
						loader={loader}
						measureElement={virtualizer.measureElement}
						hasNextPage={hasNextPage}
					/>
				</div>
			</div>
		</div>
	);
}

const MessageList = memo(MessageListComponent) as typeof MessageListComponent;

export default MessageList;
