import { AuthServiceService } from "src/services/auth-service.service";

export class Task {
    // workaround for using AuthService without constructor-DependencyInjection in a Model Class (see 2.Answer: https://stackoverflow.com/questions/41432388/how-to-inject-service-into-class-not-component)
    service: AuthServiceService = AuthServiceService.injector.get(AuthServiceService);

    public board: string;
    public title: string;
    public description: string;
    public category: string;
    public urgency: string;
    public dueTo: any; // date
    public responsibility: string;
    public createdAt: any; // date
    public creator: string; // UID from user
    public isPinnedToBoard: boolean;



    // obj will be formData Object from newTask component
    constructor(obj?: any) {
        this.board = obj ? obj.board : '';
        this.title = obj ? obj.title : '';
        this.description = obj ? obj.description : '';
        this.category = obj ? obj.category : '';
        this.urgency = obj ? obj.urgency : '';
        this.dueTo = obj ? obj.dueTo : new Date();
        this.responsibility = obj ? obj.responsibility : '';
        this.createdAt = obj ? obj.createdAt : new Date();
        this.isPinnedToBoard = obj ? obj.isPinnedToBoard : false;
        this.creator = this.service.currentUser.uid;
    }

    // transform task properties to valid Json Format for communication with backend / Firebase
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

    // used to reset formData in newTask component
  static getTaskTemplate() {  // Static --> I can call this function without instanciating a new Task(); call it by saying: Task.getTaskTemplate()
        return {
            title: '',
            description: '',
            createdAt: new Date(),
            dueTo: new Date(),
            urgency: 'normal',
            board: 'backlog',
            category: '',
            responsibility: 'Guest',
            isPinnedToBoard: 'false',
        }
    }
}
