export class Like {
   public username: string;
   public id: string;
   public mediaId?: string;
   constructor(
      username: string,
       id: string,
       mediaId: string, 
       ) {
        this.username = username;
        this.id = id;
        this.mediaId = mediaId
   }
}