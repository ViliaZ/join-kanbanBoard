import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signInAnonymously, UserInfo, UserProfile } from "firebase/auth";
import { Observable } from 'rxjs';
import { User } from 'src/models/user';
import { DatabaseService } from './database.service';
import { TasksService } from './tasks.service';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  // create a reference to the current user, so that I can access his data easily again
  userRef!: AngularFirestoreDocument<any>; // will be initialized with change to LoginState
  currentUser: any = {};  // is given at monitorAuthState() with login
  auth: any = getAuth();  // Initialize Firebase Authentication and get a reference to the service

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
    private httpClient: HttpClient,
    private db: DatabaseService) {
    this.monitorAuthState();
  }

  // initialized as soon as App starts
  async monitorAuthState(): Promise<void> {  // triggered: login / logout
    await this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        // create a reference to the current user, so that I can access his data easily again
        this.currentUser = user;
        console.log('Monitor AuthStatus: user logged in', user);
      }
      else {  // if no user, then returns NULL
        console.log('Monitor AuthStatus: No user or user logged out', user);
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
    // set Document user ID the same as UID that is given in FireAuth! for easy access to identify the right user
    let userData = {
      uid: user.uid,  // set the same ID in Database as fireAuth already given this user in fireAuth setup
      email: user.email,
      displayName: name,  // got it from Inputfield on signUp
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
    }
    // create a reference to the current user, so that I can access his data easily again
    this.userRef = this.firestore.doc(`users/${user.uid}`)
    // If Doc does not exist, create new one. If it exists, then merge it
    this.userRef.set(userData, { merge: true });
  };


  // Login and navigate to home page
  async login(email: string, password: string): Promise<void> {
    await this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // get User object: userCredential.user
        console.log('Login(): User successfully logged in', userCredential.user);
        this.router.navigate(['']);
      })
      .catch((error) => {
        console.log('Login(): User data incorrrect, Please try again', error);
      });
  }

  async loginAsGuest(): Promise<void> {
    await signInAnonymously(this.auth)
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
    // set Document user ID the same as UID that is given in FireAuth! for easy access to identify the right user
    let userData = {
      uid: user.uid,  // set the same ID in Database as fireAuth already given this user in fireAuth setup
      isAnonymous: 'true',
    }
    // create a reference to the current user, so that I can access his data easily again
    this.userRef = this.firestore.doc(`users/${user.uid}`)
    // If Doc does not exist, create new one. If it exists, then merge it
    this.userRef.set(userData, { merge: true });
  }

  async logout(): Promise<void> {
    await this.fireAuth.signOut()
      .then(() => this.router.navigate(['/login']));
  }

  //just set up to avoid error in forgot-pw comp
  ForgotPassword(passwordResetEmailvalue: any) { }


  /******* SET UP DUMMY DATA WITH GUEST LOGIN ****/

  async createDummyData(): Promise<void> {
    let dummyData$ = this.httpClient.get('assets/json/guestData.JSON');
    dummyData$.subscribe(async (jsonData: any) => {
      await this.setDummyBoards(jsonData.dummyBoards);
      await this.setDummyTasks(jsonData.dummyTasks);
    })
    this.userRef.set({guestBoardsInitialized: true}, { merge: true })
  }

  async setDummyBoards(dummmyBoards: any): Promise<void> {
    for (let i = 0; i < dummmyBoards.length; i++) {
      dummmyBoards[i].createdAt = this.today;
      await this.db.addDocToCollection('boards', dummmyBoards[i]);
    }
  }

  async setDummyTasks(dummmyTasks: any) {
    // dynamically adjust JSON data (dueDates) to always get some dummydata in the future, so we never have tasks in the past
    let daysFromNow = 1;
    for (let i = 0; i < dummmyTasks.length; i++) {
      dummmyTasks[i].createdAt = this.today;
      dummmyTasks[i].dueTo = this.futureDate(this.today, daysFromNow);
      daysFromNow++
      await this.db.addDocToCollection('tasks', dummmyTasks[i]);
    }
  }
}
