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
    public imageGallery: ImageGallery[];
    public videoGallery: VideoGallery[];
    public online?: string;
    public friendsAmt?: number;

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
                imageGallery: ImageGallery[],
                videoGallery: VideoGallery[],
                online?: string,
                friendsAmt?: number
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
        this.imageGallery = imageGallery;
        this.videoGallery = videoGallery;
        this.online = online;
        this.friendsAmt = friendsAmt;
    }
}
