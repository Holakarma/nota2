import { MessageInput, useMessageDraftStore } from '@features/stream-message';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useNavigate, useParams } from '@tanstack/react-router';
import { StreamSidebar } from '@widgets/stream-sidebar';
import { getValidChatStreamId } from '../model/chat-route';
import { ChatInvalidStream } from './chat-invalid-stream';
import { useQuery } from '@tanstack/react-query';
import { chatQueries } from '@entities/chat';
import { Messages } from './messages';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { StreamHeader } from '@widgets/stream-header';
import { SearchResult } from '@features/search';
import { isDefaultStream } from '@entities/stream';

const ChatPage = () => {
	const navigate = useNavigate();
	const params = useParams({ strict: false });
	const messageDraft = useMessageDraftStore((state) => state.bodyMarkdown);

	const rawStreamId =
		typeof params.streamId === 'string' ? params.streamId : undefined;
	const streamId = getValidChatStreamId(rawStreamId);
	const hasInvalidStreamId = Boolean(
		rawStreamId && !streamId && !isDefaultStream(rawStreamId),
	);

	const chatQuery = useQuery(chatQueries.byStream({ streamId }));
	const noteRouteStreamId = streamId ?? DEFAULT_STREAM_ROUTE_PARAM;

	const goToStreams = () => {
		void navigate({
			to: routeConfig.chat,
			params: { streamId: DEFAULT_STREAM_ROUTE_PARAM },
		});
	};

	if (hasInvalidStreamId || chatQuery.isError) {
		return <ChatInvalidStream onNavigateToStreams={goToStreams} />;
	}

	return (
		<Box
			sx={{
				height: '100%',
				minHeight: 0,
				display: 'grid',
				gridTemplateColumns: {
					xs: '1fr',
					md: '270px minmax(0, 1fr)',
				},
				gridTemplateRows: {
					xs: 'auto minmax(0, 1fr)',
					md: 'minmax(0, 1fr)',
				},
			}}
		>
			<StreamSidebar selectedStreamId={streamId} />

			<Stack
				component="main"
				spacing={1.5}
				sx={{
					height: '100%',
					minHeight: 0,
					overflow: 'hidden',
					p: 1,
				}}
			>
				<StreamHeader
					streamId={streamId}
					chatMode={true}
				/>

				{!chatQuery.isPending ? (
					<>
						<Messages
							chatId={chatQuery.data.id}
							streamId={noteRouteStreamId}
						/>
						<SearchResult
							query={messageDraft}
							noteLinkContext="chat"
							streamId={noteRouteStreamId}
						/>
						<MessageInput
							chatId={chatQuery.data?.id}
							autoFocus
						/>
					</>
				) : (
					<Stack
						sx={{
							width: '100%',
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<CircularProgress />
					</Stack>
				)}
			</Stack>
		</Box>
	);
};

export default ChatPage;
