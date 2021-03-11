import * as entities from "entities";
import fetch, { Response } from "node-fetch";
import { Item } from "rss-parser";
import FormattedMessage from "../entities/FormattedMessage";
import * as util from "../util";
import IMessageFormatter from "./IMessageFormatter";

export default class IlDolomitiFormatter implements IMessageFormatter {
    public async format(item: Item): Promise<FormattedMessage> {
        let msg = "";

        item.link = decodeURI(item.link);

        let match = item.link.match(/https:\/\/www\.ildolomiti\.it\/(\w+)\//);

        if (match) {
            let category = match[1];

            if (category == "blog" || category == "necrologi") {
                return null;
            }

            msg += "#" + category + " — ";
        }

        let title = entities.decodeHTML(item.title);
        title = util.telegramEscape(title);
        msg += "<strong>" + title + "</strong>";

        let snippet;
        let photoUrl;

        try {
            const resp: Response = await fetch(item.link);

            if (resp.status === 200) {
                const respText: string = await resp.text();

                match = respText.match(/<meta property="og:image" content="(.+?)" ?\/>/);
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
            snippet = entities.decodeHTML(snippet);
            snippet = snippet.replace(/<[^>]*>?/gm, '');
            snippet = util.telegramEscape(snippet);

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
