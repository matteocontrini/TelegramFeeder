import MessageType from "./MessageType";

export default class FormattedMessage {
    public type: MessageType;
    public text: string;
    public photoUrl: string;
    public showPreview: boolean;

    constructor(text: string, photoUrl?: string, showPreview: boolean = false) {
        this.text = text;
        this.photoUrl = photoUrl;
        this.showPreview = showPreview;

        if (photoUrl) {
            this.type = MessageType.Photo;
        } else {
            this.type = MessageType.Text;
        }
    }
}
