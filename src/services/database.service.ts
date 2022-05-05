import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { Board } from 'src/models/board';
import { Task } from 'src/interfaces/task';


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
  public toDoBoardExists: boolean = false;  // ToDo Board as static (undeletable) Board for EVERY User
  public guestIsInitialized: boolean = false;  // if true, guest - dummydata donot need to be created again


  constructor(
    private firestore: AngularFirestore,
    private authService: AuthServiceService) {
  }
// switchmap: https://blog.angular-university.io/rxjs-switchmap-operator/
  getBoardAndTaskData( // all parameters are defined by me
    sortBoardsBy: string = 'createdAt',
    sortBoardOrder: any = 'asc') {
    this.firestore
      .collection('boards', ref => ref
        .where('creator', '==', this.authService.currentUser.uid) // show only boards from current user
        .orderBy(sortBoardsBy, sortBoardOrder))  // default sort via timestamp
      .valueChanges({ idField: 'customIdName' })
      .pipe(switchMap((result: any) => { // result = boards with tasks
        this.boards = result;
        return this.firestore
          .collection('tasks', ref => ref
            .where('creator', '==', this.authService.currentUser.uid)) // load only tasks from current user
          .valueChanges({ idField: 'customIdName' });
      }))
      .subscribe(async (result) => { // result = tasks
        this.allTasks = result;
        this.emptyAllArrays();
        await this.setStaticBoards();
        await this.handleTasks(result);
      });
  }

  // create initial ToDo Board
  async setStaticBoards() { // if no ToDo Board exists yet, create it (ToDo is a static board)
    this.toDoBoardExists = await this.boards.some((i: any) => i.name === 'ToDo');  // some() returns boolean
    if (this.toDoBoardExists === false) {
      let newToDoBoard = Board.getEmptyBoard('ToDo', this.authService.currentUser.uid) // call a static function inside board.ts
      await this.addDocToCollection('boards', newToDoBoard)
    } 
  }

  // Handle every task:
  async handleTasks(tasks: any) {
    for (let i = 0; i < tasks.length; i++) {   // async await  doesnt work on forEach --> use standard for-loop
      tasks[i].dueTo = await tasks[i].dueTo.toDate();
      await this.sortTasksToBoards(tasks[i]);
    }
    this.urgentTasks = tasks.filter((t: any) => t.urgency == 'urgent');
    this.todoTasks = tasks.filter((t: any) => t.board == 'ToDo');
    this.backlogtasks = tasks.filter((t: any) => t.board == 'backlog');
    this.getNextDueDateTask(tasks);
    this.sortTasksDescending(); // all tasks on each board are sorted - pinned tasks on top
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
  }

  // sorting function for getNextDueDateTask() #2
  getSortOrder(prop: string) {  // property to be sorted by
    return function (a: any, b: any) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      } return 0;
    }
  }

  emptyAllArrays() {
    this.boards.forEach((board: any) => board.tasks = []);
    this.backlogtasks = [];
    this.allTasks = [];
    this.todoTasks = [];
    this.urgentTasks = [];
  }

  async sortTasksToBoards(task: any) {    
    for (let i = 0; i < this.boards.length; i++) {
      let taskExistsInArray: boolean = await this.boards[i].tasks.some((t: any) => t.customIdName === task.customIdName)  // returns boolean
      if (task.board === this.boards[i].name && !taskExistsInArray) {
        await this.boards[i].tasks.push(task);
      }
    }
    console.log('boards in sort into boards',this.boards);
    for (let i = 0; i < this.boards.length; i++) {
      let taskExistsInArray: boolean = await this.boards[i].tasks.some((t: any) => t.customIdName === task.customIdName)  // returns boolean
      if (task.board === this.boards[i].name && !taskExistsInArray) {
        await this.boards[i].tasks.push(task);
      }
    }
  }

  // Goal: pinned Task on Top of Board, then all other tasks sorted by createdAt
  async sortTasksDescending(): Promise<void> {
    console.log('alltasks',this.allTasks);
    console.log('boards',this.boards);
    for (let i = 0; i < this.boards.length; i++) {
      console.log('all tasks current board',this.boards[i].name, this.boards[i].tasks);

      let currentBoardTasks = this.boards[i].tasks;
      console.log('currentBoardTasks',currentBoardTasks.filter((t:any)=>t.isPinnedToBoard));
      
      let pinnedTasks = currentBoardTasks.filter( (t: any) => t.isPinnedToBoard)
      console.log('pinnedTasks',pinnedTasks);
      let unpinnedTasks = currentBoardTasks.filter((t: any) => !t.isPinnedToBoard)
      console.log('unpinnedTasks',unpinnedTasks);
      // let unpinnedTasksSortByCreationTime = unpinnedTasks.sort((a: any, b: any) => Number(a.createdAt) - Number(b.createdAt));
      let unpinnedTasksSortByCreationTime = await unpinnedTasks.sort(this.getSortOrder("createdAt"));
      console.log('unpinnedTasksSortByCreationTime',unpinnedTasksSortByCreationTime);

      this.boards[i].tasks = await pinnedTasks.concat(unpinnedTasksSortByCreationTime); // merge subarrays again to final sorted Array
      // console.table('ENDE name:', this.boards[i].name);
      // console.table('ENDE tasks:', this.boards[i].tasks);
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
