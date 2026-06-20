import { MessageInput, useMessageDraftStore } from '@features/stream-message';
import { Box, Stack } from '@mui/material';
import { isUuid } from '@shared/lib/is-uuid';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { useNavigate } from '@tanstack/react-router';
import { StreamSidebar } from '@widgets/stream-sidebar';
import { NoteGrid } from './note-grid';
import { StreamHeader } from '@widgets/stream-header';
import { useUrlParams } from '@shared/lib/url-params';

const StreamPage = () => {
	const navigate = useNavigate();

	const { streamId } = useUrlParams();

	const rawStreamId = typeof streamId === 'string' ? streamId : undefined;
	const selectedStreamId = isUuid(rawStreamId) ? rawStreamId : undefined;

	const messageDraft = useMessageDraftStore((state) => state.bodyMarkdown);

	const goToChat = async ({ streamId }: { streamId?: string }) => {
		await navigate({
			to: routeConfig.chat,
			params: { streamId: streamId ?? DEFAULT_STREAM_ROUTE_PARAM },
		});
	};

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
			<StreamSidebar selectedStreamId={selectedStreamId} />

			<Stack
				component="main"
				spacing={1}
				sx={{ p: 1 }}
			>
				<StreamHeader streamId={selectedStreamId} />

				<NoteGrid
					selectedStreamId={selectedStreamId}
					searchQuery={messageDraft}
				/>

				<MessageInput
					streamId={selectedStreamId}
					onMessageSent={goToChat}
				/>
			</Stack>
		</Box>
	);
};

export default StreamPage;
