import styles from './template.module.css';

function Template({ emoji, text, rotate }) {
  return <div className={styles.expand}>
    <div className={styles.emojiContainer}>
      <p className={`${styles.emoji} ${rotate && styles.rotate}`}>{emoji}</p>
      <h1 className='display-3'>{text}</h1>
    </div>
  </div>;
}

export default Template;