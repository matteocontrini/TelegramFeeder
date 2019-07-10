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

        let snippet;
        let photoUrl;

        try {
            const resp: Response = await fetch(item.link);

            if (resp.status === 200) {
                const respText: string = await resp.text();

                match = respText.match(/<meta property="og:image" content="(.+?)" \/>/);
                if (match) {
                    photoUrl = match[1];
                }

                match = respText.match(/<div class="artSub">(?:.+?)<p>(.+?)<\/p>/);
                if (match) {
                    snippet = match[1];
                }
            }
        } catch (e) {
            // ignore
        }

        if (!snippet && item.contentSnippet !== "") {
            snippet = item.contentSnippet;
        }

        if (snippet) {
            msg += "\n\n<i>" + snippet + "</i>";
        }

        msg += "\n\n📰 <a href=\"" + item.link + "\">Leggi articolo</a>";

        if (photoUrl) {
            return new FormattedMessage(msg, photoUrl);
        } else {
            return new FormattedMessage(msg);
        }
    }
}
