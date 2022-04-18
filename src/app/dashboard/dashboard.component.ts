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
  public nextDeadlineTasks: any = []; // contains all tasks with nearest Deadline
  public nextDeadlineTask: any = []; // first task of nextDeadlineTasks
  public nextDeadline: any;
  public width: any = {  // width of bar diagrams
    allTasks: '0%',
    toDoTasks: '0%',
    backlogTasks: '0%'
  }


  constructor(public db: DatabaseService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCurrentStatistics();
      this.getNextDeadlineTask();
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

  getNextDeadlineTask() {
    let temp: any = [];

    this.db.allTasks.forEach((task: any) => {
      temp.push(task.dueTo.toMillis());
    })
    let minDueDate: any = Math.min.apply(Math, temp); // finds minimum value in an array

    this.db.allTasks.forEach((task: any) => {
      if (task.dueTo.toMillis() == minDueDate) {
        this.nextDeadlineTasks.push(task);
      }
      this.nextDeadline = this.nextDeadlineTasks[0].dueTo.toMillis();
      this.nextDeadlineTask = this.nextDeadlineTasks[0];
    })
    console.log('this.nextDeadlineTasks', this.nextDeadlineTasks);
  }



}
