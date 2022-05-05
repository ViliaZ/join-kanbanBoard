import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  public categories: string[] = ['Design', 'Marketing', 'Finance', 'Admin', 'Other']
  public boards: any = []; // contains boards and tickets for each board as array
  public backlogtasks: any = [];
  public urgentTasks: any = [];
  public todoTasks: any = [];
  public allTasks: any = [];
  public nextDueDates: any = [];
  public nextDueDateTasks: any = [];  // can also be multiple tasks with same due Date
  public backlogEmpty = () => this.backlogtasks.length == 0;
  public toDoBoardExists!: boolean;  // ToDo Board as static (undeletable) Board for EVERY User
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
          console.log('result', result);

          this.boards = result;
          return this.firestore
            .collection('tasks', ref => ref
              .where('creator', '==', this.authService.currentUser.uid) // load only tasks from current user
              .orderBy(sortTasksBy, sortTasksOrder))
            .valueChanges({ idField: 'customIdName' });
        }))
        .subscribe(async (result) => { // result = tasks
          this.allTasks = result;
          await this.emptyAllArrays();
          await this.setStaticBoards();
          this.handleTasks(result);
        });
    }
  }

  // create initial TODO Board
  async setStaticBoards() { // if no ToDo Board exists yet, create it (ToDo is a static board)
    this.toDoBoardExists = await this.boards.find((i: any) => i.name == 'ToDo');
    if (this.toDoBoardExists === undefined) {
      await this.addDocToCollection('boards', { name: 'ToDo', tasks: [], createdAt: new Date().getTime(), creator: this.authService.currentUser.uid })
    }
  }

  // Handle every task:
  async handleTasks(tasks: any) {
    for (let i = 0; i < tasks.length; i++) {   // async await  doesnt work on forEach --> use standard for loop
      tasks[i].dueTo = await tasks[i].dueTo.toDate();
      this.filterUrgentTasks(tasks[i]);
      this.filterToDoTasks(tasks[i]);
      this.sortTasksToBoards(tasks[i]);
    }
    this.getNextDueDateTask(tasks);
    this.sortBoardsDescending();
  }


  // find 1 or more Tasks with upmost Deadline #1
  getNextDueDateTask(tasks: any) {
    let sortedTasks = tasks.sort(this.getSortOrder("dueTo")); //Pass the attribute to be sorted on  
    sortedTasks.map((task: any) => {  // convert each date into year-moonth-day - without time / Goal is to get comparison oonly based on date, not clock time
      task.dueTo = new Date(task.dueTo).toLocaleString('en', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    })
    // if multiple tasks have the next dueDate, then save all into this.nextDueDateTasks
    this.nextDueDateTasks = sortedTasks.filter((task: any) => task.dueTo == sortedTasks[0].dueTo)

    console.log('new date:', sortedTasks);
    console.log('nextDueDateTasks:', this.nextDueDateTasks);
  }

  // sorting function for getNextDueDateTask() #2
  getSortOrder(prop: string) {  // property to be sorted by
    return function (a: any, b: any) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  async emptyAllArrays(): Promise<void> {
    await this.boards.forEach((board: any) => board.tasks = []);
    this.backlogtasks = [];
    this.allTasks = [];
    this.todoTasks = [];
    this.urgentTasks = [];
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
