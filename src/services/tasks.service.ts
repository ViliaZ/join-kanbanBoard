import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  public detailsRequested: boolean = false;
  public taskPopupOpen = false; 
  public currentTask: any = {};
  public editMode: boolean = false;  // turns true if a task is edited

  constructor() { }


}
