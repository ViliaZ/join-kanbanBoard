import { Component, OnInit, OnChanges } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  public searchItemFound: boolean = false; // alerts if search doesnt find result
  public searchInput: string = '';
  public activeSearch: CallableFunction = () => {return (this.searchInput.length > 0) }
  public orderBacklogtasks: string = 'desc'

  constructor(public db: DatabaseService, public taskservice: TasksService) {
  }

  ngOnInit(): void {
    this.db.getBoardAndTaskData();   
  }

  // returns boolean
  evaluateSearchRequest(task: any): any {
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

  changeSorting() {
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

