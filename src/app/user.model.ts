export class User {
    constructor(public email: string,
                public id: string,
                public username: string,
                private tokenn: string,
                private tokenExpirationDate: Date ) {}

get token() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
        return null;
    }
    return this.tokenn;
    }
}
