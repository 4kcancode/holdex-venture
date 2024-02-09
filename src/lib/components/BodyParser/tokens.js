import { regExp, getEmbedUrl, getEmbedSource } from './utils';

export let rules = {
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<![`*]|\b_|$)|[^ ](?= {2,}\n)))/,
  priceTicker: /\$((?!USD\W)(?:\w+(?!\d+(B|M|K|\.\S|,))){3,6}|(?:HT))/,
  mention: /\B([@][\w]+)/,
  link: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  hashtag: /\B([#][\p{L}0-9]+)/,
  image: regExp.image,
  holdexLink: regExp.holdexLink,
  video: regExp.video,
};

const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

/** @param html {string} */
export const unescape = (html) =>
  html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });

/**
 * @param {Array<Record<string, any>>} tokens
 * @param {string[]} allowedTypes
 * @returns {Array<Record<string, any>>}
 */
export const getFirstParagraph = (tokens, allowedTypes) => {
  let src = [];
  for (let i = 0; i < tokens.length; i++) {
    if (allowedTypes.includes(tokens[i].type)) {
      src.push(tokens[i]);
      break;
    }
  }
  return src;
};

/**
 * @param {Array<Record<string, any>>} tokens
 * @param {string[]} allowedTypes
 * @returns {number}
 */
export const tokensLength = (tokens, allowedTypes) => {
  let length = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (allowedTypes.includes(tokens[i].type)) {
      length++;
    }
  }
  return length;
};

export const tokenizer = {
  /**
   * @param {string} string
   * @returns {Record<string, any> | undefined}
   */
  codespan: (string) => {
    let cap = rules.code.exec(string);
    if (cap) {
      let text = cap[2].replace(/\n/g, ' ');
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      let tokens = bindTokens(text, true);
      return {
        type: 'codespan',
        raw: cap[0],
        text: text,
        tokens: tokens,
      };
    }
  },
  /**
   * @param {string} string
   * @returns {Record<string, any> | boolean | undefined}
   */
  inlineText: (string) => {
    let cap = rules.text.exec(string);
    if (cap) {
      let tokens = bindTokens(cap[0], true);
      if (tokens) {
        return {
          type: 'text',
          raw: cap[0],
          text: cap[0].trim(),
          tokens: tokens,
        };
      }
      return false;
    }
  },
};

/**
 *
 * @param {string} text
 * @param {boolean | undefined} isRootText
 * @param {boolean | undefined} useLinkMatch
 * @returns
 */
export function bindTokens(text, isRootText = false, useLinkMatch = false) {
  let tokens = null;
  switch (true) {
    case tickers(text).match !== null: {
      let { match, exp } = tickers(text);
      tokens = tickersMatching(text.split(exp), match);
      break;
    }
    case mentions(text).match !== null: {
      let { match, exp } = mentions(text);
      tokens = mentionsMatching(text.split(exp), match);
      break;
    }
    case hashtags(text).match !== null: {
      let { match, exp } = hashtags(text);
      tokens = hashtagsMatching(text.split(exp), match);
      break;
    }
    case textLink(text).match !== null && useLinkMatch: {
      let { match, exp, videoExp, imageExp } = textLink(text);
      tokens = linkMatching(text.split(exp), videoExp, imageExp, match);
      break;
    }
    default:
      if (!isRootText) {
        tokens = textMatching(text);
      }
      break;
  }
  return tokens;
}

/**
 * @param {string} text
 * @returns
 */
export function tickers(text) {
  let exp = new RegExp(rules.priceTicker, 'gmi');
  let match = text.match(exp);
  let test = exp.test(text);

  return { match, exp, test };
}

/**
 *
 * @param {string[]} stringArray
 * @param {string[] | null} matches
 * @returns
 */
function tickersMatching(stringArray, matches) {
  /**
   * @type {Array<Record<string, any> | string | null>}
   */
  let list = [];
  stringArray.forEach((token) => {
    if (token !== undefined && token.length) {
      if (matches?.includes(`$${token}`)) {
        list.push({ type: 'price-ticker', raw: token, text: token });
      } else {
        list.push(...(bindTokens(token) || []));
      }
    }
  });
  return list;
}

/**
 * @param {string} text
 * @returns {Record<string, any>}
 */
export function textLink(text) {
  let exp = new RegExp(rules.link, 'gmi');
  let imageExp = new RegExp(rules.image, 'gmi');
  let videoExp = new RegExp(rules.video, 'gmi');
  let match = text.match(exp);
  let test = exp.test(text);

  return { match, exp, test, imageExp, videoExp };
}

/**
 * @param {string[]} stringArray
 * @param {RegExp} videoExp
 * @param {RegExp} imageExp
 * @param {string[]} matches
 * @returns
 */
function linkMatching(stringArray, videoExp, imageExp, matches) {
  /**
   * @type {Array<Record<string, any> | string | null>}
   */
  let list = [];
  stringArray.forEach((token) => {
    if (token !== undefined && token.length) {
      if (matches.includes(token)) {
        switch (true) {
          case imageExp.test(token):
            list.push({ type: 'image', src: token });
            break;
          case videoExp.test(token): {
            let match = token.match(videoExp);
            list.push({
              type: 'embed',
              embed: match && getEmbedUrl(match[0]),
              source: match && getEmbedSource(match[0]),
            });
            break;
          }
          default:
            list.push({ type: 'link', href: token });
            break;
        }
      } else {
        list.push(...(bindTokens(token) || []));
      }
    }
  });
  return list;
}

/**
 * @param {string} text
 * @returns
 */
export function mentions(text) {
  let exp = new RegExp(rules.mention, 'gm');
  let match = text.match(exp);

  return { match, exp };
}

/**
 *
 * @param {string[]} stringArray
 * @param {RegExpMatchArray | null} matches
 * @returns
 */
function mentionsMatching(stringArray, matches) {
  /**
   * @type {Array<Record<string, any> | string | null>}
   */
  let list = [];
  stringArray.forEach((token) => {
    if (token !== undefined && token.length) {
      if (matches?.includes(token)) {
        list.push({ type: 'mention', raw: token, text: token });
      } else {
        list.push(...(bindTokens(token) || []));
      }
    }
  });
  return list;
}

/**
 * @param {string} text
 * @returns
 */
export function hashtags(text) {
  let exp = new RegExp(rules.hashtag, 'gmu');
  let match = text.match(exp);

  return { match, exp };
}

/**
 *
 * @param {string[]} stringArray
 * @param {RegExpMatchArray | null} matches
 * @returns
 */
function hashtagsMatching(stringArray, matches) {
  /**
   * @type {Array<Record<string, any> | string | null>}
   */
  let list = [];
  stringArray.forEach((token) => {
    if (token !== undefined && token.length) {
      if (matches?.includes(token)) {
        list.push({ type: 'hashtag', raw: token, text: token });
      } else {
        list.push(...(bindTokens(token) || []));
      }
    }
  });
  return list;
}

/**
 * @param {string} token
 * @returns
 */
function textMatching(token) {
  return [{ type: 'text', raw: token, text: token }];
}

/**
 * @param {string} markdownString
 * @returns
 */
export const getMentionsList = (markdownString) => {
  if (!markdownString) return undefined;
  return mentions(markdownString).match;
};
