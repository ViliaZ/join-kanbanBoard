import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  @Input() newTask: boolean | undefined;
  @ViewChild('catSelect') categorySelector: any;

  public closePopup: boolean = false;

  public customCategory: any = '';
  public openCategoryPopUp: boolean = false;
  public currentTask: any;


  // via ng Model
  public task: any = {
    title: '',
    description: '',
    dueTo!: '',
    urgency: '',
    board: '',
    category: '',
    users: ''
  }

  constructor(public db: DatabaseService, public taskservice: TasksService) {
    this.task = this.taskservice.currentTask;
  }

  ngOnInit(): void {
  }

  setUrgency(urgency: string = 'normal') {    // default: normal
    this.task.urgency = urgency;
  }

  saveCategory(event: any) {
    if (event.target.value == 'Custom Category') {
      this.openCategoryPopUp = true;
      event.target.value = '';
    }
    else {
      this.task.category = event.target.value;
    }
  }

  addCustomCategory() {
    this.db.categories.push(this.customCategory);
    this.task.category = this.customCategory;
    this.openCategoryPopUp = false;
  }

  closeCustomCategory() {
    this.customCategory = '';
    this.openCategoryPopUp = false;
  }

  saveTask(task:any) {
    console.log('editmode?',this.taskservice.editMode);
    console.log('currentTasks?',this.taskservice.currentTask);
    
    // fill the task object with input from ngModel
    if (!this.taskservice.editMode) {
      this.task.board = 'backlog'
      this.db.addDocToCollection('tasks', this.task);
    }
    else {
      this.task = this.taskservice.currentTask;
      this.db.updateDoc('tasks', this.task.customIdName, this.task)
      this.taskservice.currentTask = {};
      this.taskservice.editMode = false;
    }
    this.taskservice.taskPopupOpen = false;
  }


  closeWithoutSave() {
    this.taskservice.taskPopupOpen = false;
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }


}
