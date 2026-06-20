import {
	type ReactVirtualizerOptions,
	type Virtualizer,
	useVirtualizer as useTanstackVirtualizer,
} from '@tanstack/react-virtual';

type UseVirtualizerOptions<
	TScrollElement extends Element,
	TItemElement extends Element,
> = Pick<
	ReactVirtualizerOptions<TScrollElement, TItemElement>,
	'count' | 'estimateSize' | 'getItemKey' | 'getScrollElement'
>;

export const useVirtualizer = <
	TScrollElement extends Element = HTMLDivElement,
	TItemElement extends Element = HTMLDivElement,
>({
	count,
	getScrollElement,
	estimateSize,
	getItemKey,
}: UseVirtualizerOptions<
	TScrollElement,
	TItemElement
>): Virtualizer<TScrollElement, TItemElement> => {
	const virtualizer = useTanstackVirtualizer<TScrollElement, TItemElement>({
		count,
		getScrollElement,
		estimateSize,
		getItemKey,
		overscan: 4,
		useAnimationFrameWithResizeObserver: true,
	});

	virtualizer.shouldAdjustScrollPositionOnItemSizeChange = (
		virtualItem,
		_delta,
		instance,
	) => {
		const first = instance.getVirtualItems()[0];
		return first ? virtualItem.index < first.index : false;
	};

	return virtualizer;
};
