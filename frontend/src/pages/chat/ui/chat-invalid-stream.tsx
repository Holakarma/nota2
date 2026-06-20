import { Box, Button, Typography } from '@mui/material';

type ChatInvalidStreamProps = {
	onNavigateToStreams: () => void;
};

export const ChatInvalidStream = ({
	onNavigateToStreams,
}: ChatInvalidStreamProps) => {
	return (
		<Box
			component="main"
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 2,
				px: 2,
			}}
		>
			<Typography variant="R20">Поток не найден</Typography>
			<Button
				variant="outlined"
				onClick={onNavigateToStreams}
			>
				К общему потоку
			</Button>
		</Box>
	);
};
