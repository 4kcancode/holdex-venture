// @ts-ignore
import HTMLParser from 'editorjs-html';
import { bindTokens } from './tokens';
import { escape, unescape } from './escaper';
import { getEmbedUrl, getEmbedSource, regExp, getOptimizedUrl, uuidv4 } from './utils';

type HeadingBlock = {
	type: string;
	id: string;
	data: {
		text: string;
		level: number;
	};
};

type BlockquoteBlock = {
	type: string;
	data: {
		text: string;
		caption?: string;
		alignment: 'left' | 'right';
	};
};

type ImageBlock = {
	type: string;
	data: {
		file: {
			url: string;
		};
		caption?: string;
		withBorder: boolean;
		withBackground: boolean;
		stretched: boolean;
	};
};

type ListBlock = {
	type: 'list';
	data: {
		style: string;
		items: string[];
	};
};

type NestedListBlock = {
	type: 'nestedList';
	data: {
		style: string;
		items: ListItem[];
	};
};

type ListItem = {
	content: string;
	items: ListItem[];
};

type ParagraphBlock = {
	type: string;
	data: {
		text: string;
	};
};

type TableBlock = {
	type: string;
	data: {
		content: Array<Array<string>>;
	};
};

type EmbedBlock = {
	type: string;
	data: {
		service: string;
		source: string;
		embed: string;
		width: number;
		height: number;
		caption: string;
	};
};

type CodeBlock = {
	type: string;
	data: {
		code: string;
	};
};

type LinkToolBlock = {
	type: string;
	data: {
		url: string;
		title?: string;
		embed: string;
	};
};

type AuthorBlock = {
	type: string;
	items: Author[];
};

export type Author = {
	name: string;
	url: string;
};

