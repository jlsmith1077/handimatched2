import { ImageGallery } from "./image_gallery.model";
import { VideoGallery } from "./video_gallery.model";

export class Profile {
    public id: string;
    public username: string;
    public email: string;
    public imagePath: string;
    public location: string;
    public gender: string;
    public interest: string;
    public fullname: string;
    public creator: string;
    public friends: [];
    public friendsAmt: number;
    public imageGallery: ImageGallery[];
    public videoGallery: VideoGallery[];

    constructor(fullname: string,
                location: string,
                imagePath: string,
                username: string,
                email: string,
                gender: string,
                interest: string,
                id: string,
                creator: string,
                friends: [],
                friendsAmt: number,
                imageGallery: ImageGallery[],
                videoGallery: VideoGallery[]
                ) {
        this.fullname = fullname;
        this.imagePath = imagePath;
        this.location = location;
        this.username = username;
        this.email = email;
        this.gender = gender;
        this.interest = interest;
        this.id = id;
        this.creator = creator;
        this.friends = friends;
        this.friendsAmt = friendsAmt;
        this.imageGallery = imageGallery;
        this.videoGallery = videoGallery;
    }
}
