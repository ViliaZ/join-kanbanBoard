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

  public newBoardTitle: string = '';
  public activeNavItem: string = 'home';
  public openSettings: boolean = false;

  constructor(
    public authService: AuthServiceService, 
    public router: Router, 
    private eventEmitterService: EventemitterService) { }

  ngOnInit(): void {
  }

  handleNewBoardAdding(){
    this.eventEmitterService.onNewBoardAdding();    
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

  // inputfield: Add a new board
  async addNewBoard() {
  }


}
