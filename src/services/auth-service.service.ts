import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

//just set up to avoid error in forgot-pw comp
  ForgotPassword(passwordResetEmailvalue: any){}

}
