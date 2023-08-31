import type { RequestHandler } from '@sveltejs/kit';
import type {
  Schema$Body,
  Schema$Bullet,
  Schema$Document,
  Schema$Headers,
  Schema$InlineObjects,
  Schema$InlineObjectElement,
  Schema$List,
  Schema$Lists,
  Schema$TextStyle,
  Schema$Paragraph,
  Schema$ParagraphElement,
  Schema$ParagraphStyle,
  Schema$RichLinkProperties,
  Schema$TableOfContents,
  Schema$Table,
  Schema$TextRun,
} from '$lib/types/googleDoc';
import type {
  Parse$HeaderElement,
  Parse$Header,
  Parse$Image,
  Parse$ParagraphElement,
  Parse$TableOfContents,
} from '$lib/types/googleDocParser';

import { json } from '@sveltejs/kit';
import _ from 'lodash-es';

import { cleanLinebreaks, sanitizeTexts } from '$lib/utils';

import { getEmbedUrl, getEmbedSource, regExp } from '$components/BodyParser/utils';

const twitterRegExp = new RegExp(regExp.twitter, 'mi');
const videoRegExp = new RegExp(regExp.video, 'mi');
const tallyRegExp = new RegExp(/^https?:\/\/apply.holdex.io\/([^/?&]*)?$/, 'mi');
const quoteExp = new RegExp(/^> (.*$)/, 'im');

const getListTag = (list: Schema$List, nestingLevel: number | null | undefined) => {
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
};

const getElementTags = (paragraphStyle: Schema$ParagraphStyle): string => {
  const types: Record<string, string> = {
    NORMAL_TEXT: 'paragraph',
    SUBTITLE: 'quote',
    HEADING_1: 'header1',
    HEADING_2: 'header2',
    HEADING_3: 'header3',
    HEADING_4: 'header4',
    HEADING_5: 'header5',
  };

  return types[paragraphStyle.namedStyleType as string];
};

const getElementImage = (
  inlineObjectElement: Schema$InlineObjectElement,
  inlineObjects: Schema$InlineObjects
): Parse$Image | null => {
  const inlineObject = inlineObjects[inlineObjectElement.inlineObjectId as string];
  const embeddedObject = inlineObject?.inlineObjectProperties?.embeddedObject;

  if (embeddedObject && embeddedObject.imageProperties) {
    return {
      source:
        embeddedObject.imageProperties.sourceUri || embeddedObject.imageProperties.contentUri || '',
      title: embeddedObject.title || '',
      alt: embeddedObject.description || '',
    };
  }

  return null;
};

const getText = (element?: Schema$ParagraphElement, { isHeader = false } = {}) => {
  let text = cleanLinebreaks(element?.textRun?.content as string);
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
};

const getBulletContent = (
  element?: Schema$ParagraphElement,
  inlineObjects?: Schema$InlineObjects | null
) => {
  const { inlineObjectElement } = element as Schema$ParagraphElement;

  if (inlineObjectElement && inlineObjects) {
    const image = getElementImage(inlineObjectElement, inlineObjects);
    if (image) {
      return `<img src="${image.source}" alt="${image.alt}" title="${image.title}" />`;
    }
  }

  return getText(element);
};

