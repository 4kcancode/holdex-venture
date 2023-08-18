import type { Author } from '$components/BodyParser/blocks';
import type {
  Schema$Document,
  Schema$Header,
  Schema$List,
  Schema$Paragraph,
  Schema$ParagraphElement,
  Schema$ParagraphStyle,
  Schema$RichLinkProperties,
  Schema$StructuralElement,
  Schema$Table,
  Schema$TableOfContents,
  Schema$TextRun,
  Schema$TextStyle,
} from '$lib/types/googleDoc';
import { json } from '@sveltejs/kit';

import { getEmbedUrl, getEmbedSource, regExp } from '$components/BodyParser/utils';
import type { RequestHandler } from './$types';

import _ from 'lodash-es';

// Define the types
interface NestedListItem {
  content: string;
  items: NestedListItem[];
}

interface NestedListData {
  style: string;
  items: NestedListItem[];
  id: string;
}

interface NestedList {
  type: string;
  data: NestedListData;
}

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

function parseHeader(headers: Schema$Header) {
  const headerValue = Object.values(headers);

  if (headerValue.length === 0) {
    return {
      type: 'author',
      items: [],
    };
  }

  const items = headerValue.map(({ content }) =>
    content.map((element: Schema$StructuralElement) => {
      const { paragraph } = element;
      if (!paragraph || !Array.isArray(paragraph.elements)) return false;

      const { elements } = paragraph;
      if (!elements || !elements[0].textRun?.content?.includes('Authors:')) return false;

      return elements.map((element) => getHeaderRowAuthor(element)).filter(({ name }) => name);
    })
  );

  return {
    type: 'author',
    items: _.flatMapDeep(items),
  };
}

function structureBullets(parsedData: any[]) {
  const bullets = parsedData?.filter((block: any) => {
    return block['type'] === 'nestedList' ? true : false;
  });

  const paragraphData = parsedData?.filter((block: any) => {
    return block['type'] === 'nestedList' ? false : true;
  });

  const nestedListMap: Map<string, NestedList> = new Map();
  for (const nestedList of bullets) {
    // If we've already seen this id, merge the items arrays
    if (nestedListMap.has(nestedList.data.id)) {
      const existingNestedList = nestedListMap.get(nestedList.data.id);
      if (existingNestedList) {
        existingNestedList.data.items.push(...nestedList.data.items);
      }
    } else {
      // If we haven't seen this id yet, add it to the map
      nestedListMap.set(nestedList.data.id, nestedList);
    }
  }

  // Convert the map values back to an array
  const mergedNestedListArray: NestedList[] = Array.from(nestedListMap.values());

  return [...paragraphData, mergedNestedListArray];
}

function parseBody(
  contents: Schema$StructuralElement[],
  lists: Schema$List,
  document: Schema$Document
) {
  if (!contents) return [];

  const parsedBody = _.flatMap(
    contents.map((content) => {
      const { paragraph, table, tableOfContents } = content;

      if (paragraph) return parseParagraph(paragraph, lists, document);
      if (table) return parseTable(table, lists, document);
      if (tableOfContents) {
        return {
          type: 'toc',
          items: parseTOC(tableOfContents, lists, document),
        };
      }
    })
  ).filter((value) => {
    return Boolean(value) && Object.keys(value).length
  });

  const structuredBody = structureBullets(parsedBody);

  return structuredBody;
}

function parseTable(table: Schema$Table, lists: Schema$List, document: Schema$Document) {
  if (!table || !table.tableRows) return [];

  return _.filter(
    _.flatMap(
      table.tableRows.map((row) =>
        row.tableCells?.map((cell) =>
          cell.content?.map(({ paragraph }) => {
            if (!paragraph) return [];
            return parseParagraph(paragraph, lists, document);
          })
        )
      )
    ),
    (value) => !_.isNull(value)
  );
}

function parseTOC(toc: Schema$TableOfContents, lists: Schema$List, document: Schema$Document) {
  const { content } = toc;

  if (!content) return [];

  return content.map((contentEl) => {
    const { paragraph } = contentEl;
    if (!paragraph) return [];
    return parseParagraph(paragraph, lists, document);
  });
}

function sanitizeContent(content?: string[]) {
  if (!content) return [];
  return content.join(' ').replaceAll(' .', '.').replaceAll(' ,', ',');
}

