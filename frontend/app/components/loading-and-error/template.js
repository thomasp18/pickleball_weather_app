import styles from './template.module.css';

function Template({ emoji, text, rotate }) {
  return <div className={styles.expand}>
    <div className={styles.emojiContainer}>
      <div className={`${styles.emoji} ${rotate && styles.rotate}`}>{emoji}</div>
      <h1 className='display-3'>{text}</h1>
    </div>
  </div>;
}

export default Template;