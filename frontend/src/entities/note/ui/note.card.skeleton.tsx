import { Card, CardContent, Skeleton } from '@mui/material';
import { NoteCardHeight } from './note.card';

export const NoteCardSkeleton = () => {
	return (
		<Card
			sx={{
				minHeight: NoteCardHeight(),
				borderRadius: 0,
				boxShadow: 'none',
				border: '1px solid',
				borderColor: 'divider',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<CardContent
				sx={{
					display: 'flex',
					flexGrow: 1,
					flexDirection: 'column',
					justifyContent: 'space-between',
				}}
			>
				<Skeleton variant="text" />
			</CardContent>
		</Card>
	);
};
