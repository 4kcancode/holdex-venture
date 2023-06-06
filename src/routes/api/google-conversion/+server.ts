import { default as _last } from 'lodash-es/last';
import { default as _get } from 'lodash-es/get';
import { default as _repeat } from 'lodash-es/repeat';
import { json } from '@sveltejs/kit';
import { getEmbedUrl, getEmbedSource, regExp } from '$components/BodyParser/utils';

import type {
	Schema$Document,
	Schema$List,
	Schema$Paragraph,
	Schema$ParagraphElement,
	Schema$RichLinkProperties,
	Schema$StructuralElement,
	Schema$TableCell,
	Schema$TextRun,
	Schema$TextStyle,
} from '$lib/types/googleDoc';
import type { RequestHandler } from './$types';
import type { Author } from '$components/BodyParser/blocks';

export const POST: RequestHandler = async ({ request }) => {
	const { data, updatedAt } = await request.json();
	const jsonData = convertToHoldexJson(data);
	return json(
		{
			blocks: jsonData,
			time: updatedAt,
			version: '2.20.0',
		},
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
};

function convertToHoldexJson(document: Schema$Document) {
	const { body, headers, lists } = document;

	let content: any[] = [];
	let authorBlock = {
		type: 'author',
		items: [] as Author[],
	};

	if (headers) {
		Object.values(headers).forEach(({ content }) => {
			(content as Schema$StructuralElement[]).forEach(({ paragraph }, i) => {
				if (
					paragraph &&
					Array.isArray(paragraph.elements) &&
					(paragraph.elements as Schema$ParagraphElement[])[0].textRun?.content?.includes(
						'Authors:'
					)
				) {
					paragraph.elements.forEach((element) => {
						const author = getHeaderRowAuthor(element);
						if (author.name) {
							authorBlock.items.push(author);
						}
					});
				}
			});
		});
		content.push(authorBlock);
	}

	if (body && body.content) {
		body.content.forEach(({ paragraph, table }, i) => {
			// Paragraphs
			if (paragraph) {
				const tag = getParagraphTag(paragraph);

				// Lists
				if (paragraph.bullet) {
					const { nestingLevel, listId } = paragraph.bullet;
					const list = (lists as Record<string, Schema$List>)[listId as string];
					const listTag = getListTag(list, nestingLevel);

					const bulletContent = paragraph.elements
						?.map((el) => getBulletContent(document, el))
						.join(' ')
						.replace(' .', '.')
						.replace(' ,', ',');

					const prev = (body.content as Schema$StructuralElement[])[i - 1];
					const prevListId = prev.paragraph?.bullet?.listId;
					const listStyle = listTag === 'ol' ? 'ordered' : 'unordered';

					if (prevListId === listId) {
						let list = _last(content).data.items;

						if (nestingLevel !== undefined) {
							const lastIndex = list.length - 1;
							list[lastIndex].items.push({ content: bulletContent, items: [] });
						} else {
							list.push({ content: bulletContent, items: [] });
						}
					} else {
						content.push({
							type: 'nestedList',
							data: {
								style: listStyle,
								items: [
									{
										content: bulletContent,
										items: [],
									},
								],
								id: listId,
							},
						});
					}
				}

				// Headings, Images, Texts
				else if (tag) {
					let tagContent: any[] = [];

					if (paragraph?.elements?.length === 2 && isLink(paragraph.elements)) {
						let { textStyle, content } = paragraph.elements[0].textRun as Schema$TextRun;

						if (textStyle?.link?.url) {
							const link = textStyle?.link?.url as string;
							switch (true) {
								case twitterRegExp.test(link): {
									let match =
										/^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?$/
											.exec(link)
											?.slice(2);
									tagContent.push({
										type: 'embed',
										data: {
											service: 'twitter',
											source: link,
											embed: `api/tweets.json?id=${match?.shift()}`,
										},
									});
									break;
								}
								case videoRegExp.test(link): {
									let match = link.match(videoRegExp) as RegExpMatchArray;
									tagContent.push({
										type: 'embed',
										data: {
											service: getEmbedSource(match[0]),
											source: match[0],
											embed: getEmbedUrl(match[0]),
										},
									});
									break;
								}
								case tallyRegExp.test(link): {
									let match = link.match(tallyRegExp) as RegExpMatchArray;
									tagContent.push({
										type: 'embed',
										data: {
											service: 'tally',
											source: match[0],
											embed: match[0],
										},
									});
									break;
								}
								default: {
									tagContent.push({
										type: 'linkTool',
										data: {
											url: link,
											title: content,
											embed: `api/link.json?url=${link}`,
										},
									});
									break;
								}
							}
						}
					} else {
						paragraph?.elements?.forEach((el) => {
							// EmbeddedObject

							if (el.inlineObjectElement) {
								const image = getImage(document, el);

								if (image) {
									tagContent.push({
										type: 'image',
										data: {
											file: {
												url: image.source,
											},
											caption: image.alt,
										},
									});
								}
							} else if (
								el.richLink &&
								el.richLink?.richLinkProperties &&
								videoRegExp.test(el.richLink.richLinkProperties?.uri as string)
							) {
								// support for each link
								tagContent.push(getRichLink(el));
							}

							// quote
							else if (isQuote(el)) {
								tagContent.push({
									type: 'quote',
									data: {
										text: getText(el, {
											isHeader: tag !== 'p',
										}).slice(2),
										caption: '',
										alignment: 'left',
									},
								});
							}

							// Headings, Texts
							else if (
								el.textRun &&
								el.textRun.content !== '\n' &&
								(el.textRun.content as string).trim().length > 0
							) {
								tagContent.push({
									[tag]: getText(el, {
										isHeader: tag !== 'p',
									}),
								});
							}
						});
					}

					if (tagContent.every((el) => el[tag] !== undefined)) {
						if (tag !== 'p' && tag !== 'blockquote') {
							content.push({
								type: 'header',
								id: paragraph?.paragraphStyle?.headingId?.replace(/h./, ''),
								data: {
									level: Number(tag.replace('h', '')),
									text: tagContent
										.map((el) => el[tag])
										.join(' ')
										.replace(' .', '.')
										.replace(' ,', ','),
								},
							});
						} else if (tag == 'p') {
							let paragraphContent = tagContent
								.map((el) => el[tag])
								.join(' ')
								.replace(' .', '.')
								.replace(' ,', ',');

							if (quoteExp.test(paragraphContent)) {
								content.push({
									type: 'quote',
									data: {
										text: paragraphContent.slice(2),
										caption: '',
										alignment: 'left',
									},
								});
							} else {
								content.push({
									type: 'paragraph',
									data: {
										text: paragraphContent,
									},
								});
							}
						} else {
							content.push({
								type: 'quote',
								data: {
									text: tagContent
										.map((el) => el[tag])
										.filter((el) => el.length > 0)
										.join(' ')
										.replace(' .', '.')
										.replace(' ,', ','),
									caption: '',
									alignment: 'left',
								},
							});
						}
					} else {
						content.push(...tagContent);
					}
				}
			}

			// Table
			else if (table && table.tableRows && table.tableRows.length > 0) {
				const [thead, ...tbody] = table.tableRows;
				content.push({
					type: 'table',
					data: {
						content: [
							(thead.tableCells as Schema$TableCell[]).map(({ content }) =>
								getTableCellContent(content as Schema$StructuralElement[])
							),
							...tbody.map((row) =>
								(row.tableCells as Schema$TableCell[]).map(({ content }) =>
									getTableCellContent(content as Schema$StructuralElement[])
								)
							),
						],
					},
				});
			}
		});
	}
	return content;
}

function getHeaderRowAuthor(content: Schema$ParagraphElement) {
	let author: Author = {} as Author;
	if (content && content.textRun?.textStyle?.link) {
		const textRun = content.textRun as Schema$TextRun;
		author.name = cleanText(textRun.content as string);
		author.url = textRun.textStyle?.link?.url || '';
	}
	return author;
}

function getParagraphTag(p: Schema$Paragraph) {
	const tags: Record<string, string> = {
		NORMAL_TEXT: 'p',
		SUBTITLE: 'blockquote',
		HEADING_1: 'h1',
		HEADING_2: 'h2',
		HEADING_3: 'h3',
		HEADING_4: 'h4',
		HEADING_5: 'h5',
	};

	return tags[p?.paragraphStyle?.namedStyleType as string];
}

function getListTag(list: Schema$List, nestingLevel: number | null | undefined) {
	const glyphType = _get(list, [
		'listProperties',
		'nestingLevels',
		nestingLevel ? nestingLevel : 0,
		'glyphType',
	]);

	if (glyphType === 'GLYPH_TYPE_UNSPECIFIED') {
		return 'ul';
	}
	return glyphType !== undefined ? 'ol' : 'ul';
}

let twitterRegExp = new RegExp(regExp.twitter, 'mi');
let videoRegExp = new RegExp(regExp.video, 'mi');
let tallyRegExp = new RegExp(/^https?:\/\/apply.holdex.io\/([^\/\?\&]*)?$/, 'mi');

function isLink(elements: Schema$ParagraphElement[]) {
	let [el1, el2] = elements;

	let s2 = cleanText(el2?.textRun?.content as string) === '';
	let s1 = el1.textRun && el1.textRun.textStyle && el1.textRun.textStyle.link !== undefined;

	return s1 && s2;
}

function getRichLink(el: Schema$ParagraphElement) {
	let richLinkProperties = el.richLink?.richLinkProperties as Schema$RichLinkProperties;

	let match = richLinkProperties?.uri?.match(videoRegExp) as RegExpMatchArray;
	return {
		type: 'embed',
		data: {
			service: getEmbedSource(match[0]),
			source: match[0],
			embed: getEmbedUrl(match[0]),
			caption: richLinkProperties.title || '',
		},
	};
}
let quoteExp = new RegExp(/^\> (.*$)/, 'im');
function isQuote(el: Schema$ParagraphElement) {
	let { textRun } = el;
	if (textRun && textRun.content) {
		let txt = cleanText(textRun.content);
		return quoteExp.test(txt);
	} else {
		return false;
	}
}

function cleanText(text: string) {
	return text.replace(/\n/g, '').trim();
}

function getTableCellContent(content: Schema$StructuralElement[]) {
	if (!content || content.length === 0) return '';
	return content
		.map(({ paragraph }) => cleanText(getTextFromParagraph(paragraph as Schema$Paragraph)))
		.join('');
}

function getTextFromParagraph(p: Schema$Paragraph) {
	return p.elements
		? p.elements
				.filter((el) => el.textRun && el.textRun.content !== '\n')
				.map((el) => (el.textRun ? getText(el) : ''))
				.join('')
		: '';
}

function getBulletContent(document: Schema$Document, element: Schema$ParagraphElement) {
	if (element.inlineObjectElement) {
		const image = getImage(document, element);
		if (image) {
			return `<img src="${image.source}" alt="${image.alt}" title="${image.title}" />`;
		}
	}

	return getText(element);
}

function getImage(document: Schema$Document, element: Schema$ParagraphElement) {
	const { inlineObjects } = document;

	if (!inlineObjects || !element.inlineObjectElement) {
		return null;
	}

	const inlineObject = inlineObjects[element.inlineObjectElement?.inlineObjectId as string];
	const embeddedObject = inlineObject?.inlineObjectProperties?.embeddedObject;

	if (embeddedObject && embeddedObject.imageProperties) {
		return {
			source: embeddedObject.imageProperties.sourceUri || embeddedObject.imageProperties.contentUri,
			title: embeddedObject.title || '',
			alt: embeddedObject.description || '',
		};
	}

	return null;
}

function getText(element: Schema$ParagraphElement, { isHeader = false } = {}) {
	let text = cleanText(element.textRun?.content as string);
	const { link, underline, strikethrough, bold, italic } = element?.textRun
		?.textStyle as Schema$TextStyle;

	if (underline && !link) {
		// Underline isn't supported in markdown so we'll use emphasis
		text = `<u>${text}</u>`;
	}

	if (italic) {
		text = `<i>${text}</i>`;
	}

	// Set bold unless it's a header
	if (bold && !isHeader) {
		text = `<b>${text}</b>`;
	}

	if (strikethrough) {
		text = `<s>${text}</s>`;
	}

	if (link) {
		return `<a href="${link.url}">${text}</a>`;
	}

	return text;
}
