export class Media {
    public title: string;
    public path: string;
    public likes: number;

    constructor(title: string,
                path: string,
                likes: number
        ) {
            this.title = title;
            this.path = path;
            this.likes = likes;
    }
}