const videoRegExp = new RegExp(regExp.video, 'gmi');
const imageRegExp = new RegExp(regExp.image, 'gmi');
const tallyLinkExp = new RegExp(regExp.tallyLink, 'mi');
const coingeckoLinkExp = new RegExp(regExp.coingeckoLink, 'mi');
export const linkExp = new RegExp(/^<a\s+(?:[^>]*?\s+)?href=(["'\\])(.*?)\1[^>]*>(.*?)<\/a>$/, 'ui');
const inlineLinkExp = new RegExp(regExp.link, 'ui');
const inlineCodeExp = new RegExp(
	/^<(?:code|span) class=[\\]?"inline-code[\\]?"[^>]*>(.*)<\/(?:code|span)>$/,
	'ui'
);
const hashtagExp = new RegExp(/^<span class=[\\]?"cdx-hashtag[\\]?"[^>]*>(.*?)<\/span>$/, 'ui');
const tickerExp = new RegExp(/^<span class=[\\]?"cdx-price-ticker[\\]?"[^>]*>\$(.*?)<\/span>$/, 'ui');
const mentionExp = new RegExp(/^<span class=[\\]?"cdx-mention[\\]?"[^>]*>(.*?)<\/span>$/, 'ui');
const boldExp = new RegExp(/^<b[^>]*>(.*?)<\/b>$/, 'ui');
const strongExp = new RegExp(/^<strong[^>]*>(.*?)<\/strong>$/, 'ui');
const italicExp = new RegExp(/^<i[^>]*>(.*?)<\/i>$/, 'ui');
const emExp = new RegExp(/^<em[^>]*>(.*?)<\/em>$/, 'ui');
const underlineExp = new RegExp(/^<u[^>]*>(.*?)<\/u>$/, 'ui');

const tokeniseInlineEls = (inlineBlocks: string[]) => {
	const tokens: any[] = [];

	inlineBlocks.forEach((b) => {
		if (linkExp.test(b)) {
			switch (true) {
				case videoRegExp.test(b): {
					const match = b.match(videoRegExp) as RegExpExecArray;
					tokens.push({
						type: 'embed',
						embed: getEmbedUrl(match[0]),
						source: getEmbedSource(match[0]),
					});
					break;
				}
				case imageRegExp.test(b): {
					const match = b.match(imageRegExp) as RegExpExecArray;
					tokens.push({
						type: 'image',
						src: match[0],
					});
					break;
				}
				case coingeckoLinkExp.test(b): {
					const match = b.match(coingeckoLinkExp) as RegExpExecArray;
					tokens.push({
						type: 'chart',
						url: match[0],
					});
					break;
				}
				default: {
					const match = b.match(linkExp) as RegExpExecArray;
					tokens.push({
						type: 'link',
						text: match[3],
						href: match[2],
					});
					break;
				}
			}
		} else if (inlineLinkExp.test(b)) {
			switch (true) {
				case videoRegExp.test(b): {
					const match = b.match(videoRegExp) as RegExpExecArray;
					tokens.push({
						type: 'embed',
						embed: getEmbedUrl(match[0]),
						source: getEmbedSource(match[0]),
					});
					break;
				}
				case imageRegExp.test(b): {
					const match = b.match(imageRegExp) as RegExpExecArray;
					tokens.push({
						type: 'image',
						src: match[0],
					});
					break;
				}
				case coingeckoLinkExp.test(b): {
					const match = b.match(coingeckoLinkExp) as RegExpExecArray;
					tokens.push({
						type: 'chart',
						url: match[0],
					});
					break;
				}
				default: {
					const match = b.match(inlineLinkExp) as RegExpExecArray;
					tokens.push({
						type: 'link',
						text: '',
						href: match[0],
					});
					break;
				}
			}
		} else if (inlineCodeExp.test(b)) {
			const match = b.match(inlineCodeExp) as RegExpExecArray;
			tokens.push({
				type: 'code',
				text: match[1].replace(/ <br>/g, ''),
			});
		} else if (hashtagExp.test(b)) {
			const match = b.match(hashtagExp) as RegExpExecArray;
			tokens.push({
				type: 'hashtag',
				text: match[1],
			});
		} else if (tickerExp.test(b)) {
			const match = b.match(tickerExp) as RegExpExecArray;
			tokens.push({
				type: 'price-ticker',
				text: match[1],
			});
		} else if (mentionExp.test(b)) {
			const match = b.match(mentionExp) as RegExpExecArray;
			tokens.push({
				type: 'mention',
				text: match[1],
			});
		} else if (boldExp.test(b)) {
			const match = b.match(boldExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<b>${match[1]}</b>`,
			});
		} else if (strongExp.test(b)) {
			const match = b.match(strongExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<strong>${match[1]}</strong>`,
			});
		} else if (italicExp.test(b)) {
			const match = b.match(italicExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<i>${match[1]}</i>`,
			});
		} else if (emExp.test(b)) {
			const match = b.match(emExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<em>${match[1]}</em>`,
			});
		} else if (underlineExp.test(b)) {
			const match = b.match(underlineExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<b>${match[1]}</b>`,
			});
		} else if (b !== undefined) {
			const textTokens = bindTokens(unescape(replaceSymbols(b)), false, true);
			if (textTokens) {
				tokens.push(...textTokens);
			} else {
				tokens.push({ type: 'text', text: replaceSymbols(b) });
			}
		}
	});
	return tokens;
};

const replaceSymbols = (text: string) => {
	return text.replace(/<br>/g, '').replace(/&nbsp;/g, ' ');
};

export const parseInlineEls = (text: string) => {
	const exp = new RegExp(
		/(?:(<(?:code|span) class="inline-code"[^>]*>.*?<\/(?:code|span)>)|(?:(<b[^>]*>.*?<\/b>))|(?:(<u[^>]*>.*?<\/u>))|(?:(<i[^>]*>.*?<\/i>))|(?:(<strong[^>]*>.*?<\/strong>))|(?:(<em[^>]*>.*?<\/em>))|(?:(<span class="cdx-hashtag"[^>]*>.*?<\/span>))|(?:(<span class="cdx-price-ticker"[^>]*>.*?<\/span>))|(?:(<span class="cdx-mention"[^>]*>.*?<\/span>))|(?:(<a[^>]*>.*?<\/a>)))/,
		'gmiu'
	);
	return text.split(exp);
};

const parseParagraph = (block: ParagraphBlock) => {
	if (block.data.text.length > 0) {
		const inlineBlocks = parseInlineEls(block.data.text);
		const tokens = tokeniseInlineEls(inlineBlocks);

		if (tokens.length == 1 && ['image', 'embed', 'chart'].includes(tokens[0].type)) {
			return tokens[0];
		} else {
			return {
				type: 'paragraph',
				items: tokens,
			};
		}
	}
	return {
		type: 'space',
	};
};

const parseHeading = (block: HeadingBlock) => {
	const inlineBlocks = parseInlineEls(block.data.text);
	const tokens = tokeniseInlineEls(inlineBlocks);

	let cleanRef: string;
	if (linkExp.test(block.data.text)) {
		cleanRef = (block.data.text.match(linkExp) as RegExpExecArray)[3];
	} else {
		cleanRef = block.data.text;
	}

	return {
		type: 'heading',
		level: `h${block.data.level}`,
		id: block?.id || uuidv4(),
		raw: block.data.text,
		cleanRef,
		items: tokens,
	};
};

const parseList = (block: ListBlock) => {
	const tokens: any[] = [];
	block.data.items.forEach((item) => {
		const inlineBlocks = parseInlineEls(item);
		const inlineTokens = tokeniseInlineEls(inlineBlocks);
		return tokens.push(inlineTokens);
	});
	return {
		type: 'list',
		style: block.data.style,
		items: tokens,
	};
};

const parseNestedList = (block: NestedListBlock) => {
	const items = parseNestedListItem(block.data.items);

	return {
		type: 'nestedList',
		style: block.data.style,
		items,
	};
};

function parseNestedListItem(items: ListItem[]) {
	const list: any[] = [];
	for (const item of items) {
		if (item.items.length > 0) {
			const children = parseNestedListItem(item.items);
			list.push({
				content: parseListItem(item.content),
				items: children,
			});
		} else {
			list.push({
				content: parseListItem(item.content),
				items: [],
			});
		}
	}
	return list;
}

const parseListItem = (item: string) => {
	const inlineBlocks = parseInlineEls(item);
	const inlineTokens = tokeniseInlineEls(inlineBlocks);
	return inlineTokens;
};

const parseQuote = (block: BlockquoteBlock) => {
	const inlineBlocks = parseInlineEls(block.data.text);
	const tokens = tokeniseInlineEls(inlineBlocks);

	return {
		type: 'quote',
		text: block.data?.caption,
		items: tokens,
	};
};

const parseImage = (block: ImageBlock) => {
	return {
		type: 'image',
		src: getOptimizedUrl(block.data.file.url, '_750x750'),
		title: block.data?.caption,
		alt: block.data?.caption,
		loading: 'lazy',
	};
};

const parseTable = (block: TableBlock) => {
	return {
		type: 'table',
		cells: block.data.content,
	};
};

export const parseTableCell = (cell: string) => {
	const strippedCell = unescape(cell);
	const inlineBlocks = parseInlineEls(strippedCell);
	const tokens = tokeniseInlineEls(inlineBlocks);

	return tokens;
};

const parseEmbed = (block: EmbedBlock) => {
	return {
		type: 'embed',
		service: block.data.service,
		source: block.data?.source,
		embed: block.data?.embed,
		caption: block.data?.caption,
	};
};

const parseCode = (block: CodeBlock) => {
	return {
		type: 'code',
		data: {
			code: escape(block.data.code),
		},
	};
};

const parseLinkTool = (block: LinkToolBlock) => {
	if (tallyLinkExp.test(block.data.url)) {
		const match = block.data.url.match(tallyLinkExp) as RegExpMatchArray;
		return {
			type: 'tally',
			url: block.data.url,
			title: block.data.title,
			id: match[1],
		};
	} else {
		return {
			type: 'linkTool',
			data: block.data,
		};
	}
};

const parseAuthor = (block: AuthorBlock) => {
	return {
		type: 'author',
		data: block.items,
	};
};

const htmlParser = HTMLParser({
	header: parseHeading,
	quote: parseQuote,
	image: parseImage,
	list: parseList,
	nestedList: parseNestedList,
	paragraph: parseParagraph,
	table: parseTable,
	embed: parseEmbed,
	twitter: parseEmbed,
	code: parseCode,
	linkTool: parseLinkTool,
	subtitle: (b: any) => b,
	source: (b: any) => b,
	author: parseAuthor,
});

function parseBlocks(blocks: any[]) {
	return htmlParser.parse({ blocks });
}

export default parseBlocks;
