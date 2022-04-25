import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { catchError } from 'rxjs';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'
  ]
})

export class BoardComponent implements OnInit {

  @ViewChildren('boardTitle') boardTitles!: QueryList<any>

  setFocusToTitle: CallableFunction = (currentTitle: number) => { // focus current title
    let allTitles = this.boardTitles.toArray();  // toArray() is specific method for Querylists (e.g. with Viewchildren)
    setTimeout(() => { allTitles[currentTitle].nativeElement.focus() }, 200)
  }

  editMode: boolean = false;  // title edits
  newBoardTitle: any = '';  // from inputfield ngModel (to ADD a new Board)
  currentBoard: any = {}; // board to delete
  doublicateAlert: boolean = false;
  deleteBoardAlert: boolean = false;

  constructor(public db: DatabaseService, public taskservice: TasksService) {
  }

  ngOnInit(): void { }

  // input New Board
  async addNewBoard() {
   let duplicate = await this.checkDuplicates(this.newBoardTitle);
   
  if (this.newBoardTitle.length > 0 && !duplicate){   
    let newBoard = { 'name': this.newBoardTitle, 'tasks': [], 'editable': false, 'createdAt': new Date().getTime() };
    this.db.addDocToCollection('boards', newBoard);
  }
  else {
    this.newBoardTitle = '';
    this.doublicateAlert = true
    setTimeout(()=>{ this.doublicateAlert = false},2000)
  }
  }

  // Board Title Edit
  enterEditMode(i: number) {
    this.doublicateAlert = false;
    this.db.boards[i].editable = true;  // this change is only affecting local variable in db service (not the database in firestore) --> otherwise data would be newly rendered
    this.setFocusToTitle(i);
  }

  // Board Title Edit exit
  exitEditMode(i: number) {
    this.db.boards[i].editable = false;
  }

  stopPropagation(event: Event) {
    console.log('stoppropagation', event);
  }

  async saveBoardTitle(inputTitle: string, boardIDinFirestore: any, i: number) {
    if (inputTitle === 'backlog' || inputTitle === 'Backlog') {
      alert('Backlog Tasks are already sorted to "Backlog" Section. Please choose another Title')
      this.setFocusToTitle(i);
      return
    }
    // handle duplicate check
    if (await this.checkDuplicates(inputTitle) == false && inputTitle.length > 0){ // no duplicates found, proceed normally
      this.db.boards[i].editable = false;
      this.db.updateDoc('boards', boardIDinFirestore, { name: inputTitle });
      this.updateTasksOnBoard(inputTitle, boardIDinFirestore, i); // all tasks must change reference to new board name
    }
    else { // duplicates found
      this.doublicateAlert = true;
      this.setFocusToTitle(i);
    }

  }

  // Check for Title DUPLICATES --> boolean
  async checkDuplicates(inputTitle: string) {
    this.doublicateAlert = false;
    let findDouplicate = await this.db.boards.find((board: any) => board.name == inputTitle)    

    if (findDouplicate) { //  1 means, its existing because ngModel already pushed the new name in local variable in db.service (boards)
      console.log('duplicates found')
      return true
    }
    else {
      console.log('no duplicates found')
      return false
    }
  }

  updateTasksOnBoard(newBoardTitle: any, boardIDinFirestore: any, i: number) {
    let tasksOnBoard: [] = this.db.boards[i].tasks;
    if (tasksOnBoard.length > 0) {
      tasksOnBoard.map((task: any) => {
        this.db.updateDoc('tasks', task.customIdName, { board: newBoardTitle })
      })
    }
  }

  // eventHandler: delete Board REQUEST--> opens Confirmation Alert
  deleteBoard(i: number, event: Event) {
    this.deleteBoardAlert = true;
    this.currentBoard = this.db.boards[i];
  }

  // eventHandler: delete CONFIRMED 
  confirmDelete(): any {
    this.currentBoard.tasks.forEach((task: any) => { // first: delete all tasks on board
      this.db.deleteDoc('tasks', task.customIdName)
    });
    this.db.deleteDoc('boards', this.currentBoard.customIdName);
    this.deleteBoardAlert = false;
  }

  editTask(task: any) {
    this.taskservice.currentTask = task;
    this.taskservice.taskPopupOpen = true;
    this.taskservice.editMode = true;
  }

  // hide description text of card
  closeExpandCard() {
    this.taskservice.currentTask = {};
    this.taskservice.detailsRequested = false;
  }

  // new Task or Edit Task
  openTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }

  //++++++++  DRAG AND DROP ******
  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any) {
    console.log( ev.target.id);
    ev.dataTransfer.setData("text", ev.target.id);
  
    // ev.target.id containes the HTML id="" of the div - the id of each task div is set to be the customID in Firestore for the element
  }

  drop(ev: any, targetboard: string) {
    ev.preventDefault();
    console.log(targetboard);
    
    let dataID = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(dataID));
    // "data" returns the HTML Id of the dragged element - this id is set to be the customID in Firestore for the element

    // change 'board' to new board in firestore
    try {
      this.db.updateDoc('tasks', dataID, { board: targetboard });
    } catch (error) {
      console.log(error);
    }
  }

}
