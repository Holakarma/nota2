import { chatQueries } from '@entities/chat';
import { Alert, CircularProgress, Stack, Typography } from '@mui/material';
import type { ChatMessageResponseDto } from '@shared/api';
import { MessageList, type ItemProps } from '@shared/ui/message-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { MessageItem } from './message.item';

type MessagesProps = {
	chatId: string;
	streamId?: string;
};

export const Messages = ({ chatId, streamId }: MessagesProps) => {
	const query = useInfiniteQuery(chatQueries.messagesInfinite({ chatId }));

	const messages = useMemo<ChatMessageResponseDto[] | undefined>(() => {
		if (!query.data) {
			return undefined;
		}
		return query.data.pages.flatMap((page) => page.result).reverse();
	}, [query.data]);

	const renderMessage = useCallback(
		({ message }: ItemProps<ChatMessageResponseDto>) => (
			<MessageItem
				message={message}
				streamId={streamId}
			/>
		),
		[streamId],
	);

	const renderLoader = useCallback(
		() => (
			<Stack
				sx={{
					alignItems: 'center',
					justifyContent: 'center',
					paddingBlock: 2,
				}}
			>
				<CircularProgress color="secondary" />
			</Stack>
		),
		[],
	);

	if (query.isPending) {
		return (
			<Stack
				sx={{
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress
					size={70}
					color="secondary"
				/>
			</Stack>
		);
	}

	if (query.isError || !messages) {
		return (
			<Stack
				sx={{
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Alert severity="error">Ошибка загрузки сообщений</Alert>
			</Stack>
		);
	}

	if (!messages.length) {
		return (
			<Stack
				sx={{
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography
					variant="L16"
					color="textSecondary"
				>
					Сообщений пока нет
				</Typography>
			</Stack>
		);
	}

	return (
		<MessageList
			messages={messages}
			hasNextPage={query.hasNextPage}
			isFetchingNextPage={query.isFetchingNextPage}
			fetchNextPage={query.fetchNextPage}
			itemHeight={234}
			item={renderMessage}
			loader={renderLoader}
		/>
	);
};
