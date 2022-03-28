import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  newTask: boolean = false; 
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
  allTasks: any = [];


  constructor(public firestore: AngularFirestore) {
  }

  ngOnInit(): void {
    this.getDataFromDB();
  }

  getDataFromDB() {
    this.firestore
      .collection('tasks')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result)=>{
        this.getAllTasks(result);
        this.sortDataToBoards();
      })
  }

  getAllTasks(result: any) {
    this.allTasks = result;
    console.log('result Fetch', result);
  }
  sortDataToBoards() {
    this.allTasks.forEach((task: any) => {
      task.dueTo = new Date(task.dueTo['seconds'] * 1000).toLocaleDateString('en-GB')

      for (let i = 0; i < this.boards.length; i++) {
        if (task.board === this.boards[i].name) {
          this.boards[i].tasks.push(task)
        }
      }
    });
  }

  openTaskPopUp(){
    this.newTask = true; 
  }
}
