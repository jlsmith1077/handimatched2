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
                friendsAmt: number
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
    }
}
