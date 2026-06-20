import { Typography, type TypographyProps } from '@mui/material';

type LogoProps = Omit<TypographyProps, 'children' | 'variant'>;

export const Logo = (props: LogoProps) => {
	return (
		<Typography
			{...props}
			variant="Logo"
			component={props.component ?? 'div'}
			sx={[
				{
					color: 'primary.main',
				},
				...(Array.isArray(props.sx) ? props.sx : [props.sx]),
			]}
		>
			Nota
		</Typography>
	);
};
