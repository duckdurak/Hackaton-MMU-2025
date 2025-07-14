import { type FC } from 'react';
import type { ModalProps } from './Modal.interface';
import { ModalContent, Overlay } from './Modal.styles';

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </Overlay>
  );
};