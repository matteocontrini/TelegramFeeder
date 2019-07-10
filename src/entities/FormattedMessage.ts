import MessageType from "./MessageType";

export default class FormattedMessage {
    public type: MessageType;

    public text: string;

    public photoUrl: string;

    constructor(text: string, photoUrl?: string) {
        this.text = text;
        this.photoUrl = photoUrl;

        if (photoUrl) {
            this.type = MessageType.Photo;
        } else {
            this.type = MessageType.Text;
        }
    }
}
