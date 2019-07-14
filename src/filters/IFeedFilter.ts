import { Item } from "rss-parser";

export default interface IFeedFilter {
    execute(items: Item[]): void;
}
