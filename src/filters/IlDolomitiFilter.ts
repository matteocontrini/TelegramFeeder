import { Item } from "rss-parser";
import IFeedFilter from "./IFeedFilter";

export default class IlDolomitiFilter implements IFeedFilter {
    public execute(items: Item[]): void {
        //  <guid isPermaLink="false">Consegnate al Comune 1.240 firme23300</guid>
        // becomes
        //  <guid isPermaLink="false">23300</guid>
        for (const post of items) {
            const match = post.guid.match(/^\D+(\d+)$/);
            if (match) {
                post.guid = match[1];
            }
        }
    }
}
