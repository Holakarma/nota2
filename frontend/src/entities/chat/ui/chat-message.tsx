import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import type { ChatMessageResponseDto } from '@shared/api';

type ChatMessageProps = {
	message: ChatMessageResponseDto;
	resultSlot?: ReactNode;
};

export const ChatMessage = ({ message, resultSlot }: ChatMessageProps) => {
	if (message.role === 'USER') {
		return (
			<Box
				sx={{
					alignSelf: 'flex-end',
					maxWidth: {
						xs: '100%',
						sm: 360,
					},
					minWidth: { xs: 0, sm: 360 },
					bgcolor: 'action.selected',
					px: 1.5,
					py: 1,
					borderRadius: 2,
					borderBottomRightRadius: 0,
				}}
			>
				<Typography
					variant="L20"
					component="div"
					sx={{
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
						lineHeight: 1.35,
					}}
				>
					{message.bodyMarkdown}
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				alignSelf: 'flex-start',
				width: {
					xs: '100%',
					sm: 400,
				},
				maxWidth: '100%',
			}}
		>
			<Typography
				variant="L16"
				sx={{ mb: 0.75, fontStyle: 'italic' }}
			>
				{message.bodyMarkdown || 'Заметка сохранена'}
			</Typography>
			{resultSlot}
		</Box>
	);
};
