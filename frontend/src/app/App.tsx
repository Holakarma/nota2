import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from '@shared/ui/snackbar';

import { router } from './providers/router/router';
import { AppThemeProvider } from './providers/theme';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 30_000,
		},
		mutations: {
			retry: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AppThemeProvider>
				<SnackbarProvider>
					<RouterProvider router={router} />
				</SnackbarProvider>
			</AppThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
