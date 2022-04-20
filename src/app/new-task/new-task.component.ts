import {
  temporaryAllocator
} from '@angular/compiler/src/render3/view/util';
import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  DatabaseService
} from 'src/services/database.service';
import {
  TasksService
} from 'src/services/tasks.service';


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
  public activeUrgency: string = 'normal';
  public date: any = new Date; // datepicker default date
  public minDate: any = new Date; // minimum date for datepicker
  // ngValue: any = null;

  // via ng Model
  public task: any = {
    title: '',
    description: '',
    dueTo: '',
    urgency: 'normal',
    board: '',
    category: 'Other',
    users: 'here',
    isPinnedToBoard: '',
    createdAt: ''
  }

  constructor(public db: DatabaseService, public taskservice: TasksService) {
    this.task = this.taskservice.currentTask;
  }

  ngOnInit(): void { }

  // sets color for selected choice on clicked button
  setUrgencyButtonColor(urgency: string = 'normal') { // default: normal
    this.activeUrgency = urgency;
  }

  checkIfCustomCategory(event: any) {
    console.log('event');
    if (event.target.value == 'Custom Category') {
      this.openCategoryPopUp = true;
      event.target.value = '';
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

  saveTask(form: any) {
    console.log('editmode?', this.taskservice.editMode);
    console.log('currentTasks?', this.taskservice.currentTask);

    // fill the task object with input from ngModel
    if (!this.taskservice.editMode) {
      this.task.board = 'backlog'; // default
      this.task.createdAt = new Date().getTime(); // needed for sorting tasks in order
      this.task.isPinnedToBoard = false; // default
      this.task.urgency = form.value.taskUrgency;
      this.task.category = form.value.taskCategory;
      this.task.dueTo = form.value.taskDueDate;
      this.task.description = form.value.taskDescription;
      this.task.users = form.value.taskUser;
      this.db.addDocToCollection('tasks', this.task);
      form.reset();
      console.log('save task:', this.task)

      // if task already exists and is edited
    } else {
      this.task = this.taskservice.currentTask;
      this.db.updateDoc('tasks', this.task.customIdName, this.task);
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
