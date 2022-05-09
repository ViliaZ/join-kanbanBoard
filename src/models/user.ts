export class User {
    public uid: string;
    public email?: string;
    public displayName: string;
    public photoURL?: string;
    public emailVerified?: boolean;
    public isAnonymous: boolean;
    public guestBoardsInitialized?: boolean;
    public customCategories?: any;  // user can create custom categories for their tasks
    public lastlogin?: any; 

    constructor(obj?: any) {
        this.uid = obj ? obj.uid : '';
        this.email = obj.email ? obj.email : '';
        this.displayName = obj.displayName ? obj.displayName : '';
        this.photoURL = obj.photoURL ? obj.photoURL : '';
        this.emailVerified = obj.emailVerified ? obj.emailVerified : false;
        this.isAnonymous = obj.isAnonymous ? obj.isAnonymous : true;
        this.customCategories = obj.customCategories ? obj.customCategories : [];
        this.lastlogin = obj.lastlogin ? obj.lastlogin : new Date();
        this.guestBoardsInitialized = obj.guestBoardsInitialized ? obj.guestBoardsInitialized : false;
        }

    public toJson() {
        return {
            uid: this.uid,
            email: this.email,
            displayName: this.displayName,
            photoURL: this.photoURL,
            emailVerified: this.emailVerified,
            isAnonymous: this.isAnonymous,
            guestBoardsInitialized: this.guestBoardsInitialized,
            customCategories: this.customCategories,
            lastlogin: this.lastlogin
        }
    }
}
