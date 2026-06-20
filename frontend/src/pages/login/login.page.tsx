import { LoginForm } from '@features/auth';
import { Box } from '@mui/material';

const LoginPage = () => {
	return (
		<Box
			component="main"
			sx={{
				minHeight: '100vh',
				bgcolor: 'background.default',
				border: '1px solid',
				borderColor: 'divider',
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				px: 2,
			}}
		>
			<LoginForm />
		</Box>
	);
};

export default LoginPage;
