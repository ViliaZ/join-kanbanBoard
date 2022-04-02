import { BaseOverlayDispatcher } from '@angular/cdk/overlay/dispatchers/base-overlay-dispatcher';
import { Injectable, ɵɵNgOnChangesFeature } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public categories: string[] = ['Design', 'Marketing', 'Finance', 'Admin', 'Other']
  public users: any = [
    {
      'firstName': 'Guest',
      'lastName': 'User',
      'userImage': 'assets/img/user.png'
    }
  ];
  public boards: any = [];
  public tasks: any = [];
  public backlogtasks: any = [];
  public backlogEmpty: boolean = false;
  initializationDone = () => {
    let result = this.boards.find((item:any) => {
      return item.name == 'todo'
     }) 
     return result
  }

  



  // initializationDone: any = () => {
  //   let res = this.boards.find((board: any) => {
  //     if (board.name === 'todo') {
  //       return true
  //     }
  //     else { return false }
  //   })
  //   return res
  // } 





  constructor(public firestore: AngularFirestore) {
    this.getBoardAndTaskData();
  }

  getBoardAndTaskData() {
    this.firestore
      .collection('boards')
      .valueChanges({ idField: 'customIdName' })
      .pipe(switchMap((result: any) => {
        this.boards = result;

        return this.firestore
          .collection('tasks')
          .valueChanges({ idField: 'customIdName' });
      }))
      .subscribe((result) => {
        this.sortTasksToBoards(result);
      });
  }


  // getBacklogTasks(): any {

  //   this.backlogtasks = this.boards.find((board: any) => {
  //     console.log(board.name);

  //     board.name === 'backlog'
  //   })

  // this.firestore
  //   .collection('tasks', ref => ref.where('board', '==', 'backlog'))
  //   .valueChanges({ idField: 'customIdName' })
  //   .subscribe((result: any) => {
  //     this.backlogtasks = result;
  //     this.convertDateFormat(this.backlogtasks) 
  //   })
  //   return this.backlogtasks
  // }

  // convertDateFormat(data: []): void {
  //   data.map((el: any) => {
  //     el.dueTo = new Date(el.dueTo['seconds'] * 1000).toLocaleDateString('en-GB')
  //   }
  //   )
  // }

  sortTasksToBoards(tasks: any) {
    this.boards.forEach((board: any) => board.tasks = []);
    this.backlogtasks = [];
    console.log('backlogtasks vorm sortieren:', this.backlogtasks);

    tasks.forEach((task: any) => {
      for (let i = 0; i < this.boards.length; i++) {
        task.dueTo = new Date(task.dueTo['seconds'] * 1000).toLocaleDateString('en-GB');
        if (task.board === 'backlog') {
          this.backlogtasks.push(task);
        }
        else if (task.board === this.boards[i].name) {
          this.boards[i].tasks.push(task);
        }
      }
    })
  }

  // ****************** OLD VERSION FOR REFERENCE: NOW MADE INTO SWITCHMAP METHOD ABOVE ********
  // getBoardsData() {
  //   this.firestore
  //     .collection('boards')
  //     .valueChanges({ idField: 'customIdName' })
  //     .subscribe((result: any) => { 
  //       this.boards = result;
  //       this.getTaskData();
  //      })
  // }

  // getTaskData() {
  //   this.firestore
  //     .collection('tasks')
  //     .valueChanges({ idField: 'customIdName' })
  //     .subscribe((result) => {
  //       this.sortTasksToBoards(result);
  //     });
  // }
  // ****************** OLD VERSION FROM SWITCHMAP METHOD ABOVE ********






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
