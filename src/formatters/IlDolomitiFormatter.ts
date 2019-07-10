import fetch, { Response } from "node-fetch";
import { Item } from "rss-parser";
import FormattedMessage from "../entities/FormattedMessage";
import IMessageFormatter from "./IMessageFormatter";

export default class IlDolomitiFormatter implements IMessageFormatter {
    public async format(item: Item): Promise<FormattedMessage> {
        let msg = "";

        let match = item.link.match(/https:\/\/www\.ildolomiti\.it\/(\w+)\//);

        if (match) {
            msg += "#" + match[1] + " — ";
        }

        // TODO: escape
        msg += "<strong>" + item.title + "</strong>";

        if (item.contentSnippet !== "") {
            msg += "\n\n<i>" + item.contentSnippet + "</i>";
        }

        msg += "\n\n📰 <a href=\"" + item.link + "\">Leggi articolo</a>";

        match = null;

        try {
            const resp: Response = await fetch(item.link);

            if (resp.status === 200) {
                const respText: string = await resp.text();
                match = respText.match(/<meta property="og:image" content="(.+?)" \/>/);
            }
        } catch (e) {
            // ignore
        }

        if (match) {
            return new FormattedMessage(msg, match[1]);
        } else {
            return new FormattedMessage(msg);
        }
    }
}
