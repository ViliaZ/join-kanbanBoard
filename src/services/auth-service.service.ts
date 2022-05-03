import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, deleteUser, signInAnonymously, UserInfo, UserProfile, Auth, UserCredential } from "firebase/auth";
import { from, Observable, of } from 'rxjs';
import { User } from 'src/models/user';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  // create a reference to the current user, so that I can access his data easily again
  userRef!: AngularFirestoreDocument<any>; // will be initialized with change to LoginState
  currentUser: any = {};  // is given at monitorAuthState() with login
  auth: any = getAuth();  // Initialize Firebase Authentication and get a reference to the service
  coUsers: any = []; // not activly in use yet, holds all OTHER users connected to this board
  // users array is used in newTask component for-loop for template driven form

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
        if(user.isAnonymous){
          console.log('currentUser', this.currentUser);
        }
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
    this.userRef = this.firestore.doc(`users/${user.uid}`)  // create a reference to the current user, so that I can access his data easily again
    this.userRef.set(userData, { merge: true });   // If Doc does not exist, create new one. If it exists, then merge it
  };


  // Login and navigate to home page
  async login(email: string, password: string): Promise<void> {
    await this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {  // get User object: userCredential.user
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
        this.createDummyData();
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
      isAnonymous: 'true',
      displayName: 'Guest'
    }
    this.userRef = this.firestore.doc(`users/${user.uid}`)// create a reference to the current user, so that I can access his data easily again
    this.userRef.set(userData, { merge: true }); // If Doc does not exist, create new one. If it exists, then merge it
  }

  async logout(): Promise<void> {
    if (this.currentUser.isAnonymous) { // if guest, reset app to default state, delete guest from db
      console.log('yes, is anonymus, we have to delete data here');
      // await this.deleteUserFromFireAuth();
      // await this.deleteGuestDataFromDatabase();
    }
    await this.fireAuth.signOut()
      .then(() => this.router.navigate(['/login']));
  }

  async deleteUserFromFireAuth() {
    await this.auth.deleteUser(this.currentUser.uid)
      .then(() => {
        console.log('Successfully deleted guest');
      })
      .catch((error: any) => {
        console.log('Error deleting guest:', error);
      });
  }

  async deleteGuestDataFromDatabase() {

  }

  //just set up to avoid error in forgot-pw comp
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
