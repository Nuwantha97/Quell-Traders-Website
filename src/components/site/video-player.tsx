import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { site, VIDEO_SOURCE } from "@/config/site";
import { pageCopy } from "@/data/site-content";

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes("youtu.be")
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
  } catch {
    return null;
  }
}

export function VideoPlayer() {
  if (VIDEO_SOURCE.type === "youtube") {
    const embedUrl = getYoutubeEmbedUrl(VIDEO_SOURCE.url);
    return (
      <div className="video-frame">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={pageCopy.videoTitle}
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="video-placeholder" role="status">
            <span className="video-placeholder__play" aria-hidden="true">▶</span>
            <span>{pageCopy.comingSoon}</span>
          </div>
        )}
      </div>
    );
  }

  const localPath = path.join(process.cwd(), "public", VIDEO_SOURCE.url.replace(/^\//, ""));
  if (!existsSync(localPath)) {
    return (
      <div className="video-frame">
        <div className="video-placeholder" role="status">
          <span className="video-placeholder__play" aria-hidden="true">▶</span>
          <span>{pageCopy.comingSoon}</span>
        </div>
      </div>
    );
  }

  const posterPath = path.join(process.cwd(), "public", site.videoPoster.replace(/^\//, ""));
  return (
    <div className="video-frame">
      <video
        controls
        preload="metadata"
        poster={existsSync(posterPath) ? site.videoPoster : undefined}
        aria-label={pageCopy.videoTitle}
      >
        <source src={VIDEO_SOURCE.url} type="video/mp4" />
        {pageCopy.videoFallbackMessage}
      </video>
    </div>
  );
}
