import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class DragdropService {

  constructor(private db: DatabaseService) { }

  //++++++++  DRAG AND DROP ******
  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any) {
    ev.dataTransfer.setData("text", ev.target.id);
    // ev.target.id containes the HTML id="" of the div - the id of each task div is set to be the customID in Firestore for the element
  }

  drop(ev: any, targetboard: string) {
    ev.preventDefault();
    let dataID = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(dataID));
    // "data" returns the HTML Id of the dragged element - this id is set to be the customID in Firestore for the element
    // change 'board' to new board in firestore
    try {
      this.db.updateDoc('tasks', dataID, { board: targetboard });
    } catch (error) {
      console.log(error);
    }
  }
}
