export class VideoGallery {
    public _id?: string;
    public title: string;
    public path: string | File;
    public likes?: string[];
    public likesAmt?: number;
    public dislikes?: [];
    public dislikesAmt?: number;

    constructor(
                _id: string,
                title: string,
                path: string | File,
                likes: string[],
                likesAmt: number,
                dislikes: [],
                dislikesAmt: number
        ) {
            this._id = _id;
            this.title = title;
            this.path = path;
            this.likes = likes;
            this.likesAmt = likesAmt;
            this.dislikes = dislikes;
            this.dislikesAmt = dislikesAmt;
    }
}