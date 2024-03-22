/**
 * 缓存 Image 标签
 */
const imageElementCache: { [key: string]: HTMLImageElement } = {};
const imageElementFactory = (url: string) => {
  if (!imageElementCache[url]) {
    imageElementCache[url] = document.createElement('img');
    imageElementCache[url].src = url;
  }

  return imageElementCache[url];
}

// 异步加载图片资源
const loadImageCache: { [key: string]: HTMLImageElement } = {};
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // 如果缓存中已经有了的话，可以直接使用缓存中的
    if (loadImageCache[url]) {
      resolve(loadImageCache[url]);
    } else {
      const image = new Image();
      image.src = url;

      image.onload = () => {
        loadImageCache[url] = image;
        resolve(image);
      }

      image.onerror = () => {
        reject('load image error');
      }
    }
  });
}

export default {
  imageElementFactory,
  loadImage,
}