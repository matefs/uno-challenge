import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';

const SnackbarTemporizado = ({ message, duration = 2000 }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (message) {
            setOpen(true);

            const timer = setTimeout(() => {
                setOpen(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000} // Tempo máximo de exibição (opcional)
            onClose={handleClose}
            message={message}
        />
    );
};

export default SnackbarTemporizado;