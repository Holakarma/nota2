import { useEffect, useLayoutEffect, useRef } from 'react';

export type UseIntersectionObserverProps = {
	rootRef: React.RefObject<Element | null>;
	observeRef: React.RefObject<Element | null>;
	onIntersect: () => void;
};

export const useIntersectionObserver = ({
	rootRef,
	observeRef,
	onIntersect,
}: UseIntersectionObserverProps) => {
	const onIntersectRef = useRef(onIntersect);

	useLayoutEffect(() => {
		onIntersectRef.current = onIntersect;
	}, [onIntersect]);

	useEffect(() => {
		const root = rootRef.current;
		const target = observeRef.current;

		if (!root || !target || typeof IntersectionObserver === 'undefined') {
			return undefined;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					void onIntersectRef.current();
				}
			},
			{ root },
		);

		observer.observe(target);

		return () => observer.disconnect();
	}, [observeRef, rootRef]);
};
