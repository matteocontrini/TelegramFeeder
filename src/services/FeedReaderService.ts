import * as Parser from "rss-parser";
import { Item } from "rss-parser";
import { Feed } from "../entities/Feed";

export interface IFeedReaderService {
    getPosts(feed: Feed): Promise<Parser.Item[]>;
}

export class FeedReaderService implements IFeedReaderService {
    public async getPosts(feed: Feed): Promise<Item[]> {
        const parser = new Parser({
            timeout: 10 * 1000,
            headers: { "User-Agent": "TelegramFeeder (+https://github.com/matteocontrini/TelegramFeeder)" }
        });

        const url = feed.url + '?' + Date.now();

        const output = await parser.parseURL(url);
        return output.items;
    }
}
