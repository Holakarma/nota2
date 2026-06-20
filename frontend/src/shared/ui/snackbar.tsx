import { Alert, Snackbar } from '@mui/material';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';

type SnackbarContextValue = {
	showError: (message: string) => void;
};

type SnackbarProviderProps = {
	children: ReactNode;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
	const [message, setMessage] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const showError = useCallback((nextMessage: string) => {
		setMessage(nextMessage);
		setIsOpen(true);
	}, []);

	const closeSnackbar = useCallback((_event?: unknown, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setIsOpen(false);
	}, []);

	const value = useMemo(
		() => ({
			showError,
		}),
		[showError],
	);

	return (
		<SnackbarContext.Provider value={value}>
			{children}

			<Snackbar
				open={isOpen}
				autoHideDuration={5000}
				onClose={closeSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					severity="error"
					onClose={closeSnackbar}
				>
					{message}
				</Alert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
};

export const useSnackbar = () => {
	const context = useContext(SnackbarContext);

	if (!context) {
		throw new Error('useSnackbar must be used within SnackbarProvider');
	}

	return context;
};
