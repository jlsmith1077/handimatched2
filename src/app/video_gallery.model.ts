export class VideoGallery {
    public title: string;
    public path: string | File;
    public likes?: number;

    constructor(title: string,
                path: string | File,
                likes: number
        ) {
            this.title = title;
            this.path = path;
            this.likes = likes;
    }
}