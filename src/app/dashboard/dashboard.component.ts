import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public currUser!: any;
  public currentDate: any = new Date().getTime();
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
    this.getCurrUser();
    this.calcStatistics();
    setTimeout(() => { this.calcStatistics() }, 1500);
  }

  getCurrUser(){
    this.authService.user$.subscribe((result: any) => {
      this.currUser = result;
    });
  }

   calcStatistics() {
    this.getPercentAllTasks()
    this.getPercentInProgressTasks();
    this.getPercentBacklogTasks();
  }

  getPercentAllTasks() {
    if (this.db.allTasks.length > 0) {
      this.percentage.allTasks = '100%';
    }
  }

  getPercentInProgressTasks() {
    let inProgressTasksAmount= (this.db.allTasks.length - this.db.backlogtasks?.length);
      let percentInProgress = inProgressTasksAmount * 100 / this.db.allTasks.length;
      this.percentage.toDoTasks = percentInProgress + '%';  // variable  umbenennen in inprogress in db (ist nicht mehr Todo)    
  }

  getPercentBacklogTasks() {
    if (this.db.backlogtasks?.length > 0) {
      let percentBacklog = this.db.backlogtasks?.length * 100 / this.db.allTasks.length;
      this.percentage.backlogTasks = percentBacklog + '%';
    }
  }

}
