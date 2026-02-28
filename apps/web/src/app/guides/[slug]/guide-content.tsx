"use client";

import { useMemo } from "react";
import { YamlBlock } from "@/components/guide/yaml-block";

interface GuideContentProps {
  content: string;
}

/**
 * Renders MDX-like guide content with enhanced code blocks.
 *
 * This is a simple Markdown-to-React renderer that handles:
 * - Headings (h1-h3)
 * - Paragraphs
 * - Code blocks (with YAML syntax highlighting via YamlBlock)
 * - Unordered and ordered lists
 * - Bold and italic text
 * - Links
 * - Tables
 * - Horizontal rules
 *
 * In production, this would be replaced with next-mdx-remote or similar.
 */
export function GuideContent({ content }: GuideContentProps) {
  const rendered = useMemo(() => renderMarkdown(content), [content]);

  return (
    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-aqua prose-strong:text-foreground prose-code:text-aqua prose-li:text-muted-foreground">
      {rendered}
    </div>
  );
}

function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join("\n");

      if (lang === "yaml" || lang === "yml") {
        elements.push(<YamlBlock key={key++} code={code} />);
      } else {
        elements.push(
          <pre
            key={key++}
            className="my-4 overflow-x-auto rounded-lg border border-border/50 bg-[#0d1117] p-4"
          >
            <code className="text-sm text-[#c9d1d9]">{code}</code>
          </pre>
        );
      }
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="mt-8 mb-3 text-lg font-semibold">
          {inlineFormat(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mt-10 mb-4 text-xl font-bold">
          {inlineFormat(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      // Skip h1 — the page header handles the title
      i++;
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      elements.push(
        <hr key={key++} className="my-8 border-border/50" />
      );
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && lines[i + 1]?.match(/^\|[\s-|]+\|$/)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(renderTable(tableLines, key++));
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-3 ml-6 list-disc space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>{inlineFormat(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="my-3 ml-6 list-decimal space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>{inlineFormat(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={key++} className="my-3">
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return elements;
}

function inlineFormat(text: string): React.ReactNode {
  // Process bold, italic, code, and links
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let partKey = 0;

  while (remaining.length > 0) {
    // Link: [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/);

    // Find earliest match
    const matches = [
      linkMatch ? { type: "link", match: linkMatch } : null,
      boldMatch ? { type: "bold", match: boldMatch } : null,
      codeMatch ? { type: "code", match: codeMatch } : null,
    ]
      .filter(Boolean)
      .sort((a, b) => {
        const aIdx = remaining.indexOf(a!.match[0]);
        const bIdx = remaining.indexOf(b!.match[0]);
        return aIdx - bIdx;
      });

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const earliest = matches[0]!;
    const idx = remaining.indexOf(earliest.match[0]);

    if (idx > 0) {
      parts.push(remaining.slice(0, idx));
    }

    if (earliest.type === "link") {
      parts.push(
        <a
          key={partKey++}
          href={earliest.match[2]}
          className="text-aqua underline hover:text-aqua-dim"
        >
          {earliest.match[1]}
        </a>
      );
    } else if (earliest.type === "bold") {
      parts.push(
        <strong key={partKey++} className="font-semibold text-foreground">
          {earliest.match[1]}
        </strong>
      );
    } else if (earliest.type === "code") {
      parts.push(
        <code
          key={partKey++}
          className="rounded bg-muted px-1.5 py-0.5 text-sm text-aqua"
        >
          {earliest.match[1]}
        </code>
      );
    }

    remaining = remaining.slice(idx + earliest.match[0].length);
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function renderTable(lines: string[], key: number): React.ReactNode {
  const parseRow = (line: string): string[] =>
    line
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);

  const headers = parseRow(lines[0]);
  // Skip separator line (index 1)
  const rows = lines.slice(2).map(parseRow);

  return (
    <div key={key} className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border border-border/50 bg-muted/50 px-3 py-2 text-left font-semibold"
              >
                {inlineFormat(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="border border-border/50 px-3 py-2"
                >
                  {inlineFormat(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
