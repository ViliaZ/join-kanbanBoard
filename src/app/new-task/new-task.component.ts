import {
  temporaryAllocator
} from '@angular/compiler/src/render3/view/util';
import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {
  DatabaseService
} from 'src/services/database.service';
import {
  TasksService
} from 'src/services/tasks.service';
import { Form, FormControl } from '@angular/forms';


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
  public activeUrgency: string = '';
  public date: any; // only for editmode // ngmodel datepicker works with this date
  public minDate: any = new Date; // minimum date for datepicker
  // ngValue: any = null;

  // via ng Model
  public task: any = {
    'title': '',
    'description': '',
    'dueTo': new Date(),
    'urgency': '',
    'board': 'backlog',
    'category': '',
    'users': this.db.users[0],
    'isPinnedToBoard': '',
    'createdAt': '',
  }


  constructor(public db: DatabaseService, public taskservice: TasksService, public router: Router) {

  }

  ngOnInit(): void {
    if (this.taskservice.editMode) {// EDITMODE only: set current values in all inputfields
      this.autoFillForm();
    }
    this.setUrgencyDefault();
  }

  // EDITMODE only
  autoFillForm(){
    this.task = this.taskservice.currentTask;
    this.date = new Date(this.taskservice.currentTask.dueTo.toDate());  // cannot use ngModel for date with dueTo --> Error, because conflict with template HTML for date / format issue when I set a value in datepicker
    this.task.users = this.db.users[0]; // future: hier kommt currentUser hin
    // use 'date' instead of 'dueTo' in Datepicker! The template inputfield is changed to 'ngModel = date' when in editmode
console.log('this task after autofill:', this.task.dueTo);

  }

  setUrgencyDefault() {
    let activeUrgency: string;
    if (!this.taskservice.editMode) {
      activeUrgency = 'normal';
    }
    else {
      activeUrgency = this.taskservice.currentTask.urgency;
    }
    this.setUrgencyButtonColor(activeUrgency);
  }

  // set color for selected choice on clicked button
  setUrgencyButtonColor(activeUrgency: string = 'normal') {
    this.activeUrgency = activeUrgency;
  }


  handleCustomCategory(action: string, event?: any, form?: any) {
    if (action == 'checkIfCustomRequest') {
      this.checkIfCustomCatRequested(event);
    }
    if (action == 'close') {
      this.customCategory = '';
      this.openCategoryPopUp = false;
    }
    if (action == 'save') {
      this.db.categories.push(this.customCategory);
      this.taskservice.currentTask.category = 'testtest';
      this.task.category = this.customCategory;
      this.openCategoryPopUp = false;
    }
  }

  checkIfCustomCatRequested(event: any) {
    if (event.target.value == 'Custom Category' && !this.openCategoryPopUp) {
      this.openCategoryPopUp = true;
    }
  }

  saveTask(form: any) {
    if (!this.taskservice.editMode) {
      this.saveNewTask(form);
      this.db.addDocToCollection('tasks', this.task);


    } else {
      this.udpateEditedTask();
    }
    this.resetForm(form);
  }

  resetForm(form: any){
    form.reset();
    this.taskservice.taskPopupOpen = false;
    this.setUrgencyButtonColor('normal');
  }

  saveNewTask(form: any) {  // set values according to ngModel Inputs
    this.task.board = form.value.board; // default
    this.task.createdAt = new Date().getTime(); // needed for sorting tasks in order
    this.task.isPinnedToBoard = false; // default
    this.task.urgency = form.value.taskUrgency;
    this.task.category = form.value.taskCategory;
    this.task.dueTo = form.value.taskDueDate;   
    this.task.description = form.value.taskDescription;
    this.task.users = form.value.taskUser;
  }

  udpateEditedTask() {
    this.task = this.taskservice.currentTask;
    this.task.dueTo = this.date;
    console.log('this task is saved to db:',this.task.dueTo);
    this.db.updateDoc('tasks', this.task.customIdName, this.task);
    this.task.dueTo = {seconds: 1651269600, nanoseconds: 0};
    console.log('this task after saved to db:',this.task.dueTo);

    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }

  closeWithoutSave() {
    this.taskservice.taskPopupOpen = false;
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }
}
