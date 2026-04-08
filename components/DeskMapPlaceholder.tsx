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
    border: '1px dashed #b8c2cc',

    borderRadius: '12px',

    padding: '20px',

    backgroundColor: '#fafbfd',
  },

  inner: {
    display: 'flex',

    flexDirection: 'column',

    gap: '12px',

    textAlign: 'center',
  },

  title: {
    margin: 0,

    fontWeight: 700,

    fontSize: '16px',
  },

  text: {
    margin: 0,

    color: '#555',

    fontSize: '14px',
  },

  imageContainer: {
    width: '100%',

    overflow: 'hidden',

    borderRadius: '12px',

    backgroundColor: '#ffffff',

    border: '1px solid #e2e8f0',
  },

  image: {
    width: '100%',

    height: 'auto',

    display: 'block',

    borderRadius: '12px',
  },
};
