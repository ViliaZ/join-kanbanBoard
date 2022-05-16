import { Component, OnInit, OnChanges } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { EventemitterService } from 'src/services/eventemitter.service';
import { TasksService } from 'src/services/tasks.service';

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

  constructor(
    public db: DatabaseService, 
    public taskservice: TasksService,
    private eventEmitterService: EventemitterService) {
  }

  ngOnInit(): void {
    this.db.getBoardAndTaskData();   
    this.listenToEventEmitterSorting();
    this.listenToEventEmitterSearching();
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
  }

  editTask(task: any) {
    console.log('this task is edited', task);
    this.taskservice.currentTask = task as Task;
    this.taskservice.taskPopupOpen = true;
    this.taskservice.editMode = true;
  }

  deleteTask(idInFirestore: string) {
    this.db.deleteDoc('tasks', idInFirestore);
  }

  toggleBacklogSorting() {  // default is desc
    if (this.orderBacklogtasks == 'desc'){     
      this.orderBacklogtasks = 'asc';
      this.db.getBoardAndTaskData('createdAt', 'asc', 'dueTo', 'asc')  //Arguments: boardSorting + Order; TaskSorting + Order
    }
    else {
      this.orderBacklogtasks = 'desc';
      this.db.getBoardAndTaskData('createdAt', 'asc', 'dueTo', 'desc')  //Arguments: boardSorting + Order; TaskSorting + Order
    }
  }

}

