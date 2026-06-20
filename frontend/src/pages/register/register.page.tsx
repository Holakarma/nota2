import { RegisterForm } from '@features/auth';
import { Box } from '@mui/material';

const RegisterPage = () => {
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
			<RegisterForm />
		</Box>
	);
};

export default RegisterPage;
