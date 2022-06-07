import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/models/user';
import { AuthServiceService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  public usernameFirstLetter: string = '';
  public currUser!: User;

  constructor(public authService: AuthServiceService) {}

  ngOnInit(): void {
    this.getCurrUser();
  }

  getCurrUser() {
    this.authService.user$.subscribe((user: any) => {
      this.currUser = user;
      if (!this.currUser || this.currUser?.displayName == 'Guest') {
        return;
      } else {
        this.getUserInitials();
      }
    });
  }

  getUserInitials() {
    this.usernameFirstLetter = this.currUser.displayName.substring(0, 1);
  }
}
