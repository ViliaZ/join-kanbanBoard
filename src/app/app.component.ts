import { Component, OnInit } from '@angular/core';
import { Router } from 'node_modules/@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'join-kanbanBoard';


  constructor(
    private db: DatabaseService,
    public router: Router, 
    public taskservice: TasksService, 
    public authService: AuthServiceService) 
    { this.db.getBoardAndTaskData  }

  ngOnInit() {

    // check if user is signed in
    if (localStorage.getItem('user') !== null) {
      this.authService.isSignedIn = true;
    }
    else { this.authService.isSignedIn = false}
  }

  newTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }

}
