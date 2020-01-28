import { Item } from "rss-parser";
import IFeedFilter from "./IFeedFilter";

export default class LaBusaFilter implements IFeedFilter {
    public execute(items: Item[]): void {
        for (let i = items.length - 1; i >= 0; --i) {
            if (items[i].categories.includes('Appuntamenti')) {
                items.splice(i, 1);
            }
        }
    }
}
