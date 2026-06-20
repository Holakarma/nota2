import { currentUserQueries } from '@entities/user';
import { useSignOutMutation } from '@features/auth';
import {
	Box,
	Button,
	Container,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Stack,
	Tooltip,
} from '@mui/material';
import { DarkModeIcon } from '@shared/icons/dark-mode';
import { LightModeIcon } from '@shared/icons/light-mode';
import { LogoutIcon } from '@shared/icons/logout';
import { routeConfig } from '@shared/model/route.config';
import { useThemeModeStore } from '@shared/model/theme-mode';
import { Logo } from '@shared/ui/logo';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';

export const Header = () => {
	const currentUserQuery = useQuery(currentUserQueries.me());
	const themeMode = useThemeModeStore((state) => state.mode);
	const toggleThemeMode = useThemeModeStore((state) => state.toggleMode);
	const isDarkMode = themeMode === 'dark';

	const navigate = useNavigate();
	const signOutMutation = useSignOutMutation({
			onSuccess: () => {
				navigate({
					to: routeConfig.login,
					replace: true,
				});
			},
		});

	const id = React.useId();
	const menuId = `${id}-menu`;
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
  	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSignOut = async () => {
		await signOutMutation.mutateAsync();
		handleClose();
	}

	return (
		<Box
			component="header"
			sx={{
				borderBottom: '1px solid',
				borderColor: 'divider',
			}}
		>
			<Container
				maxWidth={false}
				disableGutters
				sx={{
					maxWidth: 1440,
					height: 60,
					mx: 'auto',
					px: 1.25,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Logo
					sx={{
						p: 0,
						fontSize: 48,
						lineHeight: 1,
					}}
				/>

				<Stack
					direction="row"
					sx={{
						minWidth: 0,
						alignItems: 'center',
						gap: 1,
					}}
				>
					<Tooltip
						title={isDarkMode ? 'Светлая тема' : 'Тёмная тема'}
					>
						<IconButton
							type="button"
							aria-label={
								isDarkMode
									? 'Включить светлую тему'
									: 'Включить тёмную тему'
							}
							onClick={toggleThemeMode}
						>
							{isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
						</IconButton>
					</Tooltip>

					<Button
					   onClick={handleClick}
					>
						{currentUserQuery.data?.login ?? ''}
					</Button>
					<Menu
						id={menuId}
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
					>
						<MenuItem onClick={handleSignOut}>
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText>
								Выйти
							</ListItemText>
						</MenuItem>
					</Menu> 

				</Stack>
			</Container>
		</Box>
	);
};
