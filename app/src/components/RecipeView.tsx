import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface RecipeViewProps {
  path: string;
}

export default function RecipeView({ path }: RecipeViewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setContent(null);

    fetch(`/easypantry/${path}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load recipe (${response.status})`);
        }
        return response.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [path]);

  const title = deriveRecipeTitle(path, content);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="ms-auto">
          <span className="badge bg-blue-lt">Recipe</span>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            Error loading recipe: {error}
          </div>
        )}
        {!loading && !error && content && (
          <div className="markdown-body">{renderMarkdownRecipe(content)}</div>
        )}
      </div>
    </div>
  );
}

function deriveRecipeTitle(path: string, content: string | null): string {
  if (content) {
    const lines = content.split("\n");
    let i = 0;

    if (lines[i]?.trim() === "---") {
      i++;
      for (; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed === "---") break;
        if (trimmed.toLowerCase().startsWith("title:")) {
          const value = trimmed.slice("title:".length).trim();
          if (value) return value;
        }
      }
    }

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) {
        return trimmed.slice(2).trim();
      }
    }
  }

  const parts = path.split("/");
  const slug = parts[parts.length - 2] || path;
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderMarkdownRecipe(text: string) {
  const lines = text.split("\n");
  let i = 0;

  // Strip YAML frontmatter if present
  if (lines[i]?.trim() === "---") {
    i++;
    while (i < lines.length && lines[i].trim() !== "---") {
      i++;
    }
    if (i < lines.length && lines[i].trim() === "---") {
      i++;
    }
  }

  const elements: ReactNode[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let paragraphLines: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(" ");
      elements.push(
        <p key={`p-${key++}`} className="mb-2">
          {renderInline(text)}
        </p>
      );
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (list) {
      const ListTag = list.type === "ul" ? "ul" : "ol";
      elements.push(
        <ListTag key={`list-${key++}`} className="mb-3">
          {list.items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </ListTag>
      );
      list = null;
    }
  };

  for (; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      flushParagraph();
      flushList();

      const level = headingMatch[1].length;
      const textContent = headingMatch[2];
      let HeadingTag: "h2" | "h3" | "h4";
      if (level <= 1) HeadingTag = "h2";
      else if (level === 2) HeadingTag = "h3";
      else HeadingTag = "h4";

      elements.push(
        <HeadingTag key={`h-${key++}`} className="mt-3 mb-2">
          {textContent}
        </HeadingTag>
      );
      continue;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      flushParagraph();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(ulMatch[1]);
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      flushParagraph();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(olMatch[1]);
      continue;
    }

    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  if (elements.length === 0) {
    return <pre className="mb-0">{text}</pre>;
  }

  return <div>{elements}</div>;
}

function renderInline(text: string) {
  // Very small helper to auto-link bare URLs like https://...
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: (string | ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1];
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={`link-${lastIndex}-${match.index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>
    );
    lastIndex = match.index + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (parts.length === 0) return text;
  return parts;
}
