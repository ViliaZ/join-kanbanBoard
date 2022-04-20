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
  public backlogtasks: any = [];
  public urgentTasks: any = [];
  public todoTasks: any = [];
  public allTasks: any = [];
  public nextDueDates: any = [];
  public nextDueDateTask: any = [];
  public backlogEmpty = () => { return (this.backlogtasks.length == 0) }
  public initializationDone = () => {
    let result = this.boards.find((item: any) => { return item.name == 'ToDo' })
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
        this.emptyAllArrays();
        this.handleTasks(result);
      });
  }


  handleTasks(tasks: any) {
    tasks.forEach((task: any) => {
      this.filterAllTasks(task);
      this.filterUrgentTasks(task);
      this.filterToDoTasks(task);
      this.sortTasksToBoards(task);
      this.getNextDueDateTask(task);
    })
    this.sortBoardsDescending();
  }

  getNextDueDateTask(task: any) {
    if(this.nextDueDates.length == 0 ){ // push first task in array --> if only one task exists, this one will be the one with closest deadline
      this.nextDueDates.push(task);
    }
    else if(this.nextDueDates.length > 0 && (task.dueTo.toMillis() - this.nextDueDates[0].dueTo.toMillis() < 0) ){ // compare dueTo Date in milliseconds
     // if current task has closer deadline as task before, clear array and save current task as the closest deadline task
     this.nextDueDates = []; // clear whole array
     this.nextDueDates.push(task);
    }
    else if(this.nextDueDates.length > 0 && (task.dueTo.toMillis() - this.nextDueDates[0].dueTo.toMillis() == 0) ){ // two tasks with same dueDate
      this.nextDueDates.push(task); // save multiple tasks, which have same closest Due date
    }
    this.nextDueDateTask = this.nextDueDates[0];
    
  }


  emptyAllArrays() {
    this.boards.forEach((board: any) => board.tasks = []);
    this.backlogtasks = [];
    this.allTasks = [];
    this.todoTasks = [];
    this.urgentTasks = [];
    this.nextDueDates = [];
  }

  sortTasksToBoards(task: any) {
    for (let i = 0; i < this.boards.length; i++) {
      if (task.board === 'backlog') {
        this.handleBacklogTasks(task);
      }
      else { this.handleBoardTasks(task, i); }
    }
  }

  filterUrgentTasks(task: any) {
    if (task.urgency == 'urgent') {
      this.urgentTasks.push(task)
    }
  }

  filterAllTasks(task: any) {
    this.allTasks.push(task);
  }

  filterToDoTasks(task: any) {
    if (task.board == 'ToDo') {
      this.todoTasks.push(task)
    }
  }

  handleBacklogTasks(task: any) {
    this.backlogtasks.push(task);
    // sorting into default order: by deadline
  }

  // Goal: pinned Task on Top of Board, then all other tasks sorted by createdAt
  sortBoardsDescending() {
    for (let i = 0; i < this.boards.length; i++) {

      let pinnedTasks: any = [];              // temporary subarrays from the board
      let unpinnedTasks: any = [];            // temporary subarrays from the board
      let unpinnedTasksSortByCreationTime: any = [];      // temporary subarrays from the board

      this.boards[i].tasks.map((task: any) => {
        if (task.isPinnedToBoard) {
          pinnedTasks.push(task);
        }
        if (!task.isPinnedToBoard) {
          unpinnedTasks.push(task);
        }
      }) // sort this array with "createdAt" descending
      unpinnedTasksSortByCreationTime = unpinnedTasks.sort((a: any, b: any) => Number(a.createdAt) - Number(b.createdAt));
      this.boards[i].tasks = pinnedTasks.concat(unpinnedTasksSortByCreationTime); // merge subarrays again to final sorted Array
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
    console.log('doc to collection task')
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
  //       this.handleTasks(result);
  //     });
  // }
  // ****************** OLD VERSION FROM SWITCHMAP METHOD ABOVE ********

    // convertDateFormat(task: any, targetDateFormat: string) {
  //   return new Date(task.dueTo['seconds'] * 1000).toLocaleDateString(targetDateFormat);
  //firestore dates are a timstamp object
  // }