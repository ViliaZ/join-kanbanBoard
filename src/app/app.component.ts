import { Component } from '@angular/core';
import { Routes, Router } from 'node_modules/@angular/router';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'join-kanbanBoard';

  constructor(private db: DatabaseService, public router: Router, public taskservice: TasksService) {
    this.db.getBoardAndTaskData;
    setTimeout(()=>{this.initializeBoards()},3000)
  }

  // only done ONCE - when first time adding a task in Join
  initializeBoards() {
    if (this.db.initializationDone() == undefined) {
      console.log('initialisierung done?:',this.db.initializationDone());
      
      this.db.addDocToCollection('boards', { name: 'todo', tasks: [], createdAt: new Date().getTime() })
    }
  }
  
  addTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }

}
