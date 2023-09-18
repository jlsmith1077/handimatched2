export interface Mail {
    _id: string | null;
    content1: string;
    creator: string;
    receiverCreator: string;
    username: string;
    receivername: string;
    messageTime: object;
    userpic: string;
    messageImages: any;
    messageVideo: any;
    opened?: string;
}
