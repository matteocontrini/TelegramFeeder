import IMessageFormatter from "../formatters/IMessageFormatter";

export class Feed {
    public url: string;
    public guidsCache: string[];
    public messageFormatter: IMessageFormatter;
    public telegramChat: string;

    constructor(url: string, formatter: IMessageFormatter, telegramChat: string) {
        this.url = url;
        this.guidsCache = [];
        this.messageFormatter = formatter;
        this.telegramChat = telegramChat;
    }
}
