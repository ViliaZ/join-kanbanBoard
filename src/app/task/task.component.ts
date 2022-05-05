import { BaseOverlayDispatcher } from '@angular/cdk/overlay/dispatchers/base-overlay-dispatcher';
import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';
import { LoginPageComponent } from '../login-page/login-page.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task: any;
  // public detailsRequested: boolean = false;

  constructor(
    private db: DatabaseService, 
    public tasksservice: TasksService) {
  }

  ngOnInit(): void {
  }

  // expandCard(task: any) {
  //   if (this.tasksservice.currentTask == task) {
  //     this.detailsRequested = false;
  //     this.tasksservice.currentTask = {};
  //   } else {
  //     this.tasksservice.currentTask = task;
  //     this.detailsRequested = true;
  //   }
  // }

  // handle click on Pin Icon
  async fixTaskToTop(task: any, event: any) {
    event.stopImmediatePropagation(); // prevent opening task popup on click on task
    if (!task.isPinnedToBoard) {
      this.db.updateDoc('tasks', task.customIdName, { 'isPinnedToBoard': true, 'createdAt': new Date().getTime() });
    } else {
      this.db.updateDoc('tasks', task.customIdName, { 'isPinnedToBoard': false });
    }
  }

  deleteTask(task: any, event: Event) {
    event.stopImmediatePropagation(); // prevent opening details view (card expansion)
    this.db.deleteDoc('tasks', task.customIdName)
  }

  editTask(task: any, event: Event) {
    console.log('task selected', task);

    event.stopImmediatePropagation();
    this.tasksservice.currentTask = task;
    this.tasksservice.taskPopupOpen = true;
    this.tasksservice.editMode = true;
  }

}
