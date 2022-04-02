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
    this.initializeBoards();
    this.task = this.taskservice.currentTask;
  }

  ngOnInit(): void {

  }

  initializeBoards(){
    if(!this.db.initializationDone){
      // this.db.addDocToCollection('boards',{name:'backlog', tasks:[]})
      this.db.addDocToCollection('boards',{name:'todo', tasks:[]})
    }
  }

  //if a task is edited, the form is filled with this content

  saveTask() {

    // fill the task object with input from ngModel
    if (!this.taskservice.editMode) {
      this.task.board = 'backlog'
    }

    this.db.addDocToCollection('tasks', this.task);
    this.taskservice.taskPopupOpen = false;
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }

  closeWithoutSave() {
    this.taskservice.taskPopupOpen = false;
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }

  setUrgency(urgency = 'normal') {    // default: normal
    console.log(urgency);
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
    alert(this.customCategory)
    this.task.category = this.customCategory;
    this.openCategoryPopUp = false;
  }

  closeCustomCategory() {
    this.customCategory = '';
    this.openCategoryPopUp = false;
  }



}
