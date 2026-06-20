import { Box, Tooltip } from '@mui/material';
import { SyncDisabledIcon } from '@shared/icons/sync-disabled';
import { SyncProblemIcon } from '@shared/icons/sync-problem';
import { SyncIcon } from '@shared/icons/sync';
import type { ComponentType } from 'react';
import type { NoteContentSyncState } from '../model/note-content';

type SyncStatusView = {
	title: string;
	color: string;
	Icon: ComponentType;
	isActive: boolean;
};

type NoteContentSyncStatusProps = {
	state: NoteContentSyncState;
};

const syncStatusView: Record<NoteContentSyncState, SyncStatusView> = {
	disabled: {
		title: 'Синхронизация недоступна',
		color: 'text.disabled',
		Icon: SyncDisabledIcon,
		isActive: false,
	},
	failed: {
		title: 'Не удалось синхронизировать заметку',
		color: 'error.main',
		Icon: SyncProblemIcon,
		isActive: false,
	},
	syncing: {
		title: 'Синхронизация...',
		color: 'info.main',
		Icon: SyncIcon,
		isActive: true,
	},
	synced: {
		title: 'Заметка синхронизирована',
		color: 'success.main',
		Icon: SyncIcon,
		isActive: false,
	},
};

export const NoteContentSyncStatus = ({
	state,
}: NoteContentSyncStatusProps) => {
	const status = syncStatusView[state];
	const Icon = status.Icon;

	return (
		<Tooltip title={status.title}>
			<Box
				role="status"
				aria-label={status.title}
				aria-live="polite"
				sx={{
					position: 'absolute',
					top: 8,
					right: 12,
					width: 32,
					height: 32,
					display: 'grid',
					placeItems: 'center',
					borderRadius: 1,
					border: '1px solid',
					borderColor: 'divider',
					bgcolor: 'background.paper',
					color: status.color,
					'@keyframes noteContentSyncSpin': {
						to: {
							transform: 'rotate(360deg)',
						},
					},
				}}
			>
				<Box
					sx={{
						display: 'inline-flex',
						animation: status.isActive
							? 'noteContentSyncSpin 1.1s linear infinite'
							: undefined,
						'& svg': {
							fontSize: 20,
						},
					}}
				>
					<Icon />
				</Box>
			</Box>
		</Tooltip>
	);
};
