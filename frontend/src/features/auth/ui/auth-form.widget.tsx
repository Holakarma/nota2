import { Box, Card, CardContent } from '@mui/material';
import { Logo } from '@shared/ui/logo';
import { useSnackbar } from '@shared/ui/snackbar';
import { useEffect, type ReactNode } from 'react';

type AuthFormProps = {
	children: ReactNode;
	openSnackbar?: boolean;
	onCloseSnackbar?: () => void;
	snackbarMessage?: string | null;
};

export const AuthFormWidget = ({
	children,
	openSnackbar,
	onCloseSnackbar,
	snackbarMessage,
}: AuthFormProps) => {
	const { showError } = useSnackbar();

	useEffect(() => {
		if (!openSnackbar || !snackbarMessage) {
			return;
		}

		showError(snackbarMessage);
		onCloseSnackbar?.();
	}, [openSnackbar, snackbarMessage, onCloseSnackbar, showError]);

	return (
		<Card
			sx={{
				width: { xs: '100%', sm: 555 },
				maxWidth: 555,
			}}
		>
			<CardContent sx={{ p: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<Logo />
				</Box>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
					}}
				>
					{children}
				</Box>
			</CardContent>
		</Card>
	);
};
