import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
  allTasks: any = [];


  constructor(public firestore: AngularFirestore) {
  }

  async ngOnInit(): Promise<any> {
    await this.getDataFromDB();
    setTimeout(() => {
      this.sortDataTBoards();
    }, 3000);


  }

  async getDataFromDB() {
    await this.firestore
      .collection('tasks')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result: any) => {
        this.allTasks = result;
        console.log('result Fetch', result);
      })
  }

  sortDataTBoards() {
    // console.log('allTasks',this.allTasks);
      this.allTasks.forEach((task: any) => {
        for(let i = 0; i<this.boards.length; i++){
          if(task.board === this.boards[i].name){
            this.boards[i].tasks.push(task)
          }
        }
      });
      console.log(this.boards)
  }


}
