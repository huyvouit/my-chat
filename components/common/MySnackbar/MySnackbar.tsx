import { Alert, Slide, SlideProps, Snackbar, SnackbarProps } from '@mui/material';
import { SnackbarStyles } from 'utils/styled-constants';
import styles from './MySnackNbar.module.scss';

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionRight(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

interface IMySnackbar extends SnackbarProps {
  key: string;
  onClose: () => void;
  snackbarStyles: SnackbarStyles;
}

const MySnackbar: React.FC<IMySnackbar> = ({
  key,
  onClose,
  message,
  anchorOrigin = {
    vertical: 'top', 
    horizontal: 'right',
  },
  snackbarStyles,
}) => {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      key={key}
      open={!!message}
      onClose={handleClose}
      TransitionComponent={TransitionRight}
      autoHideDuration={6000}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={handleClose} severity={snackbarStyles} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default MySnackbar;