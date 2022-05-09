import { AuthServiceService } from "src/services/auth-service.service";

export class Task {
    // workaround for using AuthService without constructor-DependencyInjection in a Model Class (see 2.Answer: https://stackoverflow.com/questions/41432388/how-to-inject-service-into-class-not-component)
    private service: AuthServiceService = AuthServiceService.injector.get(AuthServiceService);

    public board: string;
    public title: string;
    public description: string;
    public category: string;
    public urgency: string;
    public dueTo: any; // date
    public responsibility: string;
    public createdAt: any; // date
    public creator: string; // UID from user
    public isPinnedToBoard?: boolean;
    public customIdName: string;
    public uncheckedTodos?: string[] | undefined;
    public checkedTodos?: string[] | undefined;;

    // Statistics
    public allTodos?: number | undefined;
    public percentUncheckedTodos?: number | undefined;
    public percentCheckedTodos?: number | undefined;



    // Obj e.g. will be formData Object from newTask component
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
        this.customIdName = obj ? obj.customIdName : '';
        this.allTodos = obj ? obj.allTodos : 0;
        this.uncheckedTodos = obj ? obj.uncheckedTodos : [];
        this.checkedTodos = obj ? obj.checkedTodos : [];
        this.percentUncheckedTodos = obj ? obj.percentUncheckedTodos : 0;
        this.percentCheckedTodos = obj ? obj.percentCheckedTodos : 0;
        this.calculateStats();
    }

    private calculateStats(){
        if(this.uncheckedTodos && this.checkedTodos){
            this.allTodos = this.uncheckedTodos.length + this.checkedTodos.length;
            this.percentUncheckedTodos = this.uncheckedTodos.length/this.allTodos * 100;
            this.percentCheckedTodos = this.checkedTodos.length/this.allTodos * 100;    
        }
    }

    /**
     * Transform task properties to  Json Format for communication with backend / Firebase
     * Static Methodcan call be called without instanciating a new Task() --> Task.getTaskTemplate()
     * @returns new Task() as Json
     */
    public toJson() {
        return {
            board: this.board,
            title: this.title,
            description: this.description,
            allTodos: this.allTodos,
            uncheckedTodos: this.uncheckedTodos,
            checkedTodos: this.checkedTodos,
            percentUncheckedTodos: this.percentUncheckedTodos, 
            percentCheckedTodos: this.percentCheckedTodos, 
            category: this.category,
            urgency: this.urgency,
            dueTo: this.dueTo,
            responsibility: this.responsibility,
            createdAt: this.createdAt,
            creator: this.creator,
            isPinnedToBoard: this.isPinnedToBoard,
            customIdName: this.customIdName
        }
    }

    /**
     * Empty new Task as Template for New Task component
     * Static Methodcan call be called without instanciating a new Task() --> Task.getTaskTemplate()
     * @returns new Task() as Json
     */
    static getTaskTemplate() { 
        return {
            title: '',
            description: '',
            uncheckedTodos: [],
            allTodos: 0,
            checkedTodos: [],
            createdAt: new Date(),
            dueTo: new Date(),
            urgency: 'medium',
            board: 'backlog',
            category: '',
            responsibility: 'Guest',
            isPinnedToBoard: false,
            customIdName: '',
        }
    }

    /**
     * For Editmode:  dueDate Format is in correct form to be used as input for Datepicker
     * @returns new Task as Json
     * 
     */
    getEditmodeTask() {
        return {
            board: this.board,
            title: this.title,
            description: this.description,
            uncheckedTodos: this.uncheckedTodos,
            checkedTodos: this.checkedTodos,
            allTodos: this.allTodos,
            percentUncheckedTodos: this.percentUncheckedTodos, 
            percentCheckedTodos: this.percentCheckedTodos, 
            category: this.category,
            urgency: this.urgency,
            dueTo: new Date(this.dueTo),
            responsibility: this.responsibility,
            createdAt: this.createdAt,
            creator: this.creator,
            isPinnedToBoard: this.isPinnedToBoard,
            customIdName: this.customIdName
        }
    }
}
