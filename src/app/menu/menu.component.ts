import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';
import { EventemitterService } from 'src/services/eventemitter.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  public currentDate: Date = new Date();
  public expandInputfield: boolean = false;
  public newBoardTitle: string = '';
  public activeNavItem: string = 'home';
  public openSettings: boolean = false;

  constructor(
    public authService: AuthServiceService, 
    public router: Router, 
    private eventEmitterService: EventemitterService) { }

  ngOnInit(): void {
  }

  stopPropagation(event: Event) {
    console.log(event);
    event.stopImmediatePropagation();
  }

  handleNewBoardAdding(){
    this.eventEmitterService.onNewBoardAdding(this.newBoardTitle);   
    this.newBoardTitle = ''; 
  }

  onLogout() {
    this.authService.logout();
  }

  toggleSettings() {
    if (this.openSettings) {
      this.openSettings = false
    }
    else {
      this.openSettings = true;
    }
  }

  newTaskPopUp() { }

}
