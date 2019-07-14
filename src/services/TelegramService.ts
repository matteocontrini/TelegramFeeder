import fetch from "node-fetch";
import BotSettings from "../entities/BotSettings";

export interface ITelegramService {
    sendMessage(chat: string, text: string, showPreview: boolean): Promise<void>;
    sendPhoto(chat: string, photo: string, text: string): Promise<void>;
}

export class TelegramService implements ITelegramService {
    private baseUrl: string;

    constructor(botSettings: BotSettings) {
        this.baseUrl = "https://api.telegram.org/bot" + botSettings.botToken;
    }

    public async sendMessage(chat: string, text: string, showPreview: boolean = false): Promise<void> {
        const url = this.baseUrl + "/sendMessage";

        const opts = {
            method: "POST",
            body: JSON.stringify({
                chat_id: chat,
                text,
                parse_mode: "HTML",
                disable_web_page_preview: !showPreview,
            }),
            headers: { "Content-Type": "application/json" },
        };

        const res = await fetch(url, opts);

        if (res.status !== 200) {
            throw new Error(`Response status code was [${res.status}]. Body: ${await res.text()}`);
        }
    }

    public async sendPhoto(chat: string, photo: string, text: string): Promise<void> {
        const url = this.baseUrl + "/sendPhoto";

        const opts = {
            method: "POST",
            body: JSON.stringify({
                chat_id: chat,
                photo,
                caption: text,
                parse_mode: "HTML",
            }),
            headers: { "Content-Type": "application/json" },
        };

        const res = await fetch(url, opts);

        if (res.status !== 200) {
            throw new Error(`Response status code was [${res.status}]. Body: ${await res.text()}`);
        }
    }
}
