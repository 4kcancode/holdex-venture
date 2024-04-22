export type Parse$Header = {
  type: 'author';
  items: Parse$HeaderElement[];
};

export type Parse$HeaderElement = {
  name: string;
  url: string;
};

export type Parse$ParagraphElement = {
  type: string;
  id?: string;
  data: {
    level?: number;
    style?: string;
    id?: string;
    items?: any[];
    text?: string;
    file?: {
      url?: string;
    };
    caption?: string;
    service?: 'youtube' | 'vimeo' | 'tally' | 'twitter' | 'unknown';
    source?: any;
    embed?: string;
    url?: string;
    title?: string;
  };
};

export type Parse$Image = {
  source: string;
  title: string;
  alt: string;
};

export type Parse$TableOfContents = {
  type: 'toc';
  items: Parse$ParagraphElement[];
};
