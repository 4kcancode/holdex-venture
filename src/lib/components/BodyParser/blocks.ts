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

let videoRegExp = new RegExp(regExp.video, 'gmi');
let imageRegExp = new RegExp(regExp.image, 'gmi');
let tallyLinkExp = new RegExp(regExp.tallyLink, 'mi');
let coingeckoLinkExp = new RegExp(regExp.coingeckoLink, 'mi');
export let linkExp = new RegExp(/^<a\s+(?:[^>]*?\s+)?href=(["'\\])(.*?)\1[^>]*>(.*?)<\/a>$/, 'ui');
let inlineLinkExp = new RegExp(regExp.link, 'ui');
let inlineCodeExp = new RegExp(
	/^<(?:code|span) class=[\\]?"inline-code[\\]?"[^>]*>(.*)<\/(?:code|span)>$/,
	'ui'
);
let hashtagExp = new RegExp(/^<span class=[\\]?"cdx-hashtag[\\]?"[^>]*>(.*?)<\/span>$/, 'ui');
let tickerExp = new RegExp(/^<span class=[\\]?"cdx-price-ticker[\\]?"[^>]*>\$(.*?)<\/span>$/, 'ui');
let mentionExp = new RegExp(/^<span class=[\\]?"cdx-mention[\\]?"[^>]*>(.*?)<\/span>$/, 'ui');
let boldExp = new RegExp(/^<b[^>]*>(.*?)<\/b>$/, 'ui');
let strongExp = new RegExp(/^<strong[^>]*>(.*?)<\/strong>$/, 'ui');
let italicExp = new RegExp(/^<i[^>]*>(.*?)<\/i>$/, 'ui');
let emExp = new RegExp(/^<em[^>]*>(.*?)<\/em>$/, 'ui');
let underlineExp = new RegExp(/^<u[^>]*>(.*?)<\/u>$/, 'ui');

let tokeniseInlineEls = (inlineBlocks: string[]) => {
	let tokens: any[] = [];

	inlineBlocks.forEach((b) => {
		if (linkExp.test(b)) {
			switch (true) {
				case videoRegExp.test(b): {
					let match = b.match(videoRegExp) as RegExpExecArray;
					tokens.push({
						type: 'embed',
						embed: getEmbedUrl(match[0]),
						source: getEmbedSource(match[0]),
					});
					break;
				}
				case imageRegExp.test(b): {
					let match = b.match(imageRegExp) as RegExpExecArray;
					tokens.push({
						type: 'image',
						src: match[0],
					});
					break;
				}
				case coingeckoLinkExp.test(b): {
					let match = b.match(coingeckoLinkExp) as RegExpExecArray;
					tokens.push({
						type: 'chart',
						url: match[0],
					});
					break;
				}
				default: {
					let match = b.match(linkExp) as RegExpExecArray;
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
					let match = b.match(videoRegExp) as RegExpExecArray;
					tokens.push({
						type: 'embed',
						embed: getEmbedUrl(match[0]),
						source: getEmbedSource(match[0]),
					});
					break;
				}
				case imageRegExp.test(b): {
					let match = b.match(imageRegExp) as RegExpExecArray;
					tokens.push({
						type: 'image',
						src: match[0],
					});
					break;
				}
				case coingeckoLinkExp.test(b): {
					let match = b.match(coingeckoLinkExp) as RegExpExecArray;
					tokens.push({
						type: 'chart',
						url: match[0],
					});
					break;
				}
				default: {
					let match = b.match(inlineLinkExp) as RegExpExecArray;
					tokens.push({
						type: 'link',
						text: '',
						href: match[0],
					});
					break;
				}
			}
		} else if (inlineCodeExp.test(b)) {
			let match = b.match(inlineCodeExp) as RegExpExecArray;
			tokens.push({
				type: 'code',
				text: match[1].replace(/ <br>/g, ''),
			});
		} else if (hashtagExp.test(b)) {
			let match = b.match(hashtagExp) as RegExpExecArray;
			tokens.push({
				type: 'hashtag',
				text: match[1],
			});
		} else if (tickerExp.test(b)) {
			let match = b.match(tickerExp) as RegExpExecArray;
			tokens.push({
				type: 'price-ticker',
				text: match[1],
			});
		} else if (mentionExp.test(b)) {
			let match = b.match(mentionExp) as RegExpExecArray;
			tokens.push({
				type: 'mention',
				text: match[1],
			});
		} else if (boldExp.test(b)) {
			let match = b.match(boldExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<b>${match[1]}</b>`,
			});
		} else if (strongExp.test(b)) {
			let match = b.match(strongExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<strong>${match[1]}</strong>`,
			});
		} else if (italicExp.test(b)) {
			let match = b.match(italicExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<i>${match[1]}</i>`,
			});
		} else if (emExp.test(b)) {
			let match = b.match(emExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<em>${match[1]}</em>`,
			});
		} else if (underlineExp.test(b)) {
			let match = b.match(underlineExp) as RegExpExecArray;
			tokens.push({
				type: 'inline',
				text: `<b>${match[1]}</b>`,
			});
		} else if (b !== undefined) {
			let textTokens = bindTokens(unescape(replaceSymbols(b)), false, true);
			if (textTokens) {
				tokens.push(...textTokens);
			} else {
				tokens.push({ type: 'text', text: replaceSymbols(b) });
			}
		}
	});
	return tokens;
};

let replaceSymbols = (text: string) => {
	return text.replace(/<br>/g, '').replace(/&nbsp;/g, ' ');
};

export let parseInlineEls = (text: string) => {
	let exp = new RegExp(
		/(?:(<(?:code|span) class="inline-code"[^>]*>.*?<\/(?:code|span)>)|(?:(<b[^>]*>.*?<\/b>))|(?:(<u[^>]*>.*?<\/u>))|(?:(<i[^>]*>.*?<\/i>))|(?:(<strong[^>]*>.*?<\/strong>))|(?:(<em[^>]*>.*?<\/em>))|(?:(<span class="cdx-hashtag"[^>]*>.*?<\/span>))|(?:(<span class="cdx-price-ticker"[^>]*>.*?<\/span>))|(?:(<span class="cdx-mention"[^>]*>.*?<\/span>))|(?:(<a[^>]*>.*?<\/a>)))/,
		'gmiu'
	);
	return text.split(exp);
};

let parseParagraph = (block: ParagraphBlock) => {
	if (block.data.text.length > 0) {
		let inlineBlocks = parseInlineEls(block.data.text);
		let tokens = tokeniseInlineEls(inlineBlocks);

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

let parseHeading = (block: HeadingBlock) => {
	let inlineBlocks = parseInlineEls(block.data.text);
	let tokens = tokeniseInlineEls(inlineBlocks);

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

let parseList = (block: ListBlock) => {
	let tokens: any[] = [];
	block.data.items.forEach((item) => {
		let inlineBlocks = parseInlineEls(item);
		let inlineTokens = tokeniseInlineEls(inlineBlocks);
		return tokens.push(inlineTokens);
	});
	return {
		type: 'list',
		style: block.data.style,
		items: tokens,
	};
};

let parseNestedList = (block: NestedListBlock) => {
	let items = parseNestedListItem(block.data.items);

	return {
		type: 'nestedList',
		style: block.data.style,
		items,
	};
};

function parseNestedListItem(items: ListItem[]) {
	let list: any[] = [];
	for (const item of items) {
		if (item.items.length > 0) {
			let children = parseNestedListItem(item.items);
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

let parseListItem = (item: string) => {
	let inlineBlocks = parseInlineEls(item);
	let inlineTokens = tokeniseInlineEls(inlineBlocks);
	return inlineTokens;
};

let parseQuote = (block: BlockquoteBlock) => {
	let inlineBlocks = parseInlineEls(block.data.text);
	let tokens = tokeniseInlineEls(inlineBlocks);

	return {
		type: 'quote',
		text: block.data?.caption,
		items: tokens,
	};
};

let parseImage = (block: ImageBlock) => {
	return {
		type: 'image',
		src: getOptimizedUrl(block.data.file.url, '_750x750'),
		title: block.data?.caption,
		alt: block.data?.caption,
		loading: 'lazy',
	};
};

let parseTable = (block: TableBlock) => {
	return {
		type: 'table',
		cells: block.data.content,
	};
};

export let parseTableCell = (cell: string) => {
	const strippedCell = unescape(cell);
	let inlineBlocks = parseInlineEls(strippedCell);
	let tokens = tokeniseInlineEls(inlineBlocks);

	return tokens;
};

let parseEmbed = (block: EmbedBlock) => {
	return {
		type: 'embed',
		service: block.data.service,
		source: block.data?.source,
		embed: block.data?.embed,
		caption: block.data?.caption,
	};
};

let parseCode = (block: CodeBlock) => {
	return {
		type: 'code',
		data: {
			code: escape(block.data.code),
		},
	};
};

let parseLinkTool = (block: LinkToolBlock) => {
	if (tallyLinkExp.test(block.data.url)) {
		let match = block.data.url.match(tallyLinkExp) as RegExpMatchArray;
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

let parseAuthor = (block: AuthorBlock) => {
	return {
		type: 'author',
		data: block.items,
	};
};

let htmlParser = HTMLParser({
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
