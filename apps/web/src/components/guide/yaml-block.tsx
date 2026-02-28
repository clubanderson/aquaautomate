"use client";

import { useState, useCallback } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Duration in ms to show the "Copied" checkmark */
const COPY_FEEDBACK_MS = 2000;

interface YamlBlockProps {
  code: string;
  filename?: string;
  title?: string;
}

export function YamlBlock({ code, filename, title }: YamlBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  }, [code]);

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border/50 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 bg-[#161b22] px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileCode2 className="h-3.5 w-3.5 text-aqua" />
          <span>{title ?? filename ?? "configuration.yaml"}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-aqua"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="text-[#c9d1d9]">{code}</code>
      </pre>
    </div>
  );
}
