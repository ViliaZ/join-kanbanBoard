import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  variable: string = '';
  currentDate: any = new Date().getTime();
  public amountUrgentTasks: any = '0'; // default
  public width: any = {  // width of bar diagrams
    allTasks: '0%',
    toDoTasks: '0%',
    backlogTasks: '0%'
  }


  constructor(public db: DatabaseService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCurrentStatistics();
    }, 3000)
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
