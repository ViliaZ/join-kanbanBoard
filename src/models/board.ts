import { AuthServiceService } from "src/services/auth-service.service";

export class Board {
    public name: string;
    public users: [];
    public createdAt: any; // date
    public creator: string;    // UID from user



    // obj will be formData Object
    constructor(private authService: AuthServiceService, obj?: any) {
        this.name = obj ? obj.name : '';
        this.users = obj ? obj.users : [] ;
        this.createdAt = obj ? obj.createdAt  : new Date();
        this.creator = obj ? obj.creator : this.authService.currentUser.uid;
    }

    public toJson() {
        return {
            name: this.name,
            users: this.users,
            createdAt: this.createdAt,
            creator: this.creator,
        }
    }
}
