import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={styles.eyebrow}>Clipper</p>
        <h1>Turn your own videos into short-form clips.</h1>
        <p className={styles.description}>
          The video editor MVP is being prepared. Upload, trim, crop, and
          export workflows will be built here.
        </p>
      </main>
    </div>
  );
}
