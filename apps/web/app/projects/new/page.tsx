import Link from "next/link";
import { UploadForm } from "../../../components/upload-form";

export default function NewProjectPage() {
  return <main><Link href="/">← Projects</Link><h1>Upload a video</h1><UploadForm /></main>;
}
