import { TechModal } from '@/components/TechModal/TechModal';
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
    <TechModal
      label={activeTech.label}
      description={activeTech.description}
      onClose={onClose}
    />
  );
}
