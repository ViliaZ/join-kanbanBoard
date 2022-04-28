import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';

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

  constructor(public authService: AuthServiceService, private router: Router) { }

  ngOnInit(): void {
  }

  async onSignUp(){
    await this.authService.createNewUser(this.user.email, this.user.password);
    if(this.authService.isLoggedIn){
      this.authService.isSignedIn = true;
    }
  }


  }

