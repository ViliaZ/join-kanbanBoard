import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from 'src/services/data.service';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  @Input() newTask: boolean | undefined;
  public closePopup: boolean = false;

  task: any = {
  };

  // via ngModel
  title: string = '';
  description: string = '';
  dueTo: any;
  urgency: string = '';
  board: string = '';
  category: string = '';
  users: any = '';

  constructor(public db: DatabaseService, public dataService: DataService, private taskservice: TasksService) { }

  ngOnInit(): void {
  }

  saveTask() {
    // fill the task object with input from ngModel
    this.task['ticketId'] = new Date().getTime();
    this.task['title'] = this.title;
    this.task['description'] = this.description;
    this.task['dueTo'] = this.dueTo;
    this.task['urgency'] = this.urgency;
    this.task['category'] = this.category;
    this.task['board'] = 'backlog';
    this.task['users'] = this.users;

    this.db.addDocToCollection('tasks', this.task)
    this.taskservice.taskPopupOpen = false;
  }

  closeWithoutSave() {
    this.taskservice.taskPopupOpen = false;
  }

}
