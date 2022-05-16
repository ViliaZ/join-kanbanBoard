import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventemitterService {

  // use of communication between 2 compartments
  // more: https://www.c-sharpcorner.com/article/simple-way-to-execute-a-function-in-a-component-from-another-component/

  callBoardEventHandler = new EventEmitter();    // will be used to emitt the event 
  callBacklogFilterEventHandler = new EventEmitter();    // will be used to emitt the event 
  callBacklogSortEventHandler = new EventEmitter();    // will be used to emitt the event 
  subscription: Subscription | undefined;    // will be used later in event subscription
    
  constructor() { }    
    
  onNewBoardAdding(newBoardName: string) {    
    this.callBoardEventHandler.emit(newBoardName);   
  } 

  onBacklogSorting(trigger: string) {  // trigger used to force state change to subscribe to
    this.callBacklogSortEventHandler.emit();   
  } 

  onBacklogFiltering(searchedWord: String) {  // trigger used to force state change to subscribe to
    console.log('Filtering im service, searchedWord', searchedWord);
    this.callBacklogFilterEventHandler.emit(searchedWord);   
  } 





}
