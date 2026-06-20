import { memo, type ReactNode } from 'react';
import type { ItemProps, MessageListMessage } from './message-list';

export type VirtualRowProps<TMessage extends MessageListMessage> = {
	index: number;
	isLoaderRow: boolean;
	message: TMessage;
	item: (props: ItemProps<TMessage>) => ReactNode;
	loader: () => ReactNode;
	measureElement: (node: HTMLDivElement | null) => void;
};

const VirtualRowComponent = <TMessage extends MessageListMessage>({
	index,
	isLoaderRow,
	message,
	item,
	loader,
	measureElement,
}: VirtualRowProps<TMessage>) => {
	return (
		<div
			data-index={index}
			ref={measureElement}
		>
			{isLoaderRow ? loader() : item({ message })}
		</div>
	);
};

export const VirtualRow = memo(
	VirtualRowComponent,
) as typeof VirtualRowComponent;
