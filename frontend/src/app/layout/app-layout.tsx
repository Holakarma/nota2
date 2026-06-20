import { Box, Container } from '@mui/material';
import { Header } from '@widgets/header';
import { Outlet } from '@tanstack/react-router';

export const Layout = () => {
	return (
		<Box
			sx={{
				height: '100vh',
				minHeight: 560,
				maxHeight: 1024,
				bgcolor: 'background.default',
				color: 'text.primary',
				display: 'grid',
				gridTemplateRows: '61px minmax(0, 1fr)',
				overflow: 'hidden',
			}}
		>
			<Header />

			<Container
				maxWidth={false}
				disableGutters
				sx={{
					width: '100%',
					maxWidth: 1440,
					height: '100%',
					mx: 'auto',
					minHeight: 0,
				}}
			>
				<Outlet />
			</Container>
		</Box>
	);
};
