'use client';

import Modal from '@/components/ui/Modal';

interface TechModalProps {
  label: string;
  description: string;
  onClose: () => void;
}

export default function TechModal({
  label,
  description,
  onClose,
}: TechModalProps): React.ReactElement {
  return <Modal title={label} description={description} onClose={onClose} />;
}
