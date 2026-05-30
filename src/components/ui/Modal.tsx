'use client';

interface ModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function Modal({
  title,
  description,
  onClose,
}: ModalProps): React.ReactElement {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.45)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: 360,
          padding: 24,
          background: '#fff',
          borderRadius: 12,
          position: 'relative',
        }}
      >
        <button
          aria-label="Close modal"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: 18,
          }}
        >
          &times;
        </button>
        <h2 style={{ margin: '0 0 12px' }}>{title}</h2>
        <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}
