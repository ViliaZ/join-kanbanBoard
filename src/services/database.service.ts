import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { Board } from 'src/models/board';
import { Task } from 'src/models/task';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  public boards: any = [];                                      // contains boards and tickets for each board as array
  public backlogtasks: any = [];
  public urgentTasks: any = [];
  public todoTasks: Task[] = [];
  public allTasks: any = [];
  public nextDueDateTasks: any = [];                            // can also be multiple tasks with same due Date
  public backlogEmpty = () => this.backlogtasks.length == 0;
  public toDoBoardExists: boolean = false;                      // ToDo Board as static (undeletable) Board for EVERY User
  public guestIsInitialized: boolean = false;                   // if true, guest - dummydata donot need to be created again
  public userUid: string = '';
  public userCategories$: BehaviorSubject<any> = new BehaviorSubject(['Design', 'Marketing', 'Finance', 'Admin', 'Other']);


  constructor(
    private firestore: AngularFirestore,
    private authService: AuthServiceService) {
    this.authService.userUid$.subscribe((result: any) => {
      this.userUid = result;
      this.getBoardAndTaskData();
      this.getUserCategories();
    })
  }

  async getBoardAndTaskData(
    sortBoardsBy: string = 'createdAt',
    sortBoardOrder: any = 'asc',
    sortTasksBy: string = 'dueTo',
    sortTasksOrder: any = 'asc'): Promise<any>{

    if (this.userUid !== 'noUser') {
      return this.firestore
        .collection('boards', ref => ref
          .where('creator', '==', this.userUid)       // show only boards from current user
          .orderBy(sortBoardsBy, sortBoardOrder))     // default sort: via timestamp
        .valueChanges({ idField: 'customIdName' })
        .pipe(switchMap((result: any) => {
          this.boards = result as Board[];            // Read More: Type Assertion https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
          return this.firestore
            .collection('tasks', ref => ref
              .where('creator', '==', this.userUid)   // load only tasks from current user
              .orderBy(sortTasksBy, sortTasksOrder))  // default sort via timestamp
            .valueChanges({ idField: 'customIdName' })
        }))
        .subscribe(async (result) => {                // result = tasks[]
          this.emptyAllArrays();
          result.forEach((task) => this.allTasks.push(new Task(task).toJson()))  // must be called after all Arrays are empty
          this.handleTasks(result);
        });
    }
  }

  async getUserCategories() {  // =  categories for tasks
    this.firestore.collection('users').doc(this.userUid)
      .valueChanges()
      .subscribe((result: any) => {
        this.userCategories$.next(result?.customCategories);
      }
      )}

  handleTasks(tasks: any) {
        for(let i = 0; i<tasks.length; i++) {   // async await  doesnt work on forEach --> use standard for-loop
      tasks[i].dueTo = tasks[i].dueTo.toDate();
      this.sortTasksToBoards(tasks[i]);
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
    // this.nextDueDateTasks contains all Tasks with next dueDate - even if multiple task with same deadline
    this.nextDueDateTasks = sortedTasks.filter((task: any) => task.dueTo == sortedTasks[0].dueTo)
  }

  // General sorting function; usesd for getNextDueDateTask() & sortTasksDescending()
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

  sortTasksToBoards(task: any) {
    for (let i = 0; i < this.boards.length; i++) {
      // check if task already exists in board.tasks.array --> avoid duplicates
      let taskExistsInArray: boolean = this.boards[i].tasks.some((t: any) => t.customIdName === task.customIdName)  // returns boolean

      if ((task.board === this.boards[i].name) && !taskExistsInArray) {
        this.boards[i].tasks.push(task);
      }
    }
    // console.log(this.boards);  // ERROR!! Duplicate boards
  }

  // Goal: pinned Task on Top of Board, then all other tasks sorted by createdAt
  sortTasksDescending(): void {
    for (let i = 0; i < this.boards.length; i++) {
      // split tasks array into pinned and unpinned 
      let pinnedTasks = this.boards[i].tasks.filter((t: any) => t.isPinnedToBoard)
      let unpinnedTasks = this.boards[i].tasks.filter((t: any) => !t.isPinnedToBoard)
      let unpinnedTasksSortByCreationTime = unpinnedTasks.sort(this.getSortOrder("createdAt"));
      // concat both task arrays again
      this.boards[i].tasks = pinnedTasks.concat(unpinnedTasksSortByCreationTime); // merge subarrays again to final sorted Array
    }
  }

  async updateDoc(collection: string, docID: string, updateData: object): Promise<any> {
    return this.firestore.collection(collection).doc(docID).update(updateData);
  }

  async addDocToCollection(collection: string, doc: object): Promise<any> {
    return this.firestore.collection(collection).add(doc);
  }

  async deleteDoc(collection: string, docID: string): Promise<void> {
    await this.firestore.collection(collection).doc(docID).delete();
  }

}
