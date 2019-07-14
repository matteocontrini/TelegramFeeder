import IFeedFilter from "../filters/IFeedFilter";
import IMessageFormatter from "../formatters/IMessageFormatter";

export class Feed {
    public url: string;
    public guidsCache: string[];
    public feedFilter: IFeedFilter;
    public messageFormatter: IMessageFormatter;
    public telegramChat: string;

    constructor(url: string,
                filter: IFeedFilter,
                formatter: IMessageFormatter,
                telegramChat: string) {
        this.url = url;
        this.guidsCache = [];
        this.feedFilter = filter;
        this.messageFormatter = formatter;
        this.telegramChat = telegramChat;
    }
}
