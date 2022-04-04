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
  public backlogEmpty = () => { return (this.backlogtasks.length == 0) }
  public initializationDone = () => {
    let result = this.boards.find((item: any) => { return item.name == 'todo' })
    return result
  }


  constructor(public firestore: AngularFirestore) {
    this.getBoardAndTaskData();
  }

  getBoardAndTaskData(sortBoardsBy: string = 'createdAt', sortBoardOrder: any = 'asc', sortTasksBy: string = 'isPinnedToBoard', sortTasksOrder: any = 'desc') {
    this.firestore
      .collection('boards', ref => ref.orderBy(sortBoardsBy, sortBoardOrder))  // default sort via timestamp
      .valueChanges({ idField: 'customIdName' })
      .pipe(switchMap((result: any) => {
        this.boards = result;

        return this.firestore
          .collection('tasks', ref => ref.orderBy(sortTasksBy, sortTasksOrder))
          .valueChanges({ idField: 'customIdName' });
      }))
      .subscribe((result) => {
        this.sortTasksToBoards(result);
      });
  }


  sortTasksToBoards(tasks: any) {
    this.boards.forEach((board: any) => board.tasks = []);
    this.backlogtasks = [];
    tasks.forEach((task: any) => {
      task.dueTo = this.convertDateFormat(task, 'en-GB')
      for (let i = 0; i < this.boards.length; i++) {
        if (task.board === 'backlog') {
          this.handleBacklogTasks(task);
          return
        }
        else {
          this.handleBoardTasks(task, i);
        }
      }
    })
    this.sortBoardsDescending();
  }

  convertDateFormat(task: any, targetDateFormat: string) {
    return new Date(task.dueTo['seconds'] * 1000).toLocaleDateString(targetDateFormat);
    //firestore dates are a timstamp object
  }

  handleBacklogTasks(task: any) {
    this.backlogtasks.push(task);
    // sorting into default order: by deadline
  }

  // console.log(this.boards[i].name, ascending);
  // pinned Task on Top of Board, then all other tasks sorted by createdAt
  sortBoardsDescending() {
    for (let i = 0; i < this.boards.length; i++) {
      // temporary subarrays from the board
      let pinnedTasks: any = []; // holds all not-pinned tasks of a board
      let unpinnedTasks: any = [];
      let unpinnedTasksSorted: any = [];

      this.boards[i].tasks.map((task: any) => {
        if (task.isPinnedToBoard) {
          pinnedTasks.push(task);
        }
        if (!task.isPinnedToBoard) {
          unpinnedTasks.push(task);
        }
      }) // sort this array with "createdAt" descending
      unpinnedTasksSorted = unpinnedTasks.sort((a: any, b: any) => Number(a.createdAt) - Number(b.createdAt));
      // merge subarrays again to final sorted Array
      this.boards[i].tasks = pinnedTasks.concat(unpinnedTasksSorted);
    }
  }

  handleBoardTasks(task: any, i: number) {
    if (task.board === this.boards[i].name) {
      if (task.createdAt)
        this.boards[i].tasks.push(task);
    }
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