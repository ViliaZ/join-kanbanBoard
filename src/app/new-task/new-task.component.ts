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
import { Form, FormControl } from '@angular/forms';
import { AuthServiceService } from 'src/services/auth-service.service';
import { Task } from 'src/models/task';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  @Input() newTask: boolean | undefined;
  @ViewChild('catSelect') categorySelector: any;
  @ViewChild('newTodo') newTodo: any;

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

  constructor(
    public db: DatabaseService,
    public taskservice: TasksService,
    public router: Router,
    public authService: AuthServiceService) {
  }

  ngOnInit(): void {
    if (this.taskservice.editMode) {// EDITMODE only: set current values in all inputfields
      let taskClicked = new Task(this.taskservice.currentTask).getEditmodeTask();
      this.formData = taskClicked;
      console.log('this is currenttask', new Date(this.taskservice.currentTask.dueTo));
      console.log(this.formData);
    }
    this.setUrgencyDefault();
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
      this.formData.category = this.customCategory;
      this.openCategoryPopUp = false;
    }
  }
  // checks onchanges() for inputfield category
  checkIfCustomCatRequested(event: any) {
    if (event.target.value == 'Custom Category' && !this.openCategoryPopUp) {
      this.openCategoryPopUp = true;
    }
  }

  // handle Submit of form
  async onSubmit() {
    alert('save ausgeführt')
    let task = new Task(this.formData).toJson();
    if (!this.taskservice.editMode) {
      console.log('saved dieser Task', task);
      this.db.addDocToCollection('tasks', task);
    } else {      
      this.udpateEditedTask(task);
    }
    this.resetForm();
  }

  // reset after save/cancel
  resetForm() {
    let emptyTemplateTask = Task.getTaskTemplate(); // calling a static function inside of Task Model
    this.formData = emptyTemplateTask;
    this.taskservice.taskPopupOpen = false;
    this.setUrgencyButtonColor('normal');
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
    this.formData.uncheckedTodos.splice(indexUnchecked,1)
  }
}
