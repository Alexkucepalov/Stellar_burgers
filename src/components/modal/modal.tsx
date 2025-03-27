import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import s from './modal.module.scss';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const ModalOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className={s.overlay} onClick={onClose} />
);

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
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
            <div className={s.modal}>
                <button className={s.closeButton} onClick={onClose}>
                    <CloseIcon type="primary" />
                </button>
                {children}
            </div>
        </>,
        document.getElementById('modals') as HTMLElement
    );
};
