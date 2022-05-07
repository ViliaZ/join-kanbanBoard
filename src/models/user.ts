export class User {
    public uid: string;
    public email: string;
    public displayName?: string;
    public photoURL?: string;
    public emailVerified: boolean;
    public isAnonymous: boolean;
    public guestBoardsInitialized?: boolean;
    public isLoggedIn: boolean;
    public customCategories: [];  // user can create custom categories for their tasks

    constructor(obj?: any) {
        this.uid = obj ? obj.uid : '';
        this.email = obj ? obj.email : '';
        this.displayName = obj ? obj.displayName : '';
        this.photoURL = obj ? obj.photoURL : '';
        this.emailVerified = obj ? obj.emailVerified : '';
        this.isAnonymous = obj ? obj.isAnonymous : '';
        this.guestBoardsInitialized = obj ? obj.guestInitialized : '';
        this.isLoggedIn = obj ? obj.isLoggedIn : '';
        this.customCategories = obj ? obj.isLoggedIn : [];
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
            isLoggedIn: this.isLoggedIn,
            customCategories: this.customCategories
        }
    }
}
