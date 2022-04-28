import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/services/auth-service.service';

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

  constructor(public authService: AuthServiceService) { }

  ngOnInit(): void {
  }

  async onlogin(){
    await this.authService.login(this.user.email, this.user.password);
    if(this.authService.isLoggedIn){
      this.authService.isSignedIn = true;
    }
  }

  onloginAsGuest(){
    this.authService.loginAsGuest();
  }





}
