import styles from "./page.module.css";
import Link from "next/link";
import { ProjectList } from "../components/project-list";
import { listProjects } from "../lib/projects";

export default async function Home() {
  const projects = await listProjects();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={styles.eyebrow}>Clipper local MVP</p>
        <h1>Turn your own videos into vertical clips.</h1>
        <p className={styles.description}>Upload an MP4 or MOV, choose a range, and export one center-cropped 9:16 clip.</p>
        <Link className={styles.cta} href="/projects/new">New video project</Link>
        <section className={styles.projects}><h2>Your projects</h2><ProjectList projects={projects} /></section>
      </main>
    </div>
  );
}
