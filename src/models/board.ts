import { AuthServiceService } from "src/services/auth-service.service";

export class Board {

    // workaround for using AuthService without constructor-DependencyInjection in a Model Class (see 2.Answer: https://stackoverflow.com/questions/41432388/how-to-inject-service-into-class-not-component)
    private service: AuthServiceService = AuthServiceService.injector.get(AuthServiceService);

    public name: string;
    public createdAt: any; // date
    public creator = this.service.currentUser.uid // UID from user
    public editable!: boolean;
    public tasks!: [];


    // obj will be formData Object
    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.createdAt = obj ? obj.createdAt  : new Date();
        this.creator = this.service.currentUser.uid;
        this.editable = obj ? obj.editable : true
        this.tasks = obj ? obj.tasks : [];
    }

    public toJson() {
        return {
            name: this.name,
            createdAt: this.createdAt,
            creator: this.creator,
            editable: this.editable,
            tasks: this.tasks
        }
    }

    static getEmptyBoard(boardName: string, creatorUiD: string){
        return {
            name: boardName,
            createdAt: new Date().getTime(),
            creator: creatorUiD,
            editable: true,
            tasks: []
        }
    }
}
