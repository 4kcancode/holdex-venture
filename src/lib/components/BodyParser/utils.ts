const createYoutubeCover = (embedId: string | null) => {
  return `https://i.ytimg.com/vi/${embedId}/hqdefault.jpg`;
};
const createYoutubeEmbedUrl = (embedId: string | null) => {
  return `https://www.youtube-nocookie.com/embed/${embedId}`;
};

const createVimeoCover = (embedId: string | null) => {
  return `https://i.vimeocdn.com/video/${embedId}.jpg`;
};
const createVimeoEmbedUrl = (embedId: string | null) => {
  return `https://player.vimeo.com/video/${embedId}`;
};

export const getOptimizedUrl = (source: string, size = '_150x150') => {
  const holdexRegExp = new RegExp(/^(http:\/\/|https:\/\/)(storage\.googleapis\.com)/, 'gmi');
  if (holdexRegExp.test(source)) {
    // exclude gifs
    const gifRegExp = new RegExp(
      /(?: ([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:gif))(?:\?([^#]*))?(?:#(.*))?/,
      'gmi'
    );
    if (!gifRegExp.test(source)) {
      const [name, ...rest] = source.split(/\.(jpe?g|png|webp|bmp)/i);
      return `${name}${size}.${rest.join('')}`;
    }
  }
  return source;
};

export const regExp = {
  default: /^[a-zA-Z0-9 ,.'-]{2,50}$/,
  slug: /^[a-zA-Z0-9_-]{2,50}$/,
  tallyLink: /^https?:\/\/tally.so\/r\/([\w/-]+)$/,
  coingeckoLink: /^https?:\/\/www.coingecko.com\/en\/coins\/([\w/-]+)$/,
  customLink:
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)#embed=true$/,
  link: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  email: /^[a-z0-9._%+-]{1,60}@[a-z0-9.-]{1,30}\.[a-z]{2,10}$/,
  video:
    /(http:\/\/|https:\/\/)(player\.vimeo\.com|vimeo\.com|youtu\.be|www\.youtube\.com|youtube\.com)(?!(\/c+))([\w/-]+)([^\s]+)/,
  website: /^(https:\/\/)(www\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\.)+[\w]{2,}(\/\S*)?$/,
  twitter: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?$/,
  symbols: /^[a-zA-Z0-9 ,.";():&%£’€$#@_=/\-'!*?\\/s]{2,}$/,
  image: /.*\.(gif|jpe?g|bmp|png)$/,
  holdexLink: /^(http:\/\/|https:\/\/)(holdex\.io)/,
};

export const getEmbedSource = (href: string) => {
  const isYoutubeWithWatch = new RegExp(
    /^(http:\/\/|https:\/\/)(youtu\.be|www\.youtube\.com|youtube\.com)(\/watch)([^\s]+)/,
    'gmi'
  );
  const isYoutube = new RegExp(
    /^(http:\/\/|https:\/\/)(youtu\.be|www\.youtube\.com|youtube\.com)([\w/-]+)([^\s]+)/,
    'gmi'
  );
  const isVimeo = new RegExp(
    /^(http:\/\/|https:\/\/)(player\.vimeo\.com|vimeo\.com)([\w/-]+)([^\s]+)/,
    'gmi'
  );

  if (isYoutubeWithWatch.test(href)) {
    return 'youtube';
  }
  if (isYoutube.test(href)) {
    return 'youtube';
  }

  if (isVimeo.test(href)) {
    return 'vimeo';
  }

  return 'unknown';
};

const getEmbedId = (href: string) => {
  const isYoutubeWithWatch = new RegExp(
    /^(http:\/\/|https:\/\/)(youtu\.be|www\.youtube\.com|youtube\.com)(\/watch)([^\s]+)/,
    'gmi'
  );
  const isYoutube = new RegExp(
    /^(http:\/\/|https:\/\/)(youtu\.be|www\.youtube\.com|youtube\.com)([\w/-]+)([^\s]+)/,
    'gmi'
  );
  const isVimeo = new RegExp(
    /^(http:\/\/|https:\/\/)(player\.vimeo\.com|vimeo\.com)([\w/-]+)([^\s]+)/,
    'gmi'
  );
  const source = getEmbedSource(href);

  if (isYoutubeWithWatch.test(href)) {
    return [source, `${href.slice(href.indexOf('v') + 2, href.indexOf('v') + 13)}`];
  }

  if (isYoutube.test(href)) {
    const list = href.split('/');
    return [source, list[3]];
  }

  if (isVimeo.test(href)) {
    const list = href.split('/');
    return [source, list[4]];
  }
  return [source, null];
};

export const getEmbedUrl = (href: string) => {
  const [source, embedId] = getEmbedId(href);
  if (source === 'youtube') {
    return createYoutubeEmbedUrl(embedId);
  }
  if (source === 'vimeo') {
    return createVimeoEmbedUrl(embedId);
  }
};

export const getVideoCover = (href: string) => {
  const [source, embedId] = getEmbedId(href);
  if (source === 'youtube') {
    return createYoutubeCover(embedId);
  }
  if (source === 'vimeo') {
    return createVimeoCover(embedId);
  }
};

export const uuidv4 = () =>
  'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
