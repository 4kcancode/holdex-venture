export type Parsed$ParagraphElement = {
  [key: string]: string;
};

export type Parsed$ParagraphItems = {
  content: string;
  items: any[];
};

export type Parsed$Paragraph = {
  type: 'nestedList' | 'embed' | string;
  id?: string;
  data: {
    level?: number;
    text?: string;
    style?: string;
    id?: string;
    caption?: string;
    alignment?: 'left' | 'right';
    service?: 'twitter' | 'tally' | 'gist' | string;
    url?: string;
    source?: string;
    embed?: string;
    title?: string;
    items?: Parsed$ParagraphItems[];
    file?: {
      url?: string;
    };
  };
};
