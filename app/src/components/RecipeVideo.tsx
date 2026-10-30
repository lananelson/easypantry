import { useEffect, useRef } from 'react';
import './RecipeVideo.css';
import { recipeVideo } from "../utils/recipeVideo";
export function RecipeVideoPlayer({ slug }: { slug: string }) {
  const video = recipeVideo(slug);
  if (!video) return null;
  return <div className="recipe-video-player"><iframe title={`Recipe video by ${video.author}`} src={`https://www.tiktok.com/player/v1/${video.id}?autoplay=0&description=1&music_info=0`} allow="fullscreen; autoplay; encrypted-media; picture-in-picture" allowFullScreen /><a href={video.url} target="_blank" rel="noopener noreferrer">Watch on TikTok · {video.author} ↗</a></div>;
}
export function RecipeVideoModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} className="recipe-video-modal" aria-label="Watch recipe" onCancel={onClose} onClose={onClose} onClick={e=>{if(e.target===e.currentTarget) onClose();}}><button autoFocus className="shop-link video-close" onClick={onClose}>Close ×</button><RecipeVideoPlayer slug={slug}/></dialog>;
}
