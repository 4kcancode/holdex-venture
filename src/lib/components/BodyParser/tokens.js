import { regExp, getEmbedUrl, getEmbedSource } from './utils'

export let rules = {
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n)))/,
    priceTicker: /\$((?!USD\W)(?:\w+(?!\d+(B|M|K|\.\S|,))){3,6}|(?:HT))/,
    mention: /\B([@][\w]+)/,
    link: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
    hashtag: /\B([#][\p{L}0-9]+)/,
    image: regExp.image,
    holdexLink: regExp.holdexLink,
    video: regExp.video
}

const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

export function unescape(html) {
    return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
            return n.charAt(1) === 'x'
                ? String.fromCharCode(parseInt(n.substring(2), 16))
                : String.fromCharCode(+n.substring(1));
        }
        return '';
    });
}

export const getFirstParagraph = (tokens, allowedTypes) => {
    let src = [];
    for (let i = 0; i < tokens.length; i++) {
        if (allowedTypes.includes(tokens[i].type)) {
            src.push(tokens[i]);
            break;
        }
    }
    return src;
}

export const tokensLength = (tokens, allowedTypes) => {
    let length = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (allowedTypes.includes(tokens[i].type)) {
            length++;
        }
    }
    return length;
}

export const tokenizer = {
    codespan(string) {
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
                type: "codespan",
                raw: cap[0],
                text: text,
                tokens: tokens
            }
        }
    },
    inlineText(string) {
        let cap = rules.text.exec(string);
        if (cap) {
            let tokens = bindTokens(cap[0], true);
            if (tokens) {
                return {
                    type: "text",
                    raw: cap[0],
                    text: cap[0].trim(),
                    tokens: tokens
                }
            }
            return false;
        }
    }
}

export let bindTokens = (text, isRootText, useLinkMatch) => {
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

export let tickers = (text) => {
    let exp = new RegExp(rules.priceTicker, "gmi");
    let match = text.match(exp);
    let test = exp.test(text);

    return { match, exp, test };
}

let tickersMatching = (stringArray, matches) => {
    let list = [];
    stringArray.forEach(function (token) {
        if (token !== undefined && token.length) {
            if (matches.includes(`$${token}`)) {
                list.push({ type: 'price-ticker', raw: token, text: token });
            } else {
                list.push(...bindTokens(token));
            }
        }
    });
    return list;
}

export let textLink = (text) => {
    let exp = new RegExp(rules.link, "gmi");
    let imageExp = new RegExp(rules.image, "gmi");
    let videoExp = new RegExp(rules.video, "gmi");
    let match = text.match(exp);
    let test = exp.test(text);

    return { match, exp, test, imageExp, videoExp };
}

let linkMatching = (stringArray, videoExp, imageExp, matches) => {
    let list = [];
    stringArray.forEach(function (token) {
        if (token !== undefined && token.length) {
            if (matches.includes(token)) {
                switch (true) {
                    case imageExp.test(token):
                        list.push({ type: 'image', src: token })
                        break;
                    case videoExp.test(token): {
                        let match = token.match(videoExp);
                        list.push({
                            type: "embed",
                            embed: getEmbedUrl(match[0]),
                            source: getEmbedSource(match[0]),
                        })
                        break;
                    }
                    default:
                        list.push({ type: 'link', href: token });
                        break;
                }
            } else {
                list.push(...bindTokens(token));
            }
        }
    });
    return list;
}

export let mentions = (text) => {
    let exp = new RegExp(rules.mention, "gm");
    let match = text.match(exp);

    return { match, exp };
}

let mentionsMatching = (stringArray, matches) => {
    let list = [];
    stringArray.forEach(function (token) {
        if (token !== undefined && token.length) {
            if (matches.includes(token)) {
                list.push({ type: 'mention', raw: token, text: token });
            } else {
                list.push(...bindTokens(token));
            }
        }
    });
    return list;
}

export let hashtags = (text) => {
    let exp = new RegExp(rules.hashtag, "gmu");
    let match = text.match(exp);

    return { match, exp };
}

let hashtagsMatching = (stringArray, matches) => {
    let list = [];
    stringArray.forEach(function (token) {
        if (token !== undefined && token.length) {
            if (matches.includes(token)) {
                list.push({ type: 'hashtag', raw: token, text: token });
            } else {
                list.push(...bindTokens(token));
            }
        }
    });
    return list;
}

let textMatching = (token) => {
    return [{ type: "text", raw: token, text: token }];
}

export function getMentionsList(markdownString) {
    if (!markdownString) return undefined;
    return mentions(markdownString).match;
}