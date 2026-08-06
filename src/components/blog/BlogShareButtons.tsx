"use client";

import { useState } from "react";
import { Link2, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";

export function BlogShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy link");
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    copy();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-deep/50 px-4 py-2 text-sm text-silver transition hover:border-cyan/40 hover:text-cyan"
      >
        <Link2 className="h-4 w-4" />
        {copied ? "Copied" : "Copy link"}
      </button>
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-deep/50 px-4 py-2 text-sm text-silver transition hover:border-cyan/40 hover:text-cyan"
      >
        <Mail className="h-4 w-4" />
        Email
      </a>
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-deep/50 px-4 py-2 text-sm text-silver transition hover:border-cyan/40 hover:text-cyan"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
    </div>
  );
}
