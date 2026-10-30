interface RecipeVideo {
  id: string;
  author: string;
  coverFile: string;
}
const videos: Record<string, RecipeVideo> = {
  'farinata-caramelized-onions-tomatoes-butter-beans': {
    id: '7689796740723084566', author: '@adip_food', coverFile: 'farinata.jpg',
  },
  'loaded-olive-oil': {
    id: '7620907171764505887', author: '@flavorsbyyulia', coverFile: 'loaded-olive-oil.jpg',
  },
  'marousalata': {
    id: '7617418772823002388', author: '@creamy_confusion', coverFile: 'marousalata.jpg',
  },
};
export function recipeVideo(slug: string) {
  const video = videos[slug];
  if (!video) return undefined;
  return {
    ...video,
    url: `https://www.tiktok.com/${video.author}/video/${video.id}`,
    cover: `${import.meta.env.BASE_URL}video-covers/${video.coverFile}`,
  };
}
