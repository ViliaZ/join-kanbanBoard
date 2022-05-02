import { HttpClient } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  
  currentUser!: any;
  variable: string = '';
  currentDate: any = new Date().getTime();
  public amountUrgentTasks: any = '0'; // default
  public width: any = {  // width of bar diagrams
    allTasks: '0%',
    toDoTasks: '0%',
    backlogTasks: '0%'
  }

  constructor(
    public db: DatabaseService,
    public authService: AuthServiceService) {
      
     }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.db.getBoardAndTaskData();

    setTimeout(() => {
      // console.log('dashboard', this.db.guestIsInitialized);
      this.getCurrentStatistics();
    }, 2000)
  }

  
  getCurrentStatistics() {
    if (this.db.allTasks.length > 0) {
      this.width.allTasks = '100%';
      this.getWidthToDoTasks();
      this.getWidthBacklogTasks();
    }
  }

  getWidthToDoTasks() {
    if (this.db.todoTasks.length > 0) {
      let percentToDo = this.db.todoTasks.length * 100 / this.db.allTasks.length;
      this.width.toDoTasks = percentToDo + '%';
    }
  }

  getWidthBacklogTasks() {
    if (this.db.backlogtasks.length > 0) {
      let percentBacklog = this.db.backlogtasks.length * 100 / this.db.allTasks.length;
      this.width.backlogTasks = percentBacklog + '%';
    }
  }

}
