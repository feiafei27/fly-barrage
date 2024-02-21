/**
 * 缓存 Image 标签
 */
const imageElementCache: {[key: string]: HTMLImageElement} = {};
function imageElementFactory(url: string) {
  if (!imageElementCache[url]) {
    imageElementCache[url] = document.createElement('img');
    imageElementCache[url].src = url;
  }

  return imageElementCache[url];
}

export default {
  imageElementFactory,
}