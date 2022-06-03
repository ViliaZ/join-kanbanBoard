import { HttpClient } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, OnChanges, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentDate: any = new Date().getTime();
  public percentage: any = {  // width of bar diagrams
    allTasks: '0%',
    toDoTasks: '0%',
    backlogTasks: '0%'
  }

  constructor(
    public db: DatabaseService,
    public authService: AuthServiceService) {
  }

  async ngOnInit() {
    await this.db.getBoardAndTaskData();
    this.calcStatistics();
    setTimeout(() => {
      this.calcStatistics();
    }, 1500);
  }

   calcStatistics() {
    this.getPercentAllTasks()
    this.getPercentToDoTasks();
    this.getPercentBacklogTasks();
    console.log(this.db.allTasks);
  }

  getPercentAllTasks() {
    if (this.db.allTasks.length > 0) {
      this.percentage.allTasks = '100%';
    }
  }

  getPercentToDoTasks() {
    if (this.db.todoTasks.length > 0) {
      let percentToDo = this.db.todoTasks.length * 100 / this.db.allTasks.length;
      this.percentage.toDoTasks = percentToDo + '%';
    }
  }

  getPercentBacklogTasks() {
    if (this.db.backlogtasks?.length > 0) {
      let percentBacklog = this.db.backlogtasks?.length * 100 / this.db.allTasks.length;
      this.percentage.backlogTasks = percentBacklog + '%';
    }
  }

}
