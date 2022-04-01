import { Injectable, ɵɵNgOnChangesFeature } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public categories: string[] = ['Design','Marketing', 'Finance', 'Admin', 'Other']
  public users: any = [
    {
      'firstName': 'Franzi',
      'lastName': 'Hamm',
      'userImage': 'assets/img/user.png'
    },
    {
      'firstName': 'Guest',
      'lastName': 'User',
      'userImage': 'assets/img/user.png'
    }
  ];
  public boards: any = [];
  public tasks: any = [];
  public backlogtasks: any = [];

  constructor(public firestore: AngularFirestore) {
    this.getBoardAndTaskData();
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

  getBoardAndTaskData(){
    this.firestore
    .collection('boards')
    .valueChanges({ idField: 'customIdName' })
    .pipe(switchMap( (result: any) => {
      this.boards = result;
      return this.firestore
      .collection('tasks')
      .valueChanges({ idField: 'customIdName' });
    }))
    .subscribe((result) => {
      this.sortTasksToBoards(result);
    });
  }

  getTaskData() {
    this.firestore
      .collection('tasks')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result) => {
        this.sortTasksToBoards(result);
      });
  }

  sortTasksToBoards(result: any) {
    this.boards.forEach((board: any) => board.tasks = []);
    result.forEach((task: any) => {
      for (let i = 0; i < this.boards.length; i++) {
        if (task.board === this.boards[i].name) {
          task.dueTo = new Date(task.dueTo['seconds'] * 1000).toLocaleDateString('en-GB');
          this.boards[i].tasks.push(task);
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

  updateDoc(collection: string, docID: string, updateData: object): Promise<any> {
   return this.firestore.collection(collection).doc(docID).update(updateData);
  }

  addDocToCollection(collection: string, doc: object) {
    this.firestore.collection(collection).add(doc);
  }

  deleteDoc(collection: string, docID: string) {
    this.firestore.collection(collection).doc(docID).delete();
  }


}
