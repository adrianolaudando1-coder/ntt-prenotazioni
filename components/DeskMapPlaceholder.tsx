import Image from 'next/image';

type Props = {
  title?: string;
};

export default function DeskMapPlaceholder({
  title = 'Mappa postazioni',
}: Props) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        <p style={styles.title}>{title}</p>

        <div style={styles.imageContainer}>
          <Image
            src="/mappa-postazioni.png"
            alt="Mappa delle postazioni"
            width={1200}
            height={800}
            style={styles.image}
            priority
          />
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    width: '100%',
    border: '1px dashed #b8c2cc',
    borderRadius: '12px',
    padding: 'clamp(12px, 4vw, 20px)',
    backgroundColor: '#fafbfd',
    boxSizing: 'border-box',
  },

  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'center',
    width: '100%',
  },

  title: {
    margin: 0,
    fontWeight: 700,
    fontSize: 'clamp(14px, 4vw, 16px)',
    lineHeight: 1.3,
    wordBreak: 'break-word',
  },

  text: {
    margin: 0,
    color: '#555',
    fontSize: 'clamp(13px, 3.8vw, 14px)',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },

  imageContainer: {
    width: '100%',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box',
  },

  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: '12px',
  },
};
