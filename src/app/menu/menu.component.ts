
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';
import { EventemitterService } from 'src/services/eventemitter.service';
import { TasksService } from 'src/services/tasks.service';
import {
  BreakpointObserver,
  BreakpointState
} from '@angular/cdk/layout';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  public currentDate: Date = new Date();
  public inputfieldExpanded: boolean = false;
  public newBoardTitle: string = '';
  public activeNavItem: string = 'home';
  public openSettings: boolean = false;
  public searchInput: string = '';  // search input for backlog in menu component 
  // private currentRoute: string;
  private event$: any;  // events of routing
  public hideMobileMenu: boolean = true;
  public hamburgerMenuOpen: boolean = false;

  constructor(
    public authService: AuthServiceService,
    public router: Router,
    private eventEmitterService: EventemitterService,
    public taskservice: TasksService,
    public db: DatabaseService,
    public breakpointObserver: BreakpointObserver) {
    this.getCurrentRoute();
  }

  ngOnInit(): void {
    this.startBreakpointObserver();
  }

  startBreakpointObserver() {    // https://www.digitalocean.com/community/tutorials/angular-breakpoints-angular-cdk
    this.breakpointObserver
      .observe(['(min-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.hideMobileMenu = true;
        } else {
          this.hideMobileMenu = false;
        }
      });
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  toggleHamburgerMenu() {
    this.hamburgerMenuOpen = !this.hamburgerMenuOpen;
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

  expandInputfield(){
    this.inputfieldExpanded = true;
  }

  resetInputfield() {
    this.searchInput = '';
  }

  handleNewBoardAdding(event: Event) {
    event.stopPropagation();
    this.eventEmitterService.onNewBoardAdding(this.newBoardTitle);
    this.newBoardTitle = '';
    this.inputfieldExpanded = false;
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
    this.openSettings = !this.openSettings;
  }

  openNewTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }

  toggleHelpSection(){
    this.taskservice.openHelp == false ? this.taskservice.openHelp = true : this.taskservice.openHelp = false;   
    setTimeout(() => {
      this.hamburgerMenuOpen = false;
    }, 500);
  }

}
