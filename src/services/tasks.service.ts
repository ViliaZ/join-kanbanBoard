import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  public detailsRequested: boolean = false;
  public taskPopupOpen = false; 
  public currentTask!: any;
  public editMode: boolean = false;  // turns true if a task is edited

  constructor() { }

}
