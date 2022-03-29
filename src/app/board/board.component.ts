import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NewTaskComponent } from '../new-task/new-task.component';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  boards: any = [
    {
      name: 'todo',
      tasks: []
    },
    {
      name: 'inprogress',
      tasks: []
    },
    {
      name: 'done',
      tasks: []
    },
    {
      name: 'archive',
      tasks: []
    }
  ]


  constructor(public firestore: AngularFirestore, public taskservice: TasksService) {
  }

  ngOnInit(): void {
    this.getDataFromDB();
  }

  getDataFromDB() {
    this.firestore
      .collection('tasks')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result) => {
        this.sortDataToBoards(result);
      })
  }

  sortDataToBoards(result: any) {
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
    console.log(this.taskservice.taskPopupOpen);

    this.taskservice.taskPopupOpen = true;
  }
  // closePopUp() {
  //   console.log(this.taskservice.taskPopupOpen);
    
  //   if (this.taskservice.taskPopupOpen === true) {
  //     this.taskservice.taskPopupOpen = false
  //   }
  // }

}
