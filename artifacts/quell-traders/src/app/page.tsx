import { existsSync } from "node:fs";
import path from "node:path";
import { HomePage } from "@/components/site/home-page";
import { VideoPlayer } from "@/components/site/video-player";

export default function Page() {
  // Drop real brand assets into public/logo.png and public/images/tij-printer.jpg.
  const logoAvailable = existsSync(path.join(process.cwd(), "public", "logo.png"));
  const printerImageAvailable = existsSync(path.join(process.cwd(), "public", "images", "tij-printer.jpg"));
  return (
    <HomePage
      introVideo={<VideoPlayer />}
      logoAvailable={logoAvailable}
      printerImageAvailable={printerImageAvailable}
    />
  );
}
