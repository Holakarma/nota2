import { forwardRef, useEffect, useRef } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import {
	useCreateChatMessageMutation,
	useEnsureChatMutation,
} from '@entities/chat';
import { SendIcon } from '@shared/icons/send';
import { useMessageDraftStore } from '../model/stream-message-draft';

type StreamMessageInputProps = {
	disabled?: boolean;
	autoFocus?: boolean;
	chatId?: string;
	streamId?: string;
	onFocus?: () => void;
	onMessageSent?: (payload: {
		chatId: string;
		streamId?: string;
	}) => void | Promise<void>;
};

export const MessageInput = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	StreamMessageInputProps
>(
	(
		{
			disabled = false,
			autoFocus = false,
			onFocus,
			chatId,
			streamId,
			onMessageSent,
		},
		ref,
	) => {
		const bodyMarkdown = useMessageDraftStore(
			(state) => state.bodyMarkdown,
		);
		const setBodyMarkdown = useMessageDraftStore(
			(state) => state.setBodyMarkdown,
		);
		const clearBodyMarkdown = useMessageDraftStore(
			(state) => state.clearBodyMarkdown,
		);
		const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
			null,
		);
		const ensureChatMutation = useEnsureChatMutation();
		const createChatMessageMutation = useCreateChatMessageMutation();

		const isPending =
			ensureChatMutation.isPending || createChatMessageMutation.isPending;
		const isDisabled = disabled || isPending;

		useEffect(() => {
			if (autoFocus && !isDisabled) {
				inputRef.current?.focus();
			}
		}, [autoFocus, isDisabled]);

		const setInputRef = (
			element: HTMLInputElement | HTMLTextAreaElement | null,
		) => {
			inputRef.current = element;

			if (typeof ref === 'function') {
				ref(element);
			} else if (ref) {
				ref.current = element;
			}
		};

		const getChatId = async () => {
			if (chatId) {
				return chatId;
			}

			const chat = await ensureChatMutation.mutateAsync({ streamId });

			return chat.id;
		};

		const submitMessage = async () => {
			const message = bodyMarkdown.trim();

			if (!message || isDisabled) {
				return;
			}

			const targetChatId = await getChatId();

			await createChatMessageMutation.mutateAsync({
				chatId: targetChatId,
				data: {
					bodyMarkdown: message,
				},
			});

			clearBodyMarkdown();
			await onMessageSent?.({ chatId: targetChatId, streamId });
		};

		const sendMessage = async (
			event: React.SubmitEvent<HTMLFormElement>,
		) => {
			event.preventDefault();
			await submitMessage();
		};

		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (event.key !== 'Enter' || event.shiftKey) {
				return;
			}

			event.preventDefault();
			void submitMessage();
		};

		const isSubmitDisabled = isDisabled || !bodyMarkdown.trim();

		return (
			<Box
				component="form"
				onSubmit={(event) => sendMessage(event)}
			>
				<TextField
					placeholder="Сообщение"
					aria-label="Сообщение"
					onChange={(event) => setBodyMarkdown(event.target.value)}
					onFocus={onFocus}
					onKeyDown={handleKeyDown}
					inputRef={setInputRef}
					value={bodyMarkdown}
					disabled={isDisabled}
					multiline
					minRows={1}
					maxRows={6}
					fullWidth
					slotProps={{
						htmlInput: {
							maxLength: 32768,
						},
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										type="submit"
										aria-label="Отправить"
										disabled={isSubmitDisabled}
									>
										<SendIcon />
									</IconButton>
								</InputAdornment>
							),
						},
					}}
				/>
			</Box>
		);
	},
);

MessageInput.displayName = 'MessageInput';
