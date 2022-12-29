export interface Mail {
    id: string | null;
    content1: string;
    creator: string;
    receiver: string;
    username: string;
    receivername: string;
    messageTime: object;
    userpic: string;
    opened: string;
    repliesAmt: number | null; 
}
