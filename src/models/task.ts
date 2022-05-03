import { AuthServiceService } from "src/services/auth-service.service";

export class Task {
    public board: string;
    public title: string;
    public description: string;
    public category: string;
    public urgency: string;
    public dueTo: any; // date
    public responsibility: string;
    public createdAt: any; // date
    public creator: string;    // UID from user
    public isPinnedToBoard: boolean;


    // obj will be formData Object from newTask component
    constructor(private authService?: AuthServiceService, obj?: any) {
        this.board = obj ? obj.board : '';
        this.title = obj ? obj.title : '';
        this.description = obj ? obj.description : '';
        this.category = obj ? obj.category : '';
        this.urgency = obj ? obj.urgency : '';
        this.dueTo = obj ? obj.dueTo : '';
        this.responsibility = obj ? obj.responsibility : '' ;
        this.createdAt = obj ? obj.createdAt  : new Date();
        this.creator = obj ? obj.creator : this.authService?.currentUser.uid;
        this.isPinnedToBoard = obj ? obj.isPinnedToBoard : false;
    }

    public toJson() {
        return {
            board: this.board,
            title: this.title,
            description: this.description,
            category: this.category,
            urgency: this.urgency,
            dueTo: this.dueTo, 
            responsibility: this.responsibility,
            createdAt: this.createdAt,
            creator: this.creator,
            isPinnedToBoard: this.isPinnedToBoard
        }
    }

    // filled with default values of all properties
    // used to reset formData in newTask component
   getTaskTemplate(){
        return {
            title: '',
            description: '',
            dueTo: new Date(),
            urgency: 'normal',
            board: 'backlog',
            category: '',
            responsibility: 'Guest',
            isPinnedToBoard: 'false',
            createdAt: new Date(),
        }
    }
}
