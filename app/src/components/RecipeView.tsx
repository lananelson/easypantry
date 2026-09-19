import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loadRecipeIndex, recipePhotoUrl } from "../utils/dataLoader.js";
import type { RecipePhoto } from "../types.js";

/**
 * Only wide landscape photos get the full-width banner (it crops to a strip).
 * Everything else sits beside the text, uncropped and never enlarged.
 */
const HERO_MIN_WIDTH = 800;
const HERO_MIN_ASPECT = 1.3;
const SIDE_PHOTO_MAX_WIDTH = 360;

interface RecipeViewProps {
  path: string;
}

export default function RecipeView({ path }: RecipeViewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<RecipePhoto[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const slug = path.match(/^recipes\/([^/]+)\//)?.[1];

  // App remounts this view per recipe (key={path}), so state starts fresh.
  useEffect(() => {
    if (!slug) return;
    loadRecipeIndex()
      .then((index) => {
        setPhotos(index.find((r) => r.slug === slug)?.photos ?? []);
      })
      .catch(() => setPhotos([]));
  }, [slug]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) =>
          i === null ? i : (i - 1 + photos.length) % photos.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, photos.length]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}${path}`)
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

  const photoUrl = (photo: RecipePhoto) => recipePhotoUrl(slug ?? "", photo.file);
  const lead = photos[0];
  const leadIsHero =
    !!lead &&
    lead.width >= HERO_MIN_WIDTH &&
    lead.height > 0 &&
    lead.width / lead.height >= HERO_MIN_ASPECT;

  return (
    <div className="recipe-view">
      <a
        href="#"
        className="text-muted d-inline-block mb-3"
        onClick={(e) => {
          e.preventDefault();
          if (window.history.length > 1) window.history.back();
          else window.location.hash = "";
        }}
      >
        ← Back
      </a>
      <div className="card">
        {leadIsHero && (
          <img
            className="recipe-hero"
            src={photoUrl(lead)}
            alt=""
            onClick={() => setLightbox(0)}
          />
        )}
        <div className="card-body recipe-body">
          {lead && !leadIsHero && (
            <img
              className="recipe-lead-small"
              src={photoUrl(lead)}
              alt=""
              style={{
                width: lead.width
                  ? `${Math.min(lead.width, SIDE_PHOTO_MAX_WIDTH)}px`
                  : undefined,
              }}
              onClick={() => setLightbox(0)}
            />
          )}
          <h1 className="recipe-title">{title}</h1>
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

          {photos.length > 1 && (
            <>
              <h3 className="mt-4 mb-2">Photos</h3>
              <div className="recipe-gallery">
                {photos.map((photo, index) => (
                  <img
                    key={photo.file}
                    src={photoUrl(photo)}
                    alt=""
                    loading="lazy"
                    onClick={() => setLightbox(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {lightbox !== null && photos[lightbox] && (
        <div className="recipe-lightbox" onClick={() => setLightbox(null)}>
          <img src={photoUrl(photos[lightbox])} alt="" />
          {photos.length > 1 && (
            <div className="recipe-lightbox-count">
              {lightbox + 1} / {photos.length} · ← → to browse, Esc to close
            </div>
          )}
        </div>
      )}
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
  // "## My Notes" is the owner's own voice; collect it into a styled block.
  let out = elements;
  let myNotes: ReactNode[] | null = null;
  const closeMyNotes = () => {
    if (myNotes) {
      elements.push(
        <div key={`notes-${key++}`} className="my-notes">
          {myNotes}
        </div>
      );
      myNotes = null;
      out = elements;
    }
  };
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let paragraphLines: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(" ");
      out.push(
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
      out.push(
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

      if (level <= 2) {
        closeMyNotes();
        if (textContent.trim().toLowerCase() === "my notes") {
          myNotes = [];
          out = myNotes;
        }
      }
      let HeadingTag: "h2" | "h3" | "h4";
      if (level <= 1) HeadingTag = "h2";
      else if (level === 2) HeadingTag = "h3";
      else HeadingTag = "h4";

      out.push(
        <HeadingTag key={`h-${key++}`} className="mt-3 mb-2">
          {textContent}
        </HeadingTag>
      );
      continue;
    }

    // Photos are shown as a gallery; the reference line is just bookkeeping.
    if (/^[-*]\s+Photos:/.test(trimmed)) continue;

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
  closeMyNotes();

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
