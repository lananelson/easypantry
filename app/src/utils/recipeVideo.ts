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
  'shanghai-pork-bok-choy-dumplings': {
    id: '7507301942356544773', author: '@saltnpepperhere', coverFile: 'shanghai-pork-bok-choy-dumplings.jpg',
  },
  'vodka-parm-sausage-fusilli': {
    id: '7479116170323430662', author: '@chefdwightsmith', coverFile: 'vodka-parm-sausage-fusilli.jpg',
  },
  'carrots-butter-bean-puree': {
    id: '7242415674084101402', author: '@adip_food', coverFile: 'carrots-butter-bean-puree.jpg',
  },
  'zucchini-scarpaccia': {
    id: '7294675620426992928', author: '@spicymoustache', coverFile: 'zucchini-scarpaccia.jpg',
  },
  'korean-chili-oil-noodles': {
    id: '7248605680104393986', author: '@geniuseatss', coverFile: 'korean-chili-oil-noodles.jpg',
  },
  'toowoomba-ramen': {
    id: '7041381411991014702', author: '@annainseoul', coverFile: 'toowoomba-ramen.jpg',
  },
  'mortadella-pistachio-pesto-stracciatella-sandwich': {
    id: '7042782145865125167', author: '@owen.han', coverFile: 'mortadella-pistachio-pesto-stracciatella-sandwich.jpg',
  },
  'spicy-seafood-boil': {
    id: '7049402897741810991', author: '@derekkchen', coverFile: 'spicy-seafood-boil.jpg',
  },
  'simple-kimchi-fried-rice': {
    id: '7050246001357131055', author: '@basicsundaycooking', coverFile: 'simple-kimchi-fried-rice.jpg',
  },
  'chicken-biryani': {
    id: '7052407189037894958', author: '@manistyle25', coverFile: 'chicken-biryani.jpg',
  },
  'garlic-confit-toast': {
    id: '7055872347345030446', author: '@whisperofyum', coverFile: 'garlic-confit-toast.jpg',
  },
  'tomato-egg-stir-fry': {
    id: '7057970696454196526', author: '@derekkchen', coverFile: 'tomato-egg-stir-fry.jpg',
  },
  'gochujang-glazed-salmon': {
    id: '7058039976059227438', author: '@teekeatz', coverFile: 'gochujang-glazed-salmon.jpg',
  },
  'miso-black-cod': {
    id: '7063894296474307886', author: '@derekkchen', coverFile: 'miso-black-cod.jpg',
  },
  'french-onion-pasta': {
    id: '7065378576916483374', author: '@bettinamak', coverFile: 'french-onion-pasta.jpg',
  },
  'sourdough-english-muffins': {
    id: '7069194644504055086', author: '@brokenbreadblog', coverFile: 'sourdough-english-muffins.jpg',
  },
  'crispy-rice-paper-dumplings': {
    id: '7082493389069126958', author: '@jeccachantilly', coverFile: 'crispy-rice-paper-dumplings.jpg',
  },
  'fondant-potatoes': {
    id: '7083629094985927982', author: '@kellyscleankitchen', coverFile: 'fondant-potatoes.jpg',
  },
  'roasted-garlic-steak-sandwich': {
    id: '7111102045553265966', author: '@brittneeciara', coverFile: 'roasted-garlic-steak-sandwich.jpg',
  },
  'griddle-sourdough-english-muffins': {
    id: '7122151706984516906', author: '@savtwatson', coverFile: 'griddle-sourdough-english-muffins.jpg',
  },
  'instant-pot-dal-makhani': {
    id: '7127417635196718382', author: '@ministryofcurry', coverFile: 'instant-pot-dal-makhani.jpg',
  },
  'roasted-artichokes-garlic-butter': {
    id: '7128537447608175918', author: '@myhealthydish', coverFile: 'roasted-artichokes-garlic-butter.jpg',
  },
  'salmon-mushroom-rice': {
    id: '7135634809241554218', author: '@tiffoodss', coverFile: 'salmon-mushroom-rice.jpg',
  },
  'swedish-style-meatball-pasta': {
    id: '7136369304106192174', author: '@delishaas', coverFile: 'swedish-style-meatball-pasta.jpg',
  },
  'moroccan-spiced-kabocha-squash-soup': {
    id: '7148175134073916718', author: '@lahbco', coverFile: 'moroccan-spiced-kabocha-squash-soup.jpg',
  },
  'ghormeh-sabzi': {
    id: '7166273238123728170', author: '@cheffinwithzach', coverFile: 'ghormeh-sabzi.jpg',
  },
  'mayak-eggs-rice-bowl': {
    id: '7188309255580142894', author: '@nutritionbykylie', coverFile: 'mayak-eggs-rice-bowl.jpg',
  },
  'pasta-con-le-sarde': {
    id: '7212789659456245034', author: '@chefdaniellesepsy', coverFile: 'pasta-con-le-sarde.jpg',
  },
  'crispy-tofu-laab': {
    id: '7215297924442377514', author: '@papayapetite', coverFile: 'crispy-tofu-laab.jpg',
  },
  'khao-khua-toasted-rice-powder': {
    id: '7216825262007242027', author: '@papayapetite', coverFile: 'khao-khua-toasted-rice-powder.jpg',
  },
  'jujube-goji-chia-pudding': {
    id: '7219855648513821998', author: '@alicecsun', coverFile: 'jujube-goji-chia-pudding.jpg',
  },
  'buffet-style-fried-green-beans': {
    id: '7221291624058490158', author: '@positivethingshappening', coverFile: 'buffet-style-fried-green-beans.jpg',
  },
  'chipotle-chicken-street-tacos': {
    id: '7223842852244114730', author: '@surayaskitchen', coverFile: 'chipotle-chicken-street-tacos.jpg',
  },
  'shrimp-tofu-pad-thai': {
    id: '7230155476057607466', author: '@cassyeungmoney', coverFile: 'shrimp-tofu-pad-thai.jpg',
  },
  'gochujang-miso-udon-carbonara': {
    id: '7237581408158371114', author: '@foligion', coverFile: 'gochujang-miso-udon-carbonara.jpg',
  },
  'drunken-noodles-pad-kee-mao': {
    id: '7249186415228063022', author: '@cassyeungmoney', coverFile: 'drunken-noodles-pad-kee-mao.jpg',
  },
  'tom-kha-kai': {
    id: '7249884362638986538', author: '@cookthaiwithmom', coverFile: 'tom-kha-kai.jpg',
  },
  'crispy-chicken-thighs-fines-herbes': {
    id: '7277711148051352874', author: '@haileecatalano', coverFile: 'crispy-chicken-thighs-fines-herbes.jpg',
  },
  'radish-butter-sandwich': {
    id: '7216857246418947370', author: '@haileecatalano', coverFile: 'radish-butter-sandwich.jpg',
  },
  'flamin-hot-mac-and-cheese-bites': {
    id: '7303260732697759018', author: '@lifeandsprinkles', coverFile: 'flamin-hot-mac-and-cheese-bites.jpg',
  },
  'paneer-butter-masala': {
    id: '7313430669940624683', author: '@somethingfreshh', coverFile: 'paneer-butter-masala.jpg',
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
