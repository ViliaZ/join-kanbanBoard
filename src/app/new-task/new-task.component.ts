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
  ngValue: any = null;

  // via ng Model
  public task: any = {
    title: 'aaaaaa',
    description: '',
    dueTo: '',
    urgency: 'normal',
    board: '',
    category: 'Other',
    users: '',
    isPinnedToBoard: '',
    createdAt: ''
  }

  constructor(public db: DatabaseService, public taskservice: TasksService) {
    this.task = this.taskservice.currentTask;
  }

  ngOnInit(): void {}

  setUrgency(urgency: string = 'normal') { // default: normal
    this.task.urgency = urgency;
    this.activeUrgency = urgency;
  }

  saveCategory(event: any) {
    if (event.target.value == 'Custom Category') {
      this.openCategoryPopUp = true;
      event.target.value = '';
    } else {
      console.log(event.target.value);
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


  // mit onsubmit ersetzen
  saveTask(task: any) {
    console.log('editmode?', this.taskservice.editMode);
    console.log('currentTasks?', this.taskservice.currentTask);

    // fill the task object with input from ngModel
    if (!this.taskservice.editMode) {
      this.task.board = 'backlog'; // default
      this.task.createdAt = new Date().getTime(); // needed for sorting tasks in order
      this.task.isPinnedToBoard = false; // default
      this.db.addDocToCollection('tasks', this.task);
    } else {
      this.task = this.taskservice.currentTask;
      this.db.updateDoc('tasks', this.task.customIdName, this.task);
      this.taskservice.currentTask = {};
      this.taskservice.editMode = false;
    }
    this.taskservice.taskPopupOpen = false;
  }



  submitForm(form: any) {


    console.log('form abgeschickt', this.task.title)


  }

  closeWithoutSave() {
    this.taskservice.taskPopupOpen = false;
    this.taskservice.currentTask = {};
    this.taskservice.editMode = false;
  }

}
