"use client";

import { useEffect, useRef, useState } from "react";
import { VIDEO_SOURCE } from "@/config/site";
import { pageCopy } from "@/data/site-content";

export function LocalVideo({ poster }: { poster?: string }) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Metadata can finish loading before hydration, in which case the event is never seen.
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 1) setReady(true);
  }, []);

  return (
    <div className={`video-frame${ready ? "" : " is-loading is-loading--spinner"}`}>
      <video
        ref={videoRef}
        controls
        preload="metadata"
        poster={poster}
        aria-label={pageCopy.videoTitle}
        onLoadedMetadata={() => setReady(true)}
        onLoadedData={() => setReady(true)}
        onError={() => setReady(true)}
      >
        <source src={VIDEO_SOURCE.url} type="video/mp4" />
        {pageCopy.videoFallbackMessage}
      </video>
    </div>
  );
}
