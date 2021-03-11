import { Item } from "rss-parser";
import IFeedFilter from "./IFeedFilter";

export default class IlDolomitiFilter implements IFeedFilter {
    public execute(items: Item[]): void {
        for (const post of items) {
            if (!post.guid) {
                post.guid = post.link;
            }
        }
    }
}
