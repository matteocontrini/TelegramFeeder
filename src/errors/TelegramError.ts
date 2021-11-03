export default class TelegramError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, TelegramError.prototype);
    }

    isFailedToGetContent() {
        return this.message.includes("failed to get HTTP URL content");
    }
}
