"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/config/site";

export function BrandMark({
  compact = false,
  imageAvailable = false,
}: {
  compact?: boolean;
  imageAvailable?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <a className={`brand-mark${compact ? " brand-mark--compact" : ""}`} href="#home" aria-label={`${site.name} home`}>
      {imageAvailable && !imageFailed ? (
        // Replace public/logo.png with the final Quell Traders logo.
        <Image
          src={site.logoImage}
          alt=""
          width={128}
          height={128}
          className="brand-mark__image"
          onError={() => setImageFailed(true)}
          priority
        />
      ) : (
        <span className="brand-mark__symbol" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
      <span className="brand-mark__words">
        <strong>{site.name.split(" ")[0]}</strong>
        <small>{site.name.split(" ").slice(1).join(" ").toUpperCase()}</small>
      </span>
    </a>
  );
}
