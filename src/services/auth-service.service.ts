import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {
  getAuth,
  onAuthStateChanged,
  deleteUser,
  signInAnonymously,
  UserInfo,
  UserProfile,
  Auth,
  UserCredential,
  browserLocalPersistence,
  setPersistence,
  EmailAuthCredential,
} from 'firebase/auth';
import { BehaviorSubject, first, firstValueFrom, Observable } from 'rxjs';
import { User } from 'src/models/user';
import { Board } from 'src/models/board';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private auth: any = getAuth(); // Initialize Firebase Authentication and get a reference to the service
  static injector: Injector; // access AuthService in Model Class (e.g. Task) --> access this property
  private userRef!: AngularFirestoreDocument<any>; // will be initialized with change to LoginState
  public user!: User; // is given as User object after login
  public user$: BehaviorSubject<any> = new BehaviorSubject(null); // is given as BehaviorSubject after login
  public currentUser: any = {}; // is the firebase format user given at monitorAuthState() with login
  public userUid$: BehaviorSubject<string> = new BehaviorSubject('noUser');

  // not activly in use yet
  public coUsers: any = []; //holds all OTHER users connected to this board / coUsers array is used in newTask component for-loop for template driven form
  public loginAlert: boolean = false;

  // For dummyData:
  private today: Date = new Date();
  private futureDate: any = (date: Date, daysToCount: number) => {
    const today = new Date(date);
    const tomorrow = new Date(today.setDate(today.getDate() + daysToCount));
    return tomorrow;
  };

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private httpClient: HttpClient
  ) {
    this.monitorAuthState();
  }

  async monitorAuthState(): Promise<void> {
    await this.fireAuth.onAuthStateChanged(async (user) => {
      if (user) {
        this.userUid$.next(user.uid); // consider refactor, delete UserUid in favor of user$
        await this.updateUser$Data(user.uid); // when refreshig the page, dont loose access
        this.currentUser = user; // create a reference to the current user, so that I can access his data easily again
      } else {
        this.loginAlert = true;
      }
    });
  }

  async updateUser$Data(userUid: string) {
    let userDataInFirebase = await firstValueFrom(
      this.firestore.collection('users').doc(userUid).valueChanges()
    );
    this.user$.next(userDataInFirebase); // with refreshing page, dont loose reference to userData
  }

  async getCurrentUser(user: any): Promise<any> {
    return await firstValueFrom(
      this.firestore.collection('users').doc(user.uid).valueChanges()
    );
  }

  async createNewUser(
    email: string,
    password: string,
    name: string
  ): Promise<void> {
    setPersistence(this.auth, browserLocalPersistence) // read: https://jsmobiledev.com/article/firebase-auth-persistence/
      .then(() => {
        this.fireAuth
          .createUserWithEmailAndPassword(email, password)
          .then(async (userCredential: any) => {
            this.saveNewUserInDB(userCredential.user, name);
            await this.createStaticToDoBoard();
            await this.createDummyData();
            this.router.navigate(['']); // automatically logged in
          });
      });
  }

  saveNewUserInDB(user: any, name: string): void {
    // Creating new User Instance of User with user data from sign in with username/password */
    let userData = {
      uid: user.uid, // set the same ID in Database as fireAuth already given this user in fireAuth setup
      email: user.email,
      displayName: name, // get it from Inputfield on signUp
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
    };
    this.user = new User(userData); // assign it for later use in App
    this.user$.next(userData);
    let newSignUpUser = new User(userData).toJson(); // save to database in json-format:
    this.userRef = this.firestore.doc(`users/${user.uid}`); // create a reference to the current user, so that I can access his data easily again
    this.userRef.set(newSignUpUser, { merge: true }); // If Doc does not exist, create new one. If it exists, then merge it
  }

  async login(email: string, password: string): Promise<void> {
    await this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.router.navigate(['']);
      })
      .catch((error) => {
        alert('Login Data not correct. Please try again.');
        console.log('Login(): User data incorrrect, Please try again', error);
      });
  }

  async loginAsGuest(): Promise<void> {
    await signInAnonymously(this.auth)
      .then(async (userCredential) => {
        const userAlreadyExists = await this.checkIfUserAlreadyExists(
          userCredential.user.uid
        );
        if (userAlreadyExists == true) {
          console.log('An Error orrured. User already registered as guest.');
        } else {
          await this.saveGuestToDB(userCredential.user);
          await this.createStaticToDoBoard();
          await this.createDummyData();
        }
        this.router.navigate(['']);
      })
      .catch((error) => {
        alert('An error occured, please try again');
      });
  }

  async checkIfUserAlreadyExists(uid: string): Promise<boolean> {
    let checkIfUserExists = await firstValueFrom(
      this.firestore.collection('users').doc(uid).valueChanges()
    );
    if (checkIfUserExists) {
      return true;
    } else {
      return false;
    }
  }

  async saveGuestToDB(user: any) {
    // data to save for new Guest
    let userData = {
      uid: user.uid, // set the same ID in Database as fireAuth already given this user in fireAuth setup
      isAnonymous: user.isAnonymous,
      displayName: 'Guest',
    };

    // consider refactor / deleting the value "this.user" bc. we have user$
    this.user = new User(userData); // KEEP it!  for later use in app (we  need a version without toJson() there!)
    this.user$.next(userData);

    // save new guest data in DB
    let newGuest = new User(userData).toJson(); // save as Json Format to database
    this.userRef = this.firestore.doc(`users/${user.uid}`); // create a reference to the current user, so that I can access his data easily again
    this.userRef.set(newGuest, { merge: true }); // If Doc does not exist, create new one. If it exists, then merge it
  }

  async logout(): Promise<void> {
    await this.fireAuth.signOut().then(() => this.router.navigate(['/login']));
  }

  async deleteUserFromFireAuth() {
    await this.auth.currentUser.delete();
    await this.auth
      .deleteUser(this.currentUser.uid)
      .then(() => {
        console.log('Successfully deleted guest');
      })
      .catch((error: any) => {
        console.log('Error deleting guest:', error);
      });
  }

  // TODO - the function is set up to avoid error in forgot-pw component
  ForgotPassword(passwordResetEmailvalue: any) {}

  /******* DUMMY DATA FOR ALL USERS ***************/
  async createStaticToDoBoard() {
    // create initial ToDo Board --> always static for every user, cannot be deleted
    let currentUserUid = await firstValueFrom(this.userUid$);
    let newToDoBoard = Board.getEmptyBoard('ToDo', currentUserUid); // call a static function inside board.ts
    this.firestore.collection('boards').add(newToDoBoard);
  }

  async createDummyData(): Promise<void> {
    let dummyData$ = this.httpClient.get('assets/json/guestData.JSON');
    dummyData$.subscribe(async (jsonData: any) => {
      await this.setDummyBoards(jsonData.dummyBoards);
      await this.setDummyTasks(jsonData.dummyTasks);
    });
    this.userRef.set({ dummyDataCreated: true }, { merge: true }); // consider deleting this, if not needed
  }

  async setDummyBoards(dummmyBoards: any): Promise<void> {
    for (let i = 0; i < dummmyBoards.length; i++) {
      // modify static data with dynamic userdata
      dummmyBoards[i].createdAt = this.today;
      dummmyBoards[i].creator = this.currentUser.uid;
      await this.firestore.collection('boards').add(dummmyBoards[i]);
    }
  }

  async setDummyTasks(dummmyTasks: any) {
    let daysFromNow = 1;
    for (let i = 0; i < dummmyTasks.length; i++) {
      // modify static data with dynamic userdata
      dummmyTasks[i].creator = this.currentUser.uid;
      dummmyTasks[i].createdAt = this.today;
      dummmyTasks[i].dueTo = this.futureDate(this.today, daysFromNow);
      daysFromNow++;
      await this.firestore.collection('tasks').add(dummmyTasks[i]);
    }
  }
}
