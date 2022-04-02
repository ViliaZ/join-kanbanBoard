import { Component, OnInit, OnChanges } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  searchInput: string = '';
  public activeSearch: CallableFunction = () => {return (this.searchInput.length > 3)}


  constructor(public db: DatabaseService, public taskservice: TasksService) {
    this.db.getBoardAndTaskData();
  
  }

  ngOnInit(): void {
  }

  evaluateSearchRequest(task:any): any {
      let taskToString = JSON.stringify(task);
      console.log('yes');
      return taskToString.includes(this.searchInput)
  }

  moveToBoardToDo(idInFirestore: string) {
    this.db.updateDoc('tasks', idInFirestore, { board: 'todo' });
  }

  editTask(task: any) {
    this.taskservice.currentTask = task;
    this.taskservice.taskPopupOpen = true;
    this.taskservice.editMode = true;
  }

  deleteTask(idInFirestore: string) {
    this.db.deleteDoc('tasks', idInFirestore);
  }




}

