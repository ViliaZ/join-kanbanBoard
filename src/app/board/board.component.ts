import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError } from 'rxjs';
import { NewTaskComponent } from '../new-task/new-task.component';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'
  ]
})

export class BoardComponent implements OnInit {

  newBoardName: any;  // from inputfield ngModel (new Board)
  public boards: any = []


  constructor(public firestore: AngularFirestore, public taskservice: TasksService) {
  }

  ngOnInit(): void {
    this.getBoardsFromDB();
  }

  getBoardsFromDB() {
    this.firestore
      .collection('boards')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result) => {
        this.boards = result;
        this.getTasksFromDB();
      })
  }

  getTasksFromDB() {
    this.firestore
      .collection('tasks')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result) => {
        this.sortTasksToBoards(result);
      })
  }

  sortTasksToBoards(result: any) {
    result.forEach((task: any) => {
      for (let i = 0; i < this.boards.length; i++) {
        if (task.board === this.boards[i].name) {
          if (task.dueTo) {
            task.dueTo = new Date(task.dueTo['seconds'] * 1000).toLocaleDateString('en-GB');
          }
          this.boards[i].tasks.push(task)
        }
      }
    });
  }

  openTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }

  addNewBoard() {
    this.firestore
      .collection('boards')
      .add({ 'name': this.newBoardName, 'tasks': [] });
  }

  allowDrop(ev: any) {
    ev.preventDefault();
  }

  //defines what data to be dragged
  drag(ev: any) {
    ev.dataTransfer.setData("text", ev.target.id);
    // ev.target.id containes the HTML id="" of the div 
    // the id of each task div is set to be the customID in Firestore for the element
  }

  drop(ev: any, targetboard: string) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    // "data" returns the HTML Id of the dragged element - this id is set to be the customID in Firestore for the element
   
    // change 'board' to new board in firestore
    try {
      this.firestore.collection('tasks').doc(data).update({ board: targetboard })
    } catch (error) {
      console.log(error);
    }
  }


}
