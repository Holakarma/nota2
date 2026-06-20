import { Card, CardContent, Typography } from '@mui/material';
import { routeConfig } from '@shared/model/route.config';
import { Link } from '@tanstack/react-router';

type NoteCardProps = {
	text: string;
	tags?: string;
	id?: string;
};

export const NoteCardHeight = () => {
	return 150;
};

export const NoteCard = ({ text, tags, id }: NoteCardProps) => {
	const linkProps = id
		? {
				component: Link,
				to: routeConfig.note,
				params: { noteId: id },
			}
		: {};

	return (
		<Card
			{...linkProps}
			sx={{
				minHeight: NoteCardHeight(),
				borderRadius: 0,
				boxShadow: 'none',
				border: '1px solid',
				borderColor: 'divider',
				display: 'flex',
				flexDirection: 'column',
				textDecoration: 'none',
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
				<Typography
					variant="R20"
					component="div"
					sx={{
						lineHeight: 1.25,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: 3,
						WebkitBoxOrient: 'vertical',
						wordBreak: 'break-word',
					}}
				>
					{text}
				</Typography>

				{tags && (
					<Typography
						variant="R12"
						color="text.secondary"
						sx={{
							alignSelf: 'flex-end',
							maxWidth: '100%',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{tags}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};
