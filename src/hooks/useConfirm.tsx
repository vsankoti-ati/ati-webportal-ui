import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  title: string;
  message: string;
  open: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  title,
  message,
  open,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onConfirm} variant="contained" color="primary" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirm() {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: {
      title: '',
      message: '',
    },
    resolve: null,
  });

  const showConfirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    dialog.resolve?.(true);
    setDialog({ ...dialog, isOpen: false });
  };

  const handleCancel = () => {
    dialog.resolve?.(false);
    setDialog({ ...dialog, isOpen: false });
  };

  const confirmDialog = dialog.isOpen ? (
    <ConfirmDialog
      open={dialog.isOpen}
      title={dialog.options.title}
      message={dialog.options.message}
      confirmText={dialog.options.confirmText}
      cancelText={dialog.options.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return {
    showConfirm,
    confirmDialog,
  };
}