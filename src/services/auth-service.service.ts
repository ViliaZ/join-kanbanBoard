import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, deleteUser, signInAnonymously, UserInfo, UserProfile, Auth, UserCredential } from "firebase/auth";
import { User } from 'src/models/user';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  // access AuthService in Model Class (e.g. Task) --> access this property
  static injector: Injector;

  // create a reference to the current user, so that I can access his data easily again
  userRef!: AngularFirestoreDocument<any>; // will be initialized with change to LoginState
  user$!: User; // is given as User object after login
  currentUser: any = {};  // is the firebase format user given at monitorAuthState() with login
  auth: any = getAuth();  // Initialize Firebase Authentication and get a reference to the service
  coUsers: any = []; // not activly in use yet, holds all OTHER users connected to this board
  // coUsers array is used in newTask component for-loop for template driven form

  // For dummyData:
  today: Date = new Date();
  futureDate: any = (date: Date, daysToCount: number) => {
    const today = new Date(date)
    const tomorrow = new Date(today.setDate(today.getDate() + daysToCount))
    return tomorrow
  }

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private httpClient: HttpClient) {
    this.monitorAuthState();
  }

  // initialized as soon as App starts
  async monitorAuthState(): Promise<void> {  // triggered: login / logout
    await this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;  // create a reference to the current user, so that I can access his data easily again
        if (user.isAnonymous) {
          console.log('user.isAnonymous (Guest):', this.currentUser);
        }
      }
      else {  // if no user at all , then returns NULL
        // alert('no user found. Return to login')
        console.log('TestAccount Logged In', user);
      }
    })
  }



  

  // automatically user will also be logged in afterwards
  async createNewUser(email: string, password: string, name: string): Promise<void> {
    await this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential: any) => {  // usercredential contains all infos, .user is userInfo
        this.saveUserInDatabase(userCredential.user, name);
        // this.addNewUserToCollection()
        this.router.navigate([''])
      })
  }

  /* Creating new User Instance of User with user data from sign in with username/password */
  saveUserInDatabase(user: any, name: string): void {
    let userData = {
      uid: user.uid,  // set the same ID in Database as fireAuth already given this user in fireAuth setup
      email: user.email,
      displayName: name,  // got it from Inputfield on signUp
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
    }
    this.user$ = new User(userData);  // assign it for later use in App
    let newSignUpUser = new User(userData).toJson();      // save to database in json-format:
    this.userRef = this.firestore.doc(`users/${user.uid}`)  // create a reference to the current user, so that I can access his data easily again
    this.userRef.set(newSignUpUser, { merge: true });   // If Doc does not exist, create new one. If it exists, then merge it
  };


  // Login and navigate to home page
  async login(email: string, password: string): Promise<void> {
    await this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {  // get User object: userCredential.user
        console.log('userCredential',userCredential);
        console.log('this.user after login',this.user$);
        
        // this.user$ = new User(userCredential);
        this.router.navigate(['']);
      })
      .catch((error) => {
        console.log('Login(): User data incorrrect, Please try again', error);
      });
  }

  async loginAsGuest(): Promise<void> {
    await signInAnonymously(this.auth)  // function provided by firestore
      .then(async (userCredential) => {
        await this.saveGuestToDatabase(userCredential.user);
        await this.createDummyData();
        this.router.navigate([''])
      })
      .catch((error) => {
        console.error('LoginAsGuest():error occurred:', error);
        alert('An error occured, please try again');
      });
  }

  async saveGuestToDatabase(user: any) {
    let userData = {
      uid: user.uid,  // set the same ID in Database as fireAuth already given this user in fireAuth setup
      isAnonymous: user.isAnonymous,
      displayName: 'Guest'
    }
    this.user$ = new User(userData); // KEEP it!  for later use in app (we  need a version without toJson() there!)
    let newGuest = new User(userData).toJson();  // save as Json Format to database
    this.userRef = this.firestore.doc(`users/${user.uid}`)// create a reference to the current user, so that I can access his data easily again
    this.userRef.set(newGuest, { merge: true }); // If Doc does not exist, create new one. If it exists, then merge it
  }

  async logout(): Promise<void> {
    await this.fireAuth.signOut()
    .then(() => this.router.navigate(['/login']));
  }

  async deleteUserFromFireAuth() {
    await this.auth.currentUser.delete();
    await this.auth.deleteUser(this.currentUser.uid)
      .then(() => {
        console.log('Successfully deleted guest');
      })
      .catch((error: any) => {
        console.log('Error deleting guest:', error);
      });
  }


  // TODO - the function is set up to avoid error in forgot-pw component
  ForgotPassword(passwordResetEmailvalue: any) { }


  /******* DUMMY DATE FOR GUEST USERS ***************/

  async createDummyData(): Promise<void> {
    let dummyData$ = this.httpClient.get('assets/json/guestData.JSON');
    dummyData$.subscribe(async (jsonData: any) => {
      await this.setDummyBoards(jsonData.dummyBoards);
      await this.setDummyTasks(jsonData.dummyTasks);
    })
    this.userRef.set({ guestBoardsInitialized: true }, { merge: true }) // consider deleting this, if not needed
  }

  async setDummyBoards(dummmyBoards: any): Promise<void> {
    for (let i = 0; i < dummmyBoards.length; i++) {  // modify static data with dynamic userdata
      dummmyBoards[i].createdAt = this.today;
      dummmyBoards[i].creator = this.currentUser.uid;
      await this.firestore.collection('boards').add(dummmyBoards[i]);
    }
  }

  async setDummyTasks(dummmyTasks: any) {
    let daysFromNow = 1;
    for (let i = 0; i < dummmyTasks.length; i++) { // modify static data with dynamic userdata
      dummmyTasks[i].creator = this.currentUser.uid;
      dummmyTasks[i].createdAt = this.today;
      dummmyTasks[i].dueTo = this.futureDate(this.today, daysFromNow);
      daysFromNow++
      await this.firestore.collection('tasks').add(dummmyTasks[i]);
    }
  }
}
