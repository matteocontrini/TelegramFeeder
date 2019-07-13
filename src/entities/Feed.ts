import IMessageFormatter from "../formatters/IMessageFormatter";

export class Feed {
    public name: string;
    public url: string;
    public guidsCache: string[];
    public messageFormatter: IMessageFormatter;
    public telegramChat: string;

    constructor(name: string, url: string, formatter: IMessageFormatter, telegramChat: string) {
        this.name = name;
        this.url = url;
        this.guidsCache = [];
        this.messageFormatter = formatter;
        this.telegramChat = telegramChat;
    }
}
