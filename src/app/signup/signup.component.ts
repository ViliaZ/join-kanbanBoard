import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  user: any = {
    "name": '',
    "email": '',
    "password": '',
  }

  constructor(public auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }

  createNewUser(form: any){
 
      this.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then((user:any) => {
        console.log(user);
        this.router.navigate([''])
      })
    }


  }

