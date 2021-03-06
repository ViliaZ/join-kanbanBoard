
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
import { User } from 'src/models/user';


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
  private event$: any;  // events of routing
  public hideMobileMenu: boolean = true;
  public hamburgerMenuOpen: boolean = false;
  public mobile500: boolean = false;
  public currUser!: User | undefined;
  public usernameInitials: string = 'AB';

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
    this.getCurrUser();
    this.startBreakpointObserver();
  }

  getCurrUser() {
    this.authService.user$.subscribe(user => {
      this.currUser = user;
    })}

  startBreakpointObserver() {    // https://www.digitalocean.com/community/tutorials/angular-breakpoints-angular-cdk
    this.breakpointObserver
      .observe(['(max-width: 500px)','(min-width: 800px)'])
      .subscribe((state:any) => {
        if (state.breakpoints['(max-width: 500px)']){
          this.mobile500 = true;          
        }
        if (state.breakpoints['(min-width: 800px)']){
          this.hideMobileMenu = true;
          this.mobile500 = false;   
        }
         else {
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
    console.log('toggleUserSubMenu');
    this.openSettings = !this.openSettings;
  }

  openNewTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }

  toggleHelpSection(){
    this.taskservice.openHelp = !this.taskservice.openHelp;
    setTimeout(() => {
      this.hamburgerMenuOpen = false;
    }, 500);
  }

}
