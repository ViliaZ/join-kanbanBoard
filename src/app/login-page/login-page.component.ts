import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  constructor(private router: Router, public auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  login(form: any) {
    this.auth.signInWithEmailAndPassword(form.value.userEmail, form.value.userPassword).then(() => this.router.navigate(['']))  // navigate to dashboard
  }

}
