export class Profile {
    public id: string | undefined;
    public username: string | undefined;
    public email: string | undefined;
    public imagePath: string | undefined;
    public location: string | undefined;
    public gender: string | undefined;
    public interest: string | undefined;
    public fullname: string | undefined;
    public creator: string | undefined;
    public friends?: [];
    public friendsAmt?: number | undefined;

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
                private tokenn?: string | undefined,
                private tokenExpirationDate?: Date
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
        this.tokenn = tokenn;
        this.tokenExpirationDate = tokenExpirationDate
    }
    get token() {
        if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
            return null;
        }
        return this.tokenn;
        }
}
