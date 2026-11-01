interface RecipeVideo {
  id: string;
  author: string;
  coverFile?: string;
}
const videos: Record<string, RecipeVideo> = {
  'miso-mushroom-pie': {
    id: '7554691925974994198', author: '@bosh.tv',
  },
  'kabocha-squash-miso-soup': {
    id: '7700324050664459533', author: '@yokoskitchen', coverFile: 'kabocha-squash-miso-soup.jpg',
  },
  'zucchini-pancakes': {
    id: '7681871082306948366', author: '@plantbasedrd', coverFile: 'zucchini-pancakes.jpg',
  },
  'farinata-caramelized-onions-tomatoes-butter-beans': {
    id: '7689796740723084566', author: '@adip_food', coverFile: 'farinata.jpg',
  },
  'loaded-olive-oil': {
    id: '7620907171764505887', author: '@flavorsbyyulia', coverFile: 'loaded-olive-oil.jpg',
  },
  'marousalata': {
    id: '7617418772823002388', author: '@creamy_confusion', coverFile: 'marousalata.jpg',
  },
  'bun-ca-moi-hop': {
    id: '7693726342109613342', author: '@feedthepudge', coverFile: 'bun-ca-moi-hop.jpg',
  },
  'creamy-miso-coconut-butter-beans': {
    id: '7281682671007288609', author: '@roxyandben', coverFile: 'creamy-miso-coconut-butter-beans.jpg',
  },
  'lebanese-red-lentil-soup-shorbat-adas': {
    id: '7419713420859084064', author: '@thechefziad', coverFile: 'lebanese-red-lentil-soup-shorbat-adas.jpg',
  },
  'harissa-sardine-avocado-toast': {
    id: '6963754025212857606', author: '@lahbco', coverFile: 'harissa-sardine-avocado-toast.jpg',
  },
  'eggs-en-cocotte-baked-eggs': {
    id: '7052128961630915886', author: '@craving_california', coverFile: 'eggs-en-cocotte-baked-eggs.jpg',
  },
  'homemade-chilli-crisp-chilli-oil': {
    id: '7190163570275962117', author: '@vernahungrybanana', coverFile: 'homemade-chilli-crisp-chilli-oil.jpg',
  },
  'sticky-tofu': {
    id: '7055375498246917382', author: '@sheffara', coverFile: 'sticky-tofu.jpg',
  },
  'spicy-butter-garlic-pasta': {
    id: '7057452591801797894', author: '@itsgnochgnoch', coverFile: 'spicy-butter-garlic-pasta.jpg',
  },
  'smoky-carrot-hazelnut-dip': {
    id: '7028352248623189254', author: '@lahbco', coverFile: 'smoky-carrot-hazelnut-dip.jpg',
  },
  'my-mums-best-tuna-steak-salad': {
    id: '7230887259891862810', author: '@desertislanddishes', coverFile: 'my-mums-best-tuna-steak-salad.jpg',
  },
  'grilled-peach-panzanella': {
    id: '7124227804555758854', author: '@juliusfiedler', coverFile: 'grilled-peach-panzanella.jpg',
  },
  'chicken-piccata': {
    id: '7146273488653782277', author: '@adip_food', coverFile: 'chicken-piccata.jpg',
  },
  'sticky-soy-honey-baked-salmon': {
    id: '7146930504296697093', author: '@letsmunch', coverFile: 'sticky-soy-honey-baked-salmon.jpg',
  },
  'pantry-carbonara': {
    id: '7148896664214965510', author: '@carolinagelen', coverFile: 'pantry-carbonara.jpg',
  },
  'buttery-garlic-herb-spaghetti-squash-pasta': {
    id: '7396072187066584352', author: '@carolinagelen', coverFile: 'buttery-garlic-herb-spaghetti-squash-pasta.jpg',
  },
  'spicy-lemon-shrimp-alfredo-pasta': {
    id: '7173752759538175238', author: '@nutrientmatters', coverFile: 'spicy-lemon-shrimp-alfredo-pasta.jpg',
  },
  'seaweed-sesame-pasta': {
    id: '7696707811744501005', author: '@happy.baes', coverFile: 'seaweed-sesame-pasta.jpg',
  },
  'lamb-arayes': {
    id: '7213375861330922757', author: '@thechefmine', coverFile: 'lamb-arayes.jpg',
  },
  'tofu-cabbage-rolls': {
    id: '7253814219076930822', author: '@iankewks', coverFile: 'tofu-cabbage-rolls.jpg',
  },
  'herbal-bone-broth': {
    id: '7369055461062003974', author: '@orysiaanna', coverFile: 'herbal-bone-broth.jpg',
  },
  'green-beans-miso-butter-onions': {
    id: '7424308132005858565', author: '@saltnpepperhere', coverFile: 'green-beans-miso-butter-onions.jpg',
  },
};
export function recipeVideo(slug: string) {
  const video = videos[slug];
  if (!video) return undefined;
  return {
    ...video,
    url: `https://www.tiktok.com/${video.author}/video/${video.id}`,
    cover: video.coverFile ? `${import.meta.env.BASE_URL}video-covers/${video.coverFile}` : undefined,
  };
}
