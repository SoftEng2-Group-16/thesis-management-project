// ResponsiveDialog.js
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function ResponsiveDialog({ open, handleClose, title, message, handleAction, actionText }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md')); //make it responsive

  const handleActionClick = () => {
    handleAction();
    handleClose(); //close the dialog after the delete/archive
  };

  return (
    <Dialog id="confirmation-dialog"
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button id="dialog-button-cancel" onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button id="dialog-button-confirm" onClick={handleActionClick} autoFocus>
          {actionText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResponsiveDialog;
