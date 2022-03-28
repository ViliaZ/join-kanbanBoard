import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  boards: any = ['todo', 'inprogress', 'done', 'archive'];
  allTasks: any = [];


  constructor(public firestore: AngularFirestore) {
  }

  async ngOnInit(): Promise<any> {
    await this.getDataFromDB();
    this.sortDataTBoards();
  }

  async getDataFromDB() {
    await this.firestore
      .collection('tasks')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result: any) => {
        this.allTasks = result;
        console.log(result);
      })
  }

  sortDataTBoards() {

  }



}
