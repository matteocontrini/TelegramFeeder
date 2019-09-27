import { Item } from "rss-parser";
import FormattedMessage from "../entities/FormattedMessage";
import * as util from "../util";
import IMessageFormatter from "./IMessageFormatter";

export default class LaBusaFormatter implements IMessageFormatter {
    public async format(item: Item): Promise<FormattedMessage> {
        let msg = "";

        // let title = entities.decodeHTML(item.title);
        const title = util.telegramEscape(item.title);
        msg += "<strong>" + title + "</strong>";

        msg += "\n\n📰 " + item.link;

        return new FormattedMessage(msg, null, true);
    }
}
