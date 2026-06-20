import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type StreamMessageDraftState = {
	bodyMarkdown: string;
	setBodyMarkdown: (bodyMarkdown: string) => void;
	clearBodyMarkdown: () => void;
};

export const useMessageDraftStore = create<StreamMessageDraftState>()(
	persist(
		(set) => ({
			bodyMarkdown: '',
			setBodyMarkdown: (bodyMarkdown) => set({ bodyMarkdown }),
			clearBodyMarkdown: () => set({ bodyMarkdown: '' }),
		}),
		{
			name: 'stream-message-draft',
			storage: createJSONStorage(() => localStorage),
			partialize: ({ bodyMarkdown }) => ({ bodyMarkdown }),
		},
	),
);
