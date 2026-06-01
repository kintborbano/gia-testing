import Modal from '@/components/ui/Modal';
import type { Tech } from './featureData';

interface FeatureTechModalProps {
  activeTech: Tech | null;
  onClose: () => void;
}

export default function FeatureTechModal({
  activeTech,
  onClose,
}: FeatureTechModalProps): React.ReactElement | null {
  if (!activeTech) {
    return null;
  }

  return (
    <Modal
      title={activeTech.label}
      description={activeTech.description}
      onClose={onClose}
    />
  );
}
