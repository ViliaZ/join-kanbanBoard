import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  public taskPopupOpen = false; 
  public currentTask: any = {};
  public editMode: boolean = false;  // turns true if a task is edited


  // user: any = [
  //   {
  //     'firstName': 'Vilia',
  //     'lastName': 'Zeisig',
  //     'userImage': 'assets/img/user.png'
  //   },
  //   {
  //     'firstName': 'user2',
  //     'lastName': 'user2nachname',
  //     'userImage': 'assets/img/user.png'
  //   }
  // ]


  // categories: string[] = ['Design','Marketing', 'Finance', 'Admin', 'Other']


  constructor() { }




}
