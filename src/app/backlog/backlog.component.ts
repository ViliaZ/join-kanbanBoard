import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { EventemitterService } from 'src/services/eventemitter.service';
import { TasksService } from 'src/services/tasks.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AlertService } from 'src/services/alert.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss'],
})
export class BacklogComponent implements OnInit {
  public searchItemFound: boolean = false; // alerts if search doesnt find result
  public searchInput: string = ''; // search input in menu component
  public activeSearch: CallableFunction = () => { return this.searchInput.length > 0; };
  public orderBacklogtasks: string = 'desc'; // is toggled via menu component / eventemitter
  public isMobile700: boolean = false;

  constructor(
    public db: DatabaseService,
    public taskservice: TasksService,
    private eventEmitterService: EventemitterService,
    public breakpointObserver: BreakpointObserver,
    public alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.startBreakpointObserver();
    this.db.getBoardAndTaskData();
    this.listenToEventEmitterSorting();
    this.listenToEventEmitterSearching();
  }

  startBreakpointObserver() {  // https://www.digitalocean.com/community/tutorials/angular-breakpoints-angular-cdk
    this.breakpointObserver
      .observe(['(max-width: 700px)'])
      .subscribe((state: BreakpointState) => {
       state.matches ? this.isMobile700 = true : this.isMobile700 = false;
      });
  }

  listenToEventEmitterSorting() {
    if (!this.eventEmitterService.subscription) { // if undefined
      this.eventEmitterService.subscription =
        this.eventEmitterService.callBacklogSortEventHandler.subscribe(() => {
          this.toggleBacklogSorting(); // is called, if sorting in menu comp is requested
        });
    }
  }

  listenToEventEmitterSearching() {
    this.eventEmitterService.subscription =
      this.eventEmitterService.callBacklogFilterEventHandler.subscribe(
        (data: string) => {this.searchInput = data;});
  }

  isFilteredTask(task: any): Boolean {
    let taskToString = JSON.stringify(task).toLowerCase();
    let searchItemIsFound = taskToString.includes(this.searchInput.toLowerCase());
    return searchItemIsFound; 
  }

  moveToBoardToDo(idInFirestore: string): void {
    this.db.updateDoc('tasks', idInFirestore, { board: 'ToDo' });
    this.alertService.setAlert('confirmMoveToToDo');
  }

  editTask(task: any): void {
    this.taskservice.currentTask = task as Task;
    this.taskservice.taskPopupOpen = true;
    this.taskservice.editMode = true;
  }

  deleteTask(idInFirestore: string): void {
    this.db.deleteDoc('tasks', idInFirestore);
    this.alertService.setAlert('confirmDeleteTask');
  }

  toggleBacklogSorting(): void {
    // default: descending ('desc')
    if (this.orderBacklogtasks == 'desc') {
      this.orderBacklogtasks = 'asc';
      this.db.getBoardAndTaskData('createdAt', 'asc', 'dueTo', 'asc'); //Arguments: boardSorting + Order; TaskSorting + Order
    } else {
      this.orderBacklogtasks = 'desc';
      this.db.getBoardAndTaskData('createdAt', 'asc', 'dueTo', 'desc'); //Arguments: boardSorting + Order; TaskSorting + Order
    }
  }

  trackByIndex(index: any) {
    return index;
  }
}
