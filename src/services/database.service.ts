import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  public categories: string[] = ['Design', 'Marketing', 'Finance', 'Admin', 'Other']
  public boards: any = [];
  public backlogtasks: any = [];
  public urgentTasks: any = [];
  public todoTasks: any = [];
  public allTasks: any = [];
  public nextDueDates: any = [];
  public nextDueDateTask: any = [];
  public backlogEmpty = () => this.backlogtasks.length == 0;
  public toDoBoardExists!: any;
  public guestIsInitialized: boolean = false;  // if true, guest - dummydata donot need to be created again

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthServiceService) {
  }

  getBoardAndTaskData(sortBoardsBy: string = 'createdAt', sortBoardOrder: any = 'asc', sortTasksBy: string = 'isPinnedToBoard', sortTasksOrder: any = 'desc') {
   if (this.authService.currentUser.uid !== undefined) {
    this.firestore
      .collection('boards', ref => ref
      .where('creator', '==', this.authService.currentUser.uid) // show only boards from current user
      .orderBy(sortBoardsBy, sortBoardOrder))  // default sort via timestamp
      .valueChanges({ idField: 'customIdName' })
      .pipe(switchMap((result: any) => { // result = boards with tasks
        this.boards = result;
        return this.firestore
          .collection('tasks', ref => ref
          .where('creator', '==', this.authService.currentUser.uid) // load only tasks from current user
          .orderBy(sortTasksBy, sortTasksOrder))
          .valueChanges({ idField: 'customIdName' });
      }))
      .subscribe(async (result) => { // result = tasks
        await this.emptyAllArrays();
        await this.setStaticBoards();
        this.handleTasks(result);
      });
  }}

  // create initial TODO Board
  async setStaticBoards() { // if no ToDo Board exists yet, create it (ToDo is a static board)
    this.toDoBoardExists = await this.boards.find((i: any) => i.name == 'ToDo');
    if (this.toDoBoardExists === undefined) {
       await this.addDocToCollection('boards', { name: 'ToDo', tasks: [], createdAt: new Date().getTime(), creator: this.authService.currentUser.uid})
    }
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
    if (this.nextDueDates.length == 0) { // push first task in array --> if only one task exists, this one will be the one with closest deadline
      this.nextDueDates.push(task);
    }
    else if (this.nextDueDates.length > 0 && (task.dueTo.toMillis() - this.nextDueDates[0].dueTo.toMillis() < 0)) { // compare dueTo Date in milliseconds
      // if current task has closer deadline as task before, clear array and save current task as the closest deadline task
      this.nextDueDates = []; // clear whole array
      this.nextDueDates.push(task);
    }
    else if (this.nextDueDates.length > 0 && (task.dueTo.toMillis() - this.nextDueDates[0].dueTo.toMillis() == 0)) { // two tasks with same dueDate
      this.nextDueDates.push(task); // save multiple tasks, which have same closest Due date
    }
    this.nextDueDateTask = this.nextDueDates[0];
  }

  async emptyAllArrays(): Promise<void> {
    await this.boards.forEach((board: any) => board.tasks = []);
    this.backlogtasks = [];
    this.allTasks = [];
    this.todoTasks = [];
    this.urgentTasks = [];
    this.nextDueDates = [];
  }

  sortTasksToBoards(task: any) {
    for (let i = 0; i < this.boards.length; i++) {
      if (task.board === 'backlog') {  // check if backlog task
        this.handleBacklogTasks(task);
      }
      else { this.handleBoardTasks(task, i) }
    }
  }

  filterUrgentTasks(task: any): void {
    if (task.urgency == 'urgent') {
      this.urgentTasks.push(task)
    }
  }

  filterAllTasks(task: any): void {
    this.allTasks.push(task);
  }

  filterToDoTasks(task: any): void {
    if (task.board == 'ToDo') {
      this.todoTasks.push(task)
    }
  }

  handleBacklogTasks(task: any): void {   // sorting into default order: by deadline
    let taskExistsInArray = this.backlogtasks.find((t: any) => t.customIdName == task.customIdName)
    if (taskExistsInArray == undefined) {  // check if already there -> avoid duplicates
      this.backlogtasks.push(task);
    }
  }

  handleBoardTasks(task: any, i: number): void {
    let taskExistsInArray = this.boards[i].tasks.find((t: any) => t.customIdName == task.customIdName)
    if (task.board === this.boards[i].name && taskExistsInArray == undefined) {
      if (task.createdAt) {  // necessary??
        this.boards[i].tasks.push(task);
      }
    }
  }

  // Goal: pinned Task on Top of Board, then all other tasks sorted by createdAt
  sortBoardsDescending(): void {
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

  updateDoc(collection: string, docID: string, updateData: object): Promise<any> {
    return this.firestore.collection(collection).doc(docID).update(updateData);
  }

  async addDocToCollection(collection: string, doc: object): Promise<any> {
    await this.firestore.collection(collection).add(doc);
  }

  deleteDoc(collection: string, docID: string): void {
    this.firestore.collection(collection).doc(docID).delete();
  }

}
