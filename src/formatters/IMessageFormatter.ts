import { Item } from "rss-parser";
import FormattedMessage from "../entities/FormattedMessage";

export default interface IMessageFormatter {
    format(item: Item): Promise<FormattedMessage>;
}
