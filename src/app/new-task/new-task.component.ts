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
import { AuthServiceService } from 'src/services/auth-service.service';


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
    'users': this.authService.currentUser.uid,
    'isPinnedToBoard': '',
    'createdAt': '',
  }


  constructor(
    public db: DatabaseService,
    public taskservice: TasksService,
    public router: Router,
    public authService: AuthServiceService) {

  }

  ngOnInit(): void {
    if (this.taskservice.editMode) {// EDITMODE only: set current values in all inputfields
      this.autoFillForm();
    }
    this.setUrgencyDefault();
  }

  // EDITMODE only
  autoFillForm() {
    this.task = this.taskservice.currentTask;
    this.date = new Date(this.taskservice.currentTask.dueTo.toDate());  // cannot use ngModel for date with dueTo --> Error, because conflict with template HTML for date / format issue when I set a value in datepicker
    this.task.users = this.authService.currentUser.uid; // future: hier kommt currentUser hin
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

  async saveTask(form: any) {
    if (!this.taskservice.editMode) {
      await this.saveNewTask(form);
      console.table(this.task);
      this.db.addDocToCollection('tasks', this.task);
    } else {
      this.udpateEditedTask();
    }
    this.resetForm(form);
  }

  async resetForm(form: any) {
    await form.reset();
    this.task.board = 'backlog';
    this.task.category = '';
    this.task.dueTo = new Date();
    this.taskservice.taskPopupOpen = false;
    this.setUrgencyButtonColor('normal');
    console.table(this.task);

  }

  async saveNewTask(form: any) {  // set values according to ngModel Inputs
    this.task.board = await form.value.board; // default
    this.task.createdAt = new Date().getTime(); // needed for sorting tasks in order
    this.task.isPinnedToBoard = false; // default
    this.task.urgency = await form.value.taskUrgency;
    this.task.category = await form.value.taskCategory;
    this.task.dueTo = await form.value.taskDueDate;
    this.task.description = await form.value.taskDescription;
    this.task.users = await form.value.taskUser;
    this.task.creator = await this.authService.currentUser.uid;
  }

  udpateEditedTask() {
    this.task = this.taskservice.currentTask;
    this.task.dueTo = this.date;
    console.log('this task is saved to db:', this.task.dueTo);
    this.db.updateDoc('tasks', this.task.customIdName, this.task);
    this.task.dueTo = { seconds: 1651269600, nanoseconds: 0 };
    console.log('this task after saved to db:', this.task.dueTo);

    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }

  closeWithoutSave() {
    this.taskservice.taskPopupOpen = false;
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }
}
