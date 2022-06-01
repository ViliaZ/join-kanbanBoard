import { Component, OnInit, OnChanges } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { EventemitterService } from 'src/services/eventemitter.service';
import { TasksService } from 'src/services/tasks.service';
import {
  BreakpointObserver,
  BreakpointState
} from '@angular/cdk/layout';
import { AlertService } from 'src/services/alert.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  public searchItemFound: boolean = false; // alerts if search doesnt find result
  public searchInput: string = '';  // search input in menu component 
  public activeSearch: CallableFunction = () => {return (this.searchInput.length > 0) }
  public orderBacklogtasks: string = 'desc';  // is toggled via menu component / eventemitter 
  public isMobile700: boolean = false;

  constructor(
    public db: DatabaseService, 
    public taskservice: TasksService,
    private eventEmitterService: EventemitterService, 
    public breakpointObserver: BreakpointObserver, 
    public alertService: AlertService) {
  }

  ngOnInit(): void {
    this.startBreakpointObserver();
    this.db.getBoardAndTaskData();   
    this.listenToEventEmitterSorting();
    this.listenToEventEmitterSearching();
  }

  startBreakpointObserver() {    // https://www.digitalocean.com/community/tutorials/angular-breakpoints-angular-cdk
    this.breakpointObserver
      .observe(['(max-width: 700px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile700 = true;
        } else {
          this.isMobile700 = false;
        }
      });
  }

  listenToEventEmitterSorting(){  
    console.log('BACKLOG: listenToEventEmitterSorting');
    if (this.eventEmitterService.subscription == undefined) {
      this.eventEmitterService.subscription = this.eventEmitterService.
      callBacklogSortEventHandler.subscribe(() => {
          this.toggleBacklogSorting();  // is called, if sorting in menu comp is requested
        }
        );
    }
  }

  listenToEventEmitterSearching(){  // search Input for find tasks in backlog
    console.log('BACKLOG: listenToEventEmitterSearching');
    // if (this.eventEmitterService.subscription == undefined) {
      this.eventEmitterService.subscription = this.eventEmitterService.
      callBacklogFilterEventHandler.subscribe((data: string) => {  
          this.searchInput = data;
        }
        );
    // }
  }

  // bound in template - gives back boolean for every rendered task
  isFilteredTask(task: any): any {
    console.log('BACKLOG: evaluateSearchRequest');
      let taskToString = JSON.stringify(task).toLowerCase();
      let searchItemFound = taskToString.includes(this.searchInput.toLowerCase());
      return searchItemFound  // boolean
  }

  moveToBoardToDo(idInFirestore: string) {
    this.db.updateDoc('tasks', idInFirestore, { board: 'ToDo' });
    this.alertService.setAlert("confirmMoveToToDo");
  }

  editTask(task: any) {
    this.taskservice.currentTask = task as Task;
    this.taskservice.taskPopupOpen = true;
    this.taskservice.editMode = true;
  }

  deleteTask(idInFirestore: string) {
    this.db.deleteDoc('tasks', idInFirestore);
    this.alertService.setAlert("confirmDeleteTask");

  }

  toggleBacklogSorting() {  // default is desc
    if (this.orderBacklogtasks == 'desc'){     
      console.log('sort!');
      
      this.orderBacklogtasks = 'asc';
      this.db.getBoardAndTaskData('createdAt', 'asc', 'dueTo', 'asc')  //Arguments: boardSorting + Order; TaskSorting + Order
    }
    else {
      console.log('sort2');

      this.orderBacklogtasks = 'desc';
      this.db.getBoardAndTaskData('createdAt', 'asc', 'dueTo', 'desc')  //Arguments: boardSorting + Order; TaskSorting + Order
    }
  }

}

