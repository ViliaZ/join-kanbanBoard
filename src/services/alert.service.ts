import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertStatusON: boolean = false; // toggles alerts open, for setTimeout() 

  alerts: any = {  // NOTE: save as objects to be able to pass them as parameter references | otherwise boolean (primitive) variables cannot be handled as references when given as a parameter in setAlert()
    "backlogAlert": false,  // 
    "editsProhibited": false, // no Edits on Todo board
    "duplicateAlert": false,
    "confirmDeletion": false,
    "confirmAddTask": false
  }

  constructor() { }

  setAlert(alertName: string, closeRequest?: string) { // NOTE: alertName is an object, because a boolean variable is not assignable as a reference --> make it an object as a workaround
    closeRequest == 'close' ?  this.alerts[alertName] = false :  this.alerts[alertName] = true;
    this.alertStatusON = true;                          // alertpopup open (true) / close (false)
    if (alertName == 'confirmDeletion') { return } // because this alert must be actively be closed by user 
    setTimeout(() => {  // reset
      this.alerts[alertName] = false;
      this.alertStatusON = false
    }, 4500);  // to close popup
  }

}
