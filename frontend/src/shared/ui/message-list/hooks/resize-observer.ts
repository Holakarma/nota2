import { useLayoutEffect, useState } from 'react';

export type ResizeObserverProps = React.RefObject<HTMLDivElement | null>;

export const useResizeObserver = (ref: ResizeObserverProps) => {
	const [containerHeight, setContainerHeight] = useState(0);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) {
			return undefined;
		}

		const updateHeight = () => {
			setContainerHeight(element.clientHeight);
		};

		const observer = new ResizeObserver(updateHeight);
		observer.observe(element);

		return () => observer.disconnect();
	}, [ref]);

	return containerHeight;
};
