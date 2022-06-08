import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertStatusON: boolean = true; // toggles alerts open, for setTimeout() 
  indexOfBoardToDelete!: number;

  alerts: any = {  
    "backlogAlert": false,  // 
    "editsProhibited": false, // no Edits on Todo board
    "duplicateAlert": false,
    "confirmDeleteBoard": true,
    "confirmEditTask": false,
    "confirmAddTask": false,
    "confirmDeleteTask": false,
    "confirmMoveToToDo": false,
  }

  constructor(private db: DatabaseService) { }

  setAlert(alertName: string, closeRequest?: string) { // NOTE: alertName is an object, because a boolean variable is not assignable as a reference --> make it an object as a workaround
    closeRequest == 'close' ?  this.alerts[alertName] = false :  this.alerts[alertName] = true;
    this.alertStatusON = true;    
    console.log(this.alerts);
                          // alertpopup open (true) / close (false)
    if (alertName == 'confirmDeleteBoard') { return } // because this alert must be actively be closed by user 
    setTimeout(() => {  // reset
      this.alerts[alertName] = false;
      this.alertStatusON = false
    }, 4000);  // to close popup
  }

  cancelDeleteBoard() {
    this.setAlert('confirmDeleteBoard', 'close'); 
  }  

  confirmDeleteBoard(): any { 
    let boardToDelete = this.db.boards[this.indexOfBoardToDelete];
    boardToDelete.tasks.forEach((task: any) => { // first: delete all tasks on board
      this.db.deleteDoc('tasks', task.customIdName)
    });
    this.db.deleteDoc('boards', boardToDelete.customIdName);
    this.setAlert('confirmDeleteBoard', 'close');
  }

}
