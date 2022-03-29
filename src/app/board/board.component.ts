import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
      .add({ 'name': this.newBoardName,'tasks':[]});
  }



}
