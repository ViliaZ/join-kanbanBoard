import { Component, OnInit, OnChanges } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  public searchInput: string = '';
  public activeSearch: CallableFunction = () => { return (this.searchInput.length > 3) }
  public orderBacklogtasks: string = 'desc'

  constructor(public db: DatabaseService, public taskservice: TasksService) {
    this.db.getBoardAndTaskData();  //Arguments possible: boardSorting + Order; TaskSorting + Order
  }

  ngOnInit(): void {
    this.db.getBoardAndTaskData();
  }

  evaluateSearchRequest(task: any): any {
    console.log('serach');
    
    let taskToString = JSON.stringify(task);
    let toLowerCaseString = taskToString.toLowerCase()
    return toLowerCaseString.includes(this.searchInput.toLowerCase())
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
      console.log( '11',this.orderBacklogtasks);

      this.orderBacklogtasks = 'asc';
      this.db.getBoardAndTaskData('createdAt', 'asc', 'dueTo', 'asc')  //Arguments: boardSorting + Order; TaskSorting + Order
    }
    else {
      console.log( '22',this.orderBacklogtasks);

      this.orderBacklogtasks = 'desc';
      this.db.getBoardAndTaskData('createdAt', 'asc', 'dueTo', 'desc')  //Arguments: boardSorting + Order; TaskSorting + Order
    }
  }


}

