import { BaseOverlayDispatcher } from '@angular/cdk/overlay/dispatchers/base-overlay-dispatcher';
import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task: any;
  // public cardIsClicked: any = (task: any) => { return this.tasksservice.currentTask == task } // returns boolean for expand card or not
  public detailsRequested: boolean = false;
  public isPinned: boolean = false;


  constructor(private db: DatabaseService, public tasksservice: TasksService) {
  }

  ngOnInit(): void {
  }

  expandCard(task: any) {
    console.log('expandCard')

    if (this.tasksservice.currentTask == task) {
      this.detailsRequested = false;
      this.tasksservice.currentTask = {};
    }
    else {
      this.tasksservice.currentTask = task;
      this.detailsRequested = true;
    }
  }

  fixTaskToTop(task: any, event: any) {

    // let currentBoardIndex!: number;
    // this.db.boards.map((board: any, i: any) => {
    //   if (board.name == task.board) {
    //     currentBoardIndex = i }
    // })


    // let tasksArray = this.db.boards[currentBoardIndex].tasks;

    // console.log('currentBoardIndex:', currentBoardIndex);
    if (!task.isPinnedToBoard) {
      this.db.updateDoc('tasks', task.customIdName, { 'isPinnedToBoard': true, 'createdAt': new Date().getTime() });
    }
    else {
      this.db.updateDoc('tasks', task.customIdName, { 'isPinnedToBoard': false });
    }
  }

  deleteTask(task: any, event: Event) {
    event.stopImmediatePropagation(); // prevent opening details view (card expansion)
    this.db.deleteDoc('tasks', task.customIdName)
  }


  editTask(task: any, event: Event){
    event.stopImmediatePropagation();
    this.tasksservice.currentTask = task;
    this.tasksservice.taskPopupOpen = true;
    this.tasksservice.editMode = true;
  }

}