function getParagraphTag(paragraph: Schema$Paragraph) {
  const tags: Record<string, string> = {
    NORMAL_TEXT: 'p',
    SUBTITLE: 'blockquote',
    HEADING_1: 'h1',
    HEADING_2: 'h2',
    HEADING_3: 'h3',
    HEADING_4: 'h4',
    HEADING_5: 'h5',
  };

  return tags[paragraph.paragraphStyle?.namedStyleType as string];
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

function appendContentType(tag: string, data: any) {
  if (tag !== 'p' && tag !== 'blockquote') {
    return { type: 'header', tag, ...data };
  } else if (tag === 'p') {
    return { type: 'paragraph', tag, ...data };
  } else {
    return { type: 'quote', tag, ...data };
  }
}

function parseParagraphElement(
  tag: string,
  el: Schema$ParagraphElement,
  document: Schema$Document
) {
  let elementContent: any = {};

  if (el.inlineObjectElement) {
    const image = getImage(document, el);

    if (image) {
      elementContent = {
        type: 'image',
        data: {
          file: {
            url: image.source,
          },
          caption: image.alt,
        },
      };
    }
  } else if (
    el.richLink &&
    el.richLink?.richLinkProperties &&
    videoRegExp.test(el.richLink.richLinkProperties?.uri as string)
  ) {
    // support for each link
    elementContent = getRichLink(el);
  }
  // Headings, Texts
  else if (
    el.textRun &&
    el.textRun.content !== '\n' &&
    (el.textRun.content as string).trim().length > 0
  ) {
    elementContent = {
      [tag]: getText(el, {
        isHeader: tag !== 'p',
      }),
    };
  }

  return elementContent;
}

function parseParagraph(
  paragraph: Schema$Paragraph,
  lists: Schema$List,
  document: Schema$Document,
  isTable?: boolean
) {
  const parsedContent: any[] = [];

  if (paragraph.bullet) {
    const { bullet, elements } = paragraph;
    const { nestingLevel, listId } = bullet;

    const list = (lists as Record<string, Schema$List>)[listId as string];
    const listTag = getListTag(list, nestingLevel);

    const bulletContent = sanitizeContent(
      elements?.map((element) => getBulletContent(document, element))
    );

    const listStyle = listTag === 'ol' ? 'ordered' : 'unordered';

    parsedContent.push({
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

  const paragraphTag = getParagraphTag(paragraph);
  if (paragraphTag) {
    const tagContent: any[] = [];
    const { elements, paragraphStyle } = paragraph;

    if (!elements) return [];

    if (elements.length === 2 && isLink(elements) && !isTable) {
      const { textStyle, content } = elements[0].textRun as Schema$TextRun;
      const { indentFirstLine, indentStart } = paragraphStyle as Schema$ParagraphStyle;

      if (textStyle?.link?.url) {
        const link = textStyle?.link?.url as string;

        switch (true) {
          case twitterRegExp.test(link): {
            const match = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?$/
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
            const match = link.match(videoRegExp) as RegExpMatchArray;
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
            const match = link.match(tallyRegExp) as RegExpMatchArray;
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
      } else if (textStyle?.link?.headingId) {
        const defaultData = {
          id: textStyle.link.headingId.replace(/h./, ''),
          data: {
            text: content,
          },
        };

        let contentData: any = defaultData;
        if (indentFirstLine && indentStart) {
          contentData = {
            ...defaultData,
            indent: {
              firstLine: indentFirstLine?.magnitude || 0,
              start: indentStart?.magnitude || 0,
            },
          };
        }

        tagContent.push(appendContentType(paragraphTag, contentData));
      }
    } else {
      const contents = _.flatMap(
        elements.map((element: Schema$ParagraphElement) =>
          parseParagraphElement(paragraphTag, element, document)
        )
      );

      if (!isQuote(elements[0])) {
        tagContent.push(...contents);
      } else {
        tagContent.push({
          type: 'quote',
          data: {
            text: sanitizeContent(
              contents
                .map((content) => content[paragraphTag])
                .filter((content) => content.length > 0)
            ),
            caption: '',
            alignment: 'left',
          },
        });
      }
    }

    if (tagContent.every((content) => content[paragraphTag] !== undefined)) {
      const defaultData = {
        text: sanitizeContent(
          tagContent.map((content) => content[paragraphTag]).filter((content) => content.length > 0)
        ),
      };

      let contentData: any = defaultData;
      if (paragraphTag !== 'p' && paragraphTag !== 'blockquote') {
        contentData = {
          ...defaultData,
          id: paragraph?.paragraphStyle?.headingId?.replace(/h./, ''),
        };
      }

      parsedContent.push(appendContentType(paragraphTag, contentData));
    } else {
      parsedContent.push(...tagContent);
    }
  }

  return _.filter(parsedContent, (value) => !_.isNull(value));
}

function convertToHoldexJson(document: Schema$Document) {
  const { headers, body, lists } = document;
  const content: any[] = [];

  if (headers) {
    const headerData = parseHeader(headers);
    content.push(JSON.parse(JSON.stringify(headerData)));
  }

  if (body && body.content && lists) {
    const bodyData = parseBody(body.content, lists, document);
    content.push(JSON.parse(JSON.stringify(bodyData)));
  }

  return _.filter(_.flatMap(content), (value) => !_.isNull(value));
}

function getHeaderRowAuthor(content: Schema$ParagraphElement) {
  const author: Author = {} as Author;
  if (content && content.textRun?.textStyle?.link) {
    const textRun = content.textRun as Schema$TextRun;
    author.name = cleanText(textRun.content as string);
    author.url = textRun.textStyle?.link?.url || '';
  }
  return author;
}

function getListTag(list: Schema$List, nestingLevel: number | null | undefined) {
  const glyphType = _.get(list, [
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

const twitterRegExp = new RegExp(regExp.twitter, 'mi');
const videoRegExp = new RegExp(regExp.video, 'mi');
const tallyRegExp = new RegExp(/^https?:\/\/apply.holdex.io\/([^/?&]*)?$/, 'mi');

function isLink(elements: Schema$ParagraphElement[]) {
  const [el1, el2] = elements;

  const s2 = cleanText(el2?.textRun?.content as string) === '';
  const s1 = el1.textRun && el1.textRun.textStyle && el1.textRun.textStyle.link !== undefined;

  return s1 && s2;
}

function getRichLink(el: Schema$ParagraphElement) {
  const richLinkProperties = el.richLink?.richLinkProperties as Schema$RichLinkProperties;

  const match = richLinkProperties?.uri?.match(videoRegExp) as RegExpMatchArray;
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
const quoteExp = new RegExp(/^> (.*$)/, 'im');
function isQuote(el: Schema$ParagraphElement) {
  const { textRun } = el;
  if (textRun && textRun.content) {
    const txt = cleanText(textRun.content);
    return quoteExp.test(txt);
  } else {
    return false;
  }
}

function cleanText(text: string) {
  return text.replace(/\n/g, '').trim();
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
