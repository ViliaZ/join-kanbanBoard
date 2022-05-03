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

  // formData
  public formData: any = {
    'title': '',
    'description': '',
    'dueTo': new Date(),
    'urgency': '',
    'board': 'backlog',
    'category': '',
    'responsibility': 'Guest',
    'isPinnedToBoard': 'false',
    'createdAt': new Date(),
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
    console.log(this.authService.currentUser)
  }

  // EDITMODE only
  autoFillForm() {
    this.formData = this.taskservice.currentTask;
    this.date = new Date(this.taskservice.currentTask.dueTo.toDate());  // cannot use ngModel for date with dueTo --> Error, because conflict with template HTML for date / format issue when I set a value in datepicker
    this.formData.responsibility = this.authService.currentUser.uid; // future: hier kommt currentUser hin
    // use 'date' instead of 'dueTo' in Datepicker! The template inputfield is changed to 'ngModel = date' when in editmode
    console.log('this task after autofill:', this.formData.dueTo);

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
      this.formData.category = this.customCategory;
      this.openCategoryPopUp = false;
    }
  }

  checkIfCustomCatRequested(event: any) {
    if (event.target.value == 'Custom Category' && !this.openCategoryPopUp) {
      this.openCategoryPopUp = true;
    }
  }

  async saveTask(form: any) {
    console.table(this.formData);
    
    // if (!this.taskservice.editMode) {
    //   await this.saveNewTask(form);
    //   console.table(this.formData);
    //   this.db.addDocToCollection('tasks', this.formData);
    // } else {
    //   this.udpateEditedTask();
    // }
    // this.resetForm(form);
  }

  async resetForm(form: any) {
    await form.reset();
    this.taskservice.taskPopupOpen = false;
    this.setUrgencyButtonColor('normal');
  }

  async saveNewTask(form: any) {  


    // this.formData.board = await form.value.board; 
    // this.formData.createdAt = new Date().getTime(); 
    // this.formData.isPinnedToBoard = false; 
    // this.formData.urgency = await form.value.taskUrgency;
    // this.formData.category = await form.value.taskCategory;
    // this.formData.dueTo = await form.value.taskDueDate;
    // this.formData.description = await form.value.taskDescription;
    // this.formData.responsibility = await form.value.taskUser;
    // this.formData.creator = await this.authService.currentUser.uid;
  }

  udpateEditedTask() {
    this.formData = this.taskservice.currentTask;
    this.formData.dueTo = this.date;
    console.log('this task is saved to db:', this.formData.dueTo);
    this.db.updateDoc('tasks', this.formData.customIdName, this.formData);
    this.formData.dueTo = { seconds: 1651269600, nanoseconds: 0 };
    console.log('this task after saved to db:', this.formData.dueTo);

    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }

  closeWithoutSave() {
    this.taskservice.taskPopupOpen = false;
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }
}
