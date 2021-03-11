import { Item } from "rss-parser";
import IFeedFilter from "./IFeedFilter";

export default class IlDolomitiFilter implements IFeedFilter {
    public execute(items: Item[]): void {
        for (const post of items) {
            if (typeof post.guid != 'string') {
                post.guid = post.link;
            }
        }
    }
}
