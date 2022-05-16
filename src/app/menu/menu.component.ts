import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';
import { EventemitterService } from 'src/services/eventemitter.service';
import { TasksService } from 'src/services/tasks.service';

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
  public searchInput: string = '';  // search input for backlog in menu component 
  // private currentRoute: string;
  private event$: any;  // events of routing

  constructor(
    public authService: AuthServiceService,
    public router: Router,
    private eventEmitterService: EventemitterService,
    private taskservice: TasksService,
    public db: DatabaseService) {
    this.getCurrentRoute();
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  ngOnInit(): void {
    // console.log(this.router.isActive('/backlog', true));
  }

  getCurrentRoute() {
    this.event$ = this.router.events
      .subscribe(
        (event: any) => {
          if (event.url == '/backlog') {
            this.resetInputfield();
          }
        });
  }

  resetInputfield() {
    this.searchInput = '';
  }

  stopPropagation(event: Event) {
    console.log(event);
    event.stopImmediatePropagation();
  }

  handleNewBoardAdding() {
    this.eventEmitterService.onNewBoardAdding(this.newBoardTitle);
    this.newBoardTitle = '';
  }

  handleBacklogSorting() {
    this.eventEmitterService.onBacklogSorting('emit');
  }

  handleBacklogFiltering(change?: string) {
    console.log('backlog Filter requested / searched is:', change);
    this.eventEmitterService.onBacklogFiltering(this.searchInput);
  }

  async onLogout() {
    if (this.authService.currentUser.isAnonymous) {
      await this.authService.deleteUserFromFireAuth();
      // delete from user collection
      // await this.db.deleteDoc('users', this.authService.currentUser.uid)   
      // delete Tasks on every Board
    }
    // delete all Board Collections if not already automatically 
  }


  toggleUserSubMenu() {
    if (this.openSettings) {
      this.openSettings = false
    }
    else {
      this.openSettings = true;
    }
  }

  newTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }

}
