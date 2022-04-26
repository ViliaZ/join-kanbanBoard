import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInAnonymously } from "firebase/auth";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  user: any = {
    "name": '',
    "email": '',
    "password": '',
  }

  authentification = getAuth();

  constructor(private router: Router, public auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  login(form: any) {
    this.auth.signInWithEmailAndPassword(form.value.userEmail, form.value.userPassword)
    .then((user) => {
      console.log('neuer Login. User anonymous?', user.user?.isAnonymous, user.user?.email);
      
      this.router.navigate([''])
    }) 
    .catch((error) => {
      console.log('User data incorrrect, Please try again', error);
    });
  }

  loginAsGuest() {
    signInAnonymously(this.authentification)
      .then((user) => {
        console.log('neuer login. User anonymous?', user.user.isAnonymous);

        // result is: 

        
        this.router.navigate([''])
      })
      .catch((error) => {
        console.error('error occurred:',error);
        
        alert('An error occured, please try again');
      });
  }

}
