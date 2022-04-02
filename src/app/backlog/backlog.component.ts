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
  backlogtasks: any = [];
  public backlogEmpty: boolean = false;

  constructor(public db: DatabaseService, public taskservice: TasksService) {
    this.db.getBoardAndTaskData();
    
    // this.showBacklogTasks();
    // this.backlogtasks = this.db.backlogtasks;
    // console.log('im constructor, this.db.backlogtasks', this.db.backlogtasks);
  }

  ngOnInit(): void {
    console.log(this.db.backlogtasks);

    if (this.db.backlogtasks == [] || this.db.backlogtasks == undefined) {
      this.backlogEmpty = true;
    }
  }


  evaluateSearchRequest(task: any) {
    console.log(this.db.backlogtasks)
    let taskToString = JSON.stringify(task);
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

