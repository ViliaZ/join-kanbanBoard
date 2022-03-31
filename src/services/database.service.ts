import { Injectable, ɵɵNgOnChangesFeature } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public boards: any = [];
  public tasks: any = [];
  public backlogtasks: any = [];

  constructor(public firestore: AngularFirestore) {
    this.getBoardsData();
  }

  getBoardsData() {
    this.firestore
      .collection('boards')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result: any) => { 
        this.boards = result;
        this.getTaskData();
       })
  }

  getTaskData() {
    this.firestore
      .collection('tasks')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result) => {
        this.sortTasksToBoards(result);
      })
  }

  sortTasksToBoards(result: any) {
    this.boards.forEach((board: any) => board.tasks = []);
    result.forEach((task: any) => {
      for (let i = 0; i < this.boards.length; i++) {
        if (task.board === this.boards[i].name) {
          task.dueTo = new Date(task.dueTo['seconds'] * 1000).toLocaleDateString('en-GB');
          this.boards[i].tasks.push(task)
        }
      }
    })
  }

  getBacklogTasks() {
    this.firestore
      .collection('tasks', ref => ref.where('board', '==', 'backlog'))
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result: any) => {
        this.backlogtasks = result;
        this.backlogtasks
          .map((task: any) => {
            task.dueTo = new Date(task.dueTo['seconds'] * 1000).toLocaleDateString('en-GB')
          }
          )
      })
  }

  updateDoc(collection: string, docID: string, updateData: object) {
    this.firestore.collection(collection).doc(docID).update(updateData);
  }


  addDocToCollection(collection: string, doc: object) {
    this.firestore.collection(collection).add(doc)
  }

  deleteDoc(collection: string, docID: string) {
    this.firestore.collection(collection).doc(docID).delete();
  }


}
