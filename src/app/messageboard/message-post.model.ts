import { Comment } from "./comment.model";

export class Post {
    id: string;
    username: string;
    messagepost: string;
    imagePath: string;
    creator: string;
    format: string;
    section?: string;
    time: Date;
    title: string;
    privacy?: string;
    location: string;
    comments: Comment[];
    userPic: string;
    likes?: string[];
    dislikes?: string[];
    likesAmt?: number;
    dislikesAmt?: number;



    constructor(
        id: string,
        username: string,
        messagepost: string,
        imagePath: string,
        creator: string,
        format: string,
        section: string,
        time: Date,
        title: string,
        privacy: string,
        location: string,
        comments: Comment[],
        userPic: string,
        likesAmt: number,
        likes: string[],
        dislikes: string[],
        dislikesAmt: number
        ){
            this.id = id;
            this.username = username;
            this.messagepost = messagepost;
            this.imagePath = imagePath;
            this.creator = creator;
            this.format = format;
            this.section = section;
            this.time = time;
            this.title = title;
            this.privacy = privacy;
            this.location = location;
            this.comments = comments;
            this.userPic = userPic;
            this.likes = likes;
            this.dislikes = dislikes;
            this.likesAmt = likesAmt;
            this.dislikesAmt = dislikesAmt;
    }
}
