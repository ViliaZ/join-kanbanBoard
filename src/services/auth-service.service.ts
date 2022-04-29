import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getAuth, signInAnonymously } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  // user: any = {
  //   "name": '',
  //   "email": '',
  //   "password": '',
  // }

  authentification = getAuth();
  isLoggedIn: boolean = false;
  isSignedIn: boolean = false;
  guestLoggedIn: boolean = false;


  constructor(private router: Router, public auth: AngularFireAuth) { }

  async createNewUser(email: string, password: string) {
    await this.auth.createUserWithEmailAndPassword(email, password)
      .then((res: any) => {
        this.isLoggedIn = true;
        
        localStorage.setItem('user', JSON.stringify(res.user))
        console.log(res);
        this.router.navigate([''])
      })
  }


  async login(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.user))
        console.log('neuer Login. User anonymous?', res.user?.isAnonymous, res.user?.email);
        this.router.navigate([''])
      })
      .catch((error) => {
        console.log('User data incorrrect, Please try again', error);
      });
  }


 async loginAsGuest() {
    await signInAnonymously(this.authentification)
      .then((res) => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user))
        console.log('neuer login. User anonymous?', res.user.isAnonymous);

        // result is: 
        this.guestLoggedIn = true;
        this.router.navigate([''])
      })
      .catch((error) => {
        console.error('error occurred:', error);

        alert('An error occured, please try again');
      });
  }


  async logout() {
    await this.auth.signOut().then(() => this.router.navigate(['/logout']));
    localStorage.removeItem('user');
  }


  //just set up to avoid error in forgot-pw comp
  ForgotPassword(passwordResetEmailvalue: any) { }

}
