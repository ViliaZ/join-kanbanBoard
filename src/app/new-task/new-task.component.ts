import {
  temporaryAllocator
} from '@angular/compiler/src/render3/view/util';
import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Event, Router } from '@angular/router';
import {
  DatabaseService
} from 'src/services/database.service';
import {
  TasksService
} from 'src/services/tasks.service';
import { Form, FormControl, NgForm } from '@angular/forms';
import { AuthServiceService } from 'src/services/auth-service.service';
import { Task } from 'src/models/task';
import { AlertService } from 'src/services/alert.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  @Input() newTask: boolean | undefined;
  @ViewChild('catSelect') categorySelector: any;
  @ViewChild('newTodo') newTodo: any;
  @ViewChild('myform') myform: NgForm | undefined;

  public closePopup: boolean = false;
  public customCategory: any = '';
  public openCategoryPopUp: boolean = false;
  public currentTask: any;
  public activeUrgency: string = '';
  public minDate: any = new Date; // minimum date for datepicker
  public newToDoItem: string = '';  // input field for adding todo Items

  public formData: any = {
    title: '',
    description: '',
    dueTo: new Date(),
    urgency: 'medium',
    board: 'backlog',
    category: '',
    responsibility: 'Guest',
    isPinnedToBoard: false,
    createdAt: new Date(),
    customIdName: '',
    allTodos: '',
    uncheckedTodos: [],
    checkedTodos: []
  }
  userUid!: string;

  constructor(
    public db: DatabaseService,
    public taskservice: TasksService,
    public router: Router,
    public authService: AuthServiceService,
    public alertService: AlertService,
    private firestore: AngularFirestore) {
  }

  ngOnInit(): void {
    if (this.taskservice.editMode) {// EDITMODE only: set current values in all inputfields
      this.setDefaultData();
    }
    this.setUrgencyDefault();
    this.getCurrentUserUid();
  }


  async getCurrentUserUid() {
    this.userUid = await firstValueFrom(this.authService.userUid$);
    // only in editmode
  }

  setDefaultData() {
    let taskClicked = new Task(this.taskservice.currentTask).getEditmodeTask();
    this.formData = taskClicked;
    console.log('this is currenttask', new Date(this.taskservice.currentTask.dueTo));
    console.log(this.formData);
  }

  // Urgency is set per default not via ngModel (only after editing)
  setUrgencyDefault() {
    let activeUrgency: string;
    if (!this.taskservice.editMode) {
      activeUrgency = 'medium';
    }
    else {
      activeUrgency = this.taskservice.currentTask.urgency;
    }
    this.setUrgencyButtonColor(activeUrgency);
  }

  // set color for selected urgency button
  setUrgencyButtonColor(activeUrgency: string = 'medium') {
    this.activeUrgency = activeUrgency;
  }

  // if user choose to set up a custom category
  async handleCustomCategory(action: string, event?: any, form?: any) {
    if (action == 'checkIfCustomRequest') {
      this.checkIfCustomCatRequested(event);
    }
    if (action == 'close') {
      this.customCategory = '';
      this.openCategoryPopUp = false;
    }
    if (action == 'save') {
      await this.addCategoryInCatArrayFirestore();
      this.formData.category = this.customCategory;
      this.openCategoryPopUp = false;
    }
  }

  async addCategoryInCatArrayFirestore() {
    await this.getCurrentUserUid();
    this.firestore.collection('users').doc(this.userUid)
      .get()
      .subscribe(async (userDoc: any) => {
        let catArray = userDoc.data().customCategories;  // get current Categories array
        catArray.push(this.customCategory);  // update it with new cat
        await this.firestore.collection('users').doc(this.userUid).update({ customCategories: catArray });
      })
  }

  // check via onchanges() if user wants to add a custom category
  checkIfCustomCatRequested(event: any) {
    if (event.target.value == 'Custom Category' && !this.openCategoryPopUp) {
      this.openCategoryPopUp = true;
    }
  }

  // handle Submit of form
  async onSubmit() {
    console.log('onsubmit',this.formData);
    
    let task = new Task(this.formData).toJson();
    if (!this.taskservice.editMode) {
      this.db.addDocToCollection('tasks', task);
      this.alertService.setAlert('confirmAddTask');
    } else {
      this.udpateEditedTask(task);
      this.alertService.setAlert('confirmEditTask');
    }
    this.resetForm();
  }

  // reset after save/cancel
  resetForm() {
    this.myform?.form.markAsUntouched();
    let emptyTemplateTask = Task.getTaskTemplate(); // calling a static function inside of Task Model
    this.formData = emptyTemplateTask;
    this.taskservice.taskPopupOpen = false;
    this.setUrgencyButtonColor('medium');

  }

  udpateEditedTask(taskAsJson: any) {
    this.db.updateDoc('tasks', this.formData.customIdName, taskAsJson);
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }

  closeWithoutSave() {
    this.taskservice.taskPopupOpen = false;
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }

  clearForm(){
    this.taskservice.currentTask = {};
    this.resetForm();   
  }


  handleTodo(action: string) {
    if (action == 'save') {
      this.formData.uncheckedTodos.push(this.newToDoItem);
      console.log('save', this.newToDoItem);
      this.newToDoItem = '';
      console.log(this.formData);
    }
    if (action == 'clear') {
      this.newToDoItem = '';
      console.log('clear');
    }
  }

  markChecked(indexUnchecked: number, todo: string) {
    this.formData.checkedTodos.push(todo);
    this.formData.uncheckedTodos.splice(indexUnchecked, 1)
  }

  markUnchecked(indexChecked: number, todo: string) {
    this.formData.uncheckedTodos.push(todo);
    this.formData.checkedTodos.splice(indexChecked, 1)
  }

}
