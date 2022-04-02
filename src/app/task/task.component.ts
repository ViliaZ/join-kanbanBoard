import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task:any;
  public cardIsClicked: any = (task: any)=>{ return this.tasksservice.currentTask == task} // returns boolean for expand card or not

  constructor(private db: DatabaseService, public tasksservice: TasksService) {
   }

  ngOnInit(): void {
  }



}
