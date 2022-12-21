export class Video {
    public id: string;
    public username: string;
    public title: string;
    public videoPath: string;
    public creator: string;

    constructor(id: string, username: string, title: string, videoPath: string, creator: string) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.videoPath = videoPath;
        this.creator = creator;   
    }
}
