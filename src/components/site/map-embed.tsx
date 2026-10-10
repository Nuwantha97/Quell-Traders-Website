"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { pageCopy } from "@/data/site-content";

export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`map-frame${loaded ? "" : " is-loading is-loading--spinner"}`}>
      <iframe
        title={pageCopy.mapTitle}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
