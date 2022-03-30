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

  constructor(public router: Router,  public taskservice: TasksService ) {
  
  }
  addTaskPopUp(){
    this.taskservice.taskPopupOpen = true;
  }

}
