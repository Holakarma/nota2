import { Card, CardContent, Typography } from '@mui/material';
import { routeConfig } from '@shared/model/route.config';
import { Link } from '@tanstack/react-router';

type StreamCardProps = {
	text: string;
	id?: string;
};

export const StreamCard = ({ text, id }: StreamCardProps) => {
	const linkProps = id
		? {
				component: Link,
				to: routeConfig.stream,
				params: { streamId: id },
			}
		: {};

	return (
		<Card
			{...linkProps}
			sx={{
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
			</CardContent>
		</Card>
	);
};
