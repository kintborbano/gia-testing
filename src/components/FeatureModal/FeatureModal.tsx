'use client';

import Modal from '@/components/ui/Modal';

interface FeatureModalProps {
  label: string;
  description: string;
  onClose: () => void;
}

export function FeatureModal({
  label,
  description,
  onClose,
}: FeatureModalProps): React.ReactElement {
  return <Modal title={label} description={description} onClose={onClose} />;
}