const parseParagraphElement = (
  element: Schema$ParagraphElement,
  paragraphStyle: Schema$ParagraphStyle,
  inlineObjects?: Schema$InlineObjects | null
): Parse$ParagraphElement => {
  const { textRun, richLink, inlineObjectElement } = element;

  if (textRun && textRun.content) {
    if (getElementTags(paragraphStyle).includes('header')) {
      return {
        type: 'header',
        id: paragraphStyle.headingId?.replace(/h./, ''),
        data: {
          level: Number(getElementTags(paragraphStyle).replace(/header/g, '')),
          text: cleanLinebreaks(textRun.content),
        },
      };
    } else {
      return {
        type: getElementTags(paragraphStyle),
        data: {
          text: cleanLinebreaks(textRun.content),
        },
      };
    }
  }

  if (inlineObjectElement && inlineObjects) {
    const image = getElementImage(inlineObjectElement, inlineObjects);

    if (image) {
      return {
        type: 'image',
        data: {
          file: {
            url: image.source,
          },
          caption: image.alt,
        },
      };
    }
  }

  if (
    richLink &&
    richLink?.richLinkProperties &&
    videoRegExp.test(richLink.richLinkProperties?.uri as string)
  ) {
    const richLinkProperties = richLink.richLinkProperties as Schema$RichLinkProperties;
    const match = richLinkProperties.uri?.match(videoRegExp) as RegExpMatchArray;

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

  return {
    type: getElementTags(paragraphStyle),
    data: {
      text: '',
    },
  };
};

const isLink = (elements: Schema$ParagraphElement[]) => {
  const [elementOne, elementTwo] = elements;

  const s1 =
    elementOne.textRun &&
    elementOne.textRun.textStyle &&
    elementOne.textRun.textStyle.link !== undefined;
  const s2: boolean = cleanLinebreaks(elementTwo.textRun?.content as string) === '';

  return s1 && s2;
};

const trimJoin = (content?: string[]) => {
  if (!content) return [];

  return sanitizeTexts(content.join(' ').replaceAll(' .', '.').replaceAll(' ,', ','));
};

const parseParagraphBullet = (
  bullet: Schema$Bullet,
  elements: Schema$ParagraphElement[],
  lists?: Schema$Lists | null,
  inlineObjects?: Schema$InlineObjects | null
): Parse$ParagraphElement[] => {
  const { nestingLevel, listId } = bullet;

  const list = (lists as Record<string, Schema$List>)[listId as string];
  const listTag = getListTag(list, nestingLevel);

  const bulletContent = trimJoin(
    elements?.map((element) => getBulletContent(element, inlineObjects))
  );

  const listStyle = listTag === 'ol' ? 'ordered' : 'unordered';

  return [
    {
      type: 'nestedList',
      data: {
        style: listStyle,
        id: listId as string,
        items: [
          {
            content: bulletContent,
            items: [],
          },
        ],
      },
    },
  ];
};

const isQuote = (element: Schema$ParagraphElement): boolean => {
  const { textRun } = element;

  if (textRun && textRun.content) {
    const txt = cleanLinebreaks(textRun.content);

    return quoteExp.test(txt);
  } else {
    return false;
  }
};

const parseParagraph = (
  paragraph: Schema$Paragraph,
  lists?: Schema$Lists | null,
  inlineObjects?: Schema$InlineObjects | null
): Parse$ParagraphElement[] => {
  const { elements, bullet, paragraphStyle } = paragraph;

  if (!elements || !paragraphStyle) {
    return [];
  }

  if (elements && bullet) {
    return parseParagraphBullet(bullet, elements, lists, inlineObjects);
  }

  if (elements.length === 2 && isLink(elements)) {
    const { textStyle, content } = elements[0].textRun as Schema$TextRun;

    if (textStyle?.link?.url) {
      const link = textStyle?.link?.url as string;

      switch (true) {
        case twitterRegExp.test(link): {
          const match = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?$/
            .exec(link)
            ?.slice(2);

          return [
            {
              type: 'embed',
              data: {
                service: 'twitter',
                source: link,
                embed: `api/tweets.json?id=${match?.shift()}`,
              },
            },
          ];
        }

        case videoRegExp.test(link): {
          const match = link.match(videoRegExp) as RegExpMatchArray;

          return [
            {
              type: 'embed',
              data: {
                service: getEmbedSource(match[0]),
                source: match[0],
                embed: getEmbedUrl(match[0]),
              },
            },
          ];
        }

        case tallyRegExp.test(link): {
          const match = link.match(tallyRegExp) as RegExpMatchArray;

          return [
            {
              type: 'embed',
              data: {
                service: 'tally',
                source: match[0],
                embed: match[0],
              },
            },
          ];
        }

        default: {
          return [
            {
              type: 'linkTool',
              data: {
                url: link,
                title: content as string,
                embed: `api/link.json?url=${link}`,
              },
            },
          ];
        }
      }
    }

    if (textStyle?.link?.headingId) {
      const type = getElementTags(paragraphStyle);

      if (type.includes('header')) {
        return [
          {
            type: getElementTags(paragraphStyle).replace(/(header)\d+/g, '$1'),
            id: textStyle.link.headingId.replace(/h./, ''),
            data: {
              level: Number(getElementTags(paragraphStyle).replace(/header/g, '')),
              text: content as string,
            },
          },
        ];
      }

      const indentation = paragraphStyle.indentFirstLine?.magnitude;
      return [
        {
          type: getElementTags(paragraphStyle).replace(/(header)\d+/g, '$1'),
          data: {
            level: ((indentation ? indentation : 0) / 18) as number,
            text: content as string,
            items: [],
          },
        },
      ];
    }

    return [
      {
        type: getElementTags(paragraphStyle),
        data: {
          text: '',
        },
      },
    ];
  } else {
    const paragraphData = elements
      .map((element) => parseParagraphElement(element, paragraphStyle, inlineObjects))
      .filter(({ data }) => Boolean(data?.text));

    if (!isQuote(elements[0])) {
      return paragraphData;
    } else {
      const targetType = getElementTags(paragraphStyle);
      return [
        {
          type: 'quote',
          data: {
            text: trimJoin(
              paragraphData
                .map(({ type, data }) => {
                  if (type === targetType) {
                    return data.text || '';
                  }

                  return false;
                })
                .filter((content) => content !== false) as string[]
            ) as string,
          },
        },
      ];
    }
  }
};

const parseHeader = (headers?: Schema$Headers | null): Parse$Header => {
  if (!headers) {
    return {
      type: 'author',
      items: [],
    };
  }

  const keys = Object.keys(headers);
  if (keys.length === 0) {
    return {
      type: 'author',
      items: [],
    };
  }

  const authors: Parse$HeaderElement[][][] = keys.map((key: string) => {
    const { content } = headers[key];

    return (content ?? []).map(({ paragraph }) => {
      const { elements } = paragraph as Schema$Paragraph;

      const headerElements: Parse$HeaderElement[] = (elements ?? [])
        .map(({ textRun }) => {
          const { content, textStyle } = textRun as Schema$TextRun;

          return {
            name: content || '',
            url: textStyle?.link?.url || '',
          };
        })
        .filter(({ url }) => url);

      return headerElements;
    });
  });

  return {
    type: 'author',
    items: _.flattenDeep(authors),
  };
};

const parseTable = (
  table: Schema$Table,
  lists?: Schema$Lists | null,
  inlineObjects?: Schema$InlineObjects | null
): Parse$ParagraphElement[] => {
  if (!table.tableRows) return [];

  return _.flattenDeep(
    table.tableRows.map(
      (row) =>
        row.tableCells?.map(
          (cell) =>
            cell.content?.map(({ paragraph }) => {
              if (!paragraph) return [];
              return parseParagraph(paragraph, lists, inlineObjects) as Parse$ParagraphElement[];
            }) as Parse$ParagraphElement[][]
        ) as Parse$ParagraphElement[][][]
    ) as Parse$ParagraphElement[][][][]
  );
};

const parseTOC = (
  toc: Schema$TableOfContents,
  lists?: Schema$Lists | null,
  inlineObjects?: Schema$InlineObjects | null
): Parse$TableOfContents => {
  const { content } = toc;

  if (!content) {
    return {
      type: 'toc',
      items: [],
    };
  }

  return {
    type: 'toc',
    items: _.flattenDeep(
      content.map((contentEl) => {
        const { paragraph } = contentEl;
        if (!paragraph) return [];
        return parseParagraph(paragraph, lists, inlineObjects);
      })
    ),
  };
};

const getStructuralTOC = (
  parsedBody: (Parse$ParagraphElement | Parse$TableOfContents)[]
): (Parse$ParagraphElement | Parse$TableOfContents)[] => {
  const structuredBody: (Parse$ParagraphElement | Parse$TableOfContents)[] = [];

  for (const dataBlock of parsedBody) {
    const { type } = dataBlock;

    if (type === 'toc') {
      const { items } = dataBlock as Parse$TableOfContents;
      const newItems: Parse$ParagraphElement[] = [];
      let stack: Parse$ParagraphElement[] = [];

      items.forEach((item) => {
        if (item.data.level === 0) {
          if (stack.length > 0) {
            newItems.push(stack[0]);
            stack = [];
          }
          const newItem = { ...item, data: { ...item.data, items: [] } };
          stack.push(newItem);
        } else {
          const parent = stack[(item.data.level as number) - 1];
          if (parent) {
            parent.data.items?.push({ ...item, data: { ...item.data, items: [] } });
            stack[item.data.level as number] = parent.data.items?.[parent.data.items.length - 1];
          }
        }
      });

      if (stack.length > 0) {
        newItems.push(stack[0]);
      }

      structuredBody.push({
        type: 'toc',
        items: newItems,
      });
    } else {
      structuredBody.push(dataBlock);
    }
  }

  return structuredBody;
};

const getStructureBullets = (
  parsedBody: (Parse$ParagraphElement | Parse$TableOfContents)[]
): (Parse$ParagraphElement | Parse$TableOfContents)[] => {
  const structuredData: any = {};

  let index = -1;
  for (const dataBlock of parsedBody) {
    const { type, data } = dataBlock as Parse$ParagraphElement;

    if (type !== 'nestedList') {
      ++index;
      structuredData[index] = dataBlock;
    } else {
      if (!structuredData[index].data || data.id !== structuredData[index].data.id) {
        ++index;
        structuredData[index] = dataBlock;
      } else {
        structuredData[index].data.items = [
          ...structuredData[index].data.items,
          ...(data.items as any[]),
        ];
      }
    }
  }

  return Object.values(structuredData);
};

const parseBody = (
  body?: Schema$Body | null,
  lists?: Schema$Lists | null,
  inlineObjects?: Schema$InlineObjects | null
): (Parse$ParagraphElement | Parse$TableOfContents)[] => {
  const { content } = body as Schema$Body;

  const parsedBody = (content ?? [])
    .map((element) => {
      const { paragraph, tableOfContents, table } = element;

      if (paragraph) return parseParagraph(paragraph, lists, inlineObjects);
      if (table) return parseTable(table, lists, inlineObjects);
      if (tableOfContents) return parseTOC(tableOfContents, lists, inlineObjects);
    })
    .filter((element) => element) as Parse$ParagraphElement[][];

  return _.flattenDeep(parsedBody);
};

const parseGDocJson = (data: Schema$Document) => {
  const { body, lists, headers, inlineObjects } = data;

  const parsedHeader = parseHeader(headers);
  const parsedBody = getStructureBullets(getStructuralTOC(parseBody(body, lists, inlineObjects)));

  return [parsedHeader, ...parsedBody];
};

export const POST: RequestHandler = async ({ request }) => {
  const { data, updatedAt } = await request.json();

  const parsedData = parseGDocJson(data);

  return json(
    {
      blocks: parsedData,
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
