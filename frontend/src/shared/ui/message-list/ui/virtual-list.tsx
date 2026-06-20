import type { VirtualItem } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';
import type { ItemProps, MessageListMessage } from './message-list';
import { VirtualRow } from './virtual-row';

export type VirtualListProps<TMessage extends MessageListMessage> = {
	messages: TMessage[];
	items: VirtualItem[];
	hasNextPage: boolean;
	item: (props: ItemProps<TMessage>) => ReactNode;
	loader: () => ReactNode;
	measureElement: (node: HTMLDivElement | null) => void;
};

export const VirtualList = <TMessage extends MessageListMessage>({
	messages,
	items,
	hasNextPage,
	item,
	loader,
	measureElement,
}: VirtualListProps<TMessage>) => {
	return items.map((virtualItem) => {
		const isLoaderRow = hasNextPage && virtualItem.index === 0;
		const messageIndex = hasNextPage
			? virtualItem.index - 1
			: virtualItem.index;

		return (
			<VirtualRow
				key={virtualItem.key}
				index={virtualItem.index}
				isLoaderRow={isLoaderRow}
				message={messages[messageIndex]}
				item={item}
				loader={loader}
				measureElement={measureElement}
			/>
		);
	});
};
