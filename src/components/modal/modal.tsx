import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import s from './modal.module.scss';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    'data-testid'?: string;
}

const ModalOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className={s.overlay} onClick={onClose} />
);

export const Modal: React.FC<ModalProps> = ({ children, onClose, 'data-testid': dataTestId }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <>
            <ModalOverlay onClose={onClose} />
            <div className={s.modal} {...(dataTestId && { 'data-testid': dataTestId })} >
                <button className={s.closeButton} onClick={onClose} data-testid="modal-close-button">
                    <CloseIcon type="primary" />
                </button>
                {children}
            </div>
        </>,
        document.getElementById('modals') as HTMLElement
    );
};
