import { streamQueries } from '@entities/stream';
import { Box, Stack, Button, Typography } from '@mui/material';
import { ArrowForwardIcon } from '@shared/icons/arrow-forward';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

export type StreamHeaderProps = {
	streamId?: string;
	chatMode?: boolean;
};

export const StreamHeader = ({
	streamId,
	chatMode = false,
}: StreamHeaderProps) => {
	const streamQuery =
		streamId && useQuery(streamQueries.detail({ id: streamId }));
	const streamName = streamQuery
		? streamQuery.data?.name || ''
		: 'Все заметки';

	const targetStreamId = streamId ?? DEFAULT_STREAM_ROUTE_PARAM;

	return (
		<Stack
			direction="row"
			sx={{ justifyContent: 'space-between', alignItems: 'center' }}
		>
			<Typography
				variant="M20"
				sx={{
					maxWidth: { xs: '130px', sm: '280px', md: '500px' },
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					display: '-webkit-box',
					WebkitLineClamp: 1,
					WebkitBoxOrient: 'vertical',
				}}
			>
				{streamName}
			</Typography>
			<Link
				to={chatMode ? routeConfig.stream : routeConfig.chat}
				params={{ streamId: targetStreamId }}
			>
				<Button
					variant="text"
					sx={{ textTransform: 'none', whiteSpace: 'nowrap', minWidth: 0 }}
					endIcon={<ArrowForwardIcon />}
				>
					<Box
						component="span"
						sx={{ display: { xs: 'none', sm: 'inline' } }}
					>
						{chatMode ? 'К списку заметок' : 'К чату'}
					</Box>
					<Box
						component="span"
						sx={{ display: { xs: 'inline', sm: 'none' } }}
					>
						{chatMode ? 'Заметки' : 'Чат'}
					</Box>
				</Button>
			</Link>
		</Stack>
	);
};
