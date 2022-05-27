import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertStatusON: boolean = false; // toggles alerts open, for setTimeout() 

  alerts: any = {  
    "backlogAlert": false,  // 
    "editsProhibited": false, // no Edits on Todo board
    "duplicateAlert": false,
    "confirmDeleteBoard": false,
    "confirmEditTask": false,
    "confirmAddTask": false,
    "confirmDeleteTask": false,
    "confirmMoveToToDo": false,

  }

  constructor() { }

  setAlert(alertName: string, closeRequest?: string) { // NOTE: alertName is an object, because a boolean variable is not assignable as a reference --> make it an object as a workaround
    closeRequest == 'close' ?  this.alerts[alertName] = false :  this.alerts[alertName] = true;
    this.alertStatusON = true;    
    console.log(this.alerts);
                          // alertpopup open (true) / close (false)
    if (alertName == 'confirmDeleteBoard') { return } // because this alert must be actively be closed by user 
    setTimeout(() => {  // reset
      this.alerts[alertName] = false;
      this.alertStatusON = false
    }, 3800);  // to close popup
  }

}
