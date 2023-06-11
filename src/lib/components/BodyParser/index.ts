import parseBlocks, { type Author } from './blocks';
import { getVideoCover } from './utils';
import type {
	Community,
	CommunityPostedThreadConnectionEdge,
	Message as DefaultMessage,
	ThreadAllRepliesConnection,
	Maybe,
	MessagePostedInCommunityConnectionEdge,
	User,
} from '$lib/types/api';

type MessageAuthor = (Community | User) & {
	isCommunity?: boolean;
};

type Message = DefaultMessage & {
	messageSlug: string;
	communitySlug: string;
	viewsCount?: number;
	allReplies?: Maybe<ThreadAllRepliesConnection>;
};

type ParsedMessage = Partial<Message> & {
	title: string;
	subtitle: string;
	blocks: any[];
	_author: MessageAuthor;
	docAuthors: Author[];
	parsedBody: Record<string, any>;
	tocs: any[];
	cover?: string;
	isGoogleDoc: string;
};

class Parser {
	static parse(message: Message): ParsedMessage {
		const parsedBody = Parser.parseBody(message);
		const parsedMAuthor = Parser.parseMessageAuthor(message);
		const [parsedBlocks, subtitle, parsedDAuthors, isGoogleDoc] = Parser.parseSubtitle(
			parsedBody?.blocks
		);
		const blocks = Parser.parseBlocks(parsedBlocks);
		const tocs = Parser.parseTocs(blocks);
		const cover = Parser.parseThreadCover(blocks);

		return {
			...message,
			_author: parsedMAuthor,
			docAuthors: parsedDAuthors,
			isGoogleDoc,
			blocks,
			parsedBody,
			tocs,
			subtitle,
			cover,
		};
	}

	static parseFromCategory(category: Community, communitySlug?: string): ParsedMessage {
		const { postedThread, ...rest } = category;
		const newMessage = {
			...((postedThread as CommunityPostedThreadConnectionEdge).node as DefaultMessage),
			messageSlug: (postedThread as CommunityPostedThreadConnectionEdge).messageSlug,
			communitySlug: communitySlug || rest.slug,
			viewsCount: (postedThread as CommunityPostedThreadConnectionEdge).viewsCount || 0,
			allReplies: (postedThread as CommunityPostedThreadConnectionEdge).allReplies,
		};

		return Parser.parse(newMessage);
	}

	static parseViaCategory(message: DefaultMessage, communitySlug?: string): ParsedMessage {
		const { postedIn, ...rest } = message;
		const newMessage = {
			...rest,
			messageSlug: (postedIn as MessagePostedInCommunityConnectionEdge).messageSlug,
			communitySlug:
				communitySlug || (postedIn as MessagePostedInCommunityConnectionEdge).node?.slug || '',
			viewsCount: (postedIn as MessagePostedInCommunityConnectionEdge).viewsCount || 0,
			allReplies: (postedIn as MessagePostedInCommunityConnectionEdge).allReplies,
		};

		return Parser.parse(newMessage);
	}

	private static parseBody(message: Message): Record<string, any> {
		let body = {};
		if (message && message.body) {
			try {
				body = JSON.parse(message.body);
			} catch (error) {
				/* empty */
			}
		}
		return body;
	}

	private static parseBlocks(blocks: any[]): any[] {
		return parseBlocks(blocks || []);
	}

	private static parseMessageAuthor(message: Message): MessageAuthor {
		if (message?.authorIsCommunity) {
			return {
				isCommunity: true,
				...(message?.author as MessageAuthor),
			};
		}
		return message?.author || ({} as MessageAuthor);
	}

	private static parseTocs(blocks: any[], allowedDepth: string[] = ['h2', 'h3', 'h4']): any[] {
		const tocs = [];
		for (const block of blocks) {
			if (block.type === 'heading' && allowedDepth.includes(block.level)) {
				tocs.push(block);
			}
		}
		return tocs;
	}

	private static parseSubtitle(blocks: any[]): [any[], string, Author[], string] {
		try {
			const firstBlock = blocks[0];

			let subtitle = '';
			let isGoogleDoc = '';
			let authors: Author[] = [];

			if (firstBlock && firstBlock.type === 'subtitle') {
				blocks = blocks.slice(1);
				subtitle = firstBlock.data.text;
			}

			const isSourceBlock = blocks.find((b) => b.type === 'source');
			if (isSourceBlock) {
				blocks = blocks.filter((b) => b.type !== 'source');
				isGoogleDoc = isSourceBlock.url;
			}

			const docAuthors = blocks.find((b) => b.type === 'author');
			if (docAuthors) {
				blocks = blocks.filter((b) => b.type !== 'author');
				authors = docAuthors.items;
			}
			return [blocks, subtitle, authors, isGoogleDoc];
		} catch (error) {
			/* empty */
		}
		return [blocks, '', [] as Author[], ''];
	}

	private static parseThreadCover(blocks: any[]): string | undefined {
		const block = blocks.find((b) => b.type === 'image' || b.type === 'embed');
		if (block) {
			if (block.type === 'image') {
				return block.src;
			}

			if (block.type === 'embed') {
				return getVideoCover(block.source);
			}
		}
		return undefined;
	}
}

export type { ParsedMessage, Message };
export default Parser;
