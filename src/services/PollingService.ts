import { Item } from "rss-parser";
import { Feed } from "../entities/Feed";
import FormattedMessage from "../entities/FormattedMessage";
import MessageType from "../entities/MessageType";
import logger from "../logger";
import { IFeedReaderService } from "./FeedReaderService";
import { ITelegramService } from "./TelegramService";

export interface IPollingService {
    start(): void;
}

export class PollingService implements IPollingService {
    private feeds: Feed[];
    private reader: IFeedReaderService;
    private telegram: ITelegramService;

    constructor(feeds: Feed[],
                feedReaderService: IFeedReaderService,
                telegramService: ITelegramService) {
        this.feeds = feeds;
        this.reader = feedReaderService;
        this.telegram = telegramService;
    }

    public start() {
        this.update();

        setInterval(this.update.bind(this), 10 * 60 * 1000);
    }

    private async update() {
        logger.info("Updating feeds...");

        for (const feed of this.feeds) {
            logger.info("Fetching feed:", feed.url);

            let posts: Item[];

            try {
                posts = await this.reader.getPosts(feed);
            } catch (e) {
                logger.error("Error while fetching feed:", e);
                continue;
            }

            if (feed.name === "ildolomiti") {
                for (const post of posts) {
                    const match = post.guid.match(/^\D+(\d+)$/);
                    if (match) {
                        post.guid = match[1];
                    }
                }
            }

            if (feed.guidsCache.length === 0) {
                logger.info("This is the first fetch. Storing", posts.length, "posts into cache");
                feed.guidsCache = posts.map(x => x.guid);
                continue;
            }

            const newPosts = this.findNewPosts(feed.guidsCache, posts);

            // Update guids cache so that new posts aren't notified again
            feed.guidsCache = posts.map(x => x.guid);

            logger.info(newPosts.length, "new posts were found");

            await this.notifyPosts(feed, newPosts);
        }

        logger.info("Done for now");
    }

    private findNewPosts(cache: string[], posts: Item[]): Item[] {
        return posts.filter(x => !cache.includes(x.guid));
    }

    private async notifyPosts(feed: Feed, newPosts: Item[]) {
        for (const post of newPosts) {
            logger.info("Notifying post with guid:", post.guid);

            try {
                const formatted: FormattedMessage = await feed.messageFormatter.format(post);

                if (formatted == null) {
                    logger.info("Never mind, skipping...");
                    continue;
                }

                if (formatted.type === MessageType.Text) {
                    await this.telegram.sendMessage(feed.telegramChat, formatted.text);
                } else if (formatted.type === MessageType.Photo) {
                    await this.telegram.sendPhoto(feed.telegramChat, formatted.photoUrl, formatted.text);
                }
            } catch (e) {
                logger.error("Error while notifying post: ", e);
            }
        }
    }
}
