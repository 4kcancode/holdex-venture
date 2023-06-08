import Div from './div.svelte';
import { H1, H2, H3, H4, H5, H6 } from './headings';
import A from './anchor.svelte';
import { P, Blockquote, Hr } from './text';
import { Code, Pre } from './code';
import { Ul, Ol, Li } from './lists';
import { Table, Th, Td } from './table';
import Img from './img.svelte';
import { Mention, Hashtag, Cashtag, Emoji, Poll } from './Twitter';
import Tweet from './Tweet/index.svelte';
import LinkPreview from "./LinkPreview/index.svelte";
import TweetSkeleton from './Tweet/TweetSkeleton.svelte';

export default {
    div: Div,

    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,

    p: P,
    blockquote: Blockquote,
    hr: Hr,

    code: Code,
    pre: Pre,

    a: A,
    linkPreview: LinkPreview,

    ul: Ul,
    ol: Ol,
    li: Li,

    table: Table,
    th: Th,
    td: Td,

    img: Img,

    Mention,
    Hashtag,
    Cashtag,
    Emoji,
    Poll,

    Tweet,
    TweetSkeleton,
};