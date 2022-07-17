import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Board } from 'src/models/board';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';
import { EventemitterService } from 'src/services/eventemitter.service';
import { TasksService } from 'src/services/tasks.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { AlertService } from 'src/services/alert.service';
import { DragdropService } from 'src/services/dragdrop.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChildren('boardTitle') boardTitles!: QueryList<any>;

  public editMode: boolean = false; // title edits
  public newBoardTitle: string | number = ''; // from inputfield ngModel (to ADD a new Board)
  public currentBoard: any = {}; // board to delete
  public draggingInProgress: boolean = false;

  constructor(
    public db: DatabaseService,
    public taskservice: TasksService,
    private authService: AuthServiceService,
    private eventEmitterService: EventemitterService,
    public alertService: AlertService,
    public dragdropService: DragdropService
  ) {}

  ngOnInit(): void {
    this.listenToEventEmitter();
  }

  // get updates if user filled inputfield for new board title (in menu comp) via EventemitterService
  listenToEventEmitter(): void {
    if (this.eventEmitterService.subscription == undefined) {
      this.eventEmitterService.subscription =
        this.eventEmitterService.callBoardEventHandler.subscribe(
          (data: string) => {
            this.addNewBoard(data);
          }
        );
    }
  }

  // userinput string from inputfield for adding a new board
  addNewBoard(newBoardName: string): void {
    let duplicate = this.checkDuplicates(newBoardName);
    if (newBoardName.length > 0 && !duplicate) {
      let newBoard = Board.getEmptyBoard(
        newBoardName,
        this.authService.currentUser.uid
      ); 
      this.db.addDocToCollection('boards', newBoard);
    } else {
      this.newBoardTitle = '';
      this.alertService.setAlert('duplicateAlert');
    }
  }

  trackByIndex(index: any): number {
    return index;
  }

  // Board Title Edit
  enterEditMode(i: number): void {
    if (this.db.boards[i].name == 'ToDo') {
      this.alertService.setAlert('editsProhibited');
      return;
    }
    this.db.boards[i].editable = true; // set LOCALLY in db.service (not in firestore) --> otherwise data would be newly rendered
    this.setFocusToTitle(i);
  }

  // disable Inputfield Board Title
  exitEditMode(i: number): void {
    this.db.boards[i].editable = false;
  }

  saveBoardTitle(inputData: any, boardIDinFirestore: any, i: number): void {
    if (inputData.length === 0) {
      this.alertService.setAlert('duplicateAlert');
      this.setFocusToTitle(i);
      return;
    } else if (inputData.toLowerCase() === 'backlog') {
      this.alertService.setAlert('backlogAlert');
      this.setFocusToTitle(i);
      return;
    } else if (this.db.boards[i].name == inputData) {
      // if no changes are made
      this.db.boards[i].editable = false; // only local change in db.service (no new render from db firestore)
      return;
    } else if ((!!this.checkDuplicates(inputData))) {
      this.alertService.setAlert('duplicateAlert');
      this.setFocusToTitle(i);
      return;
    }
    // handle success case --> no duplicates, no "backlog", inputdata.length > 0
    else {
      this.db.updateDoc('boards', boardIDinFirestore, { name: inputData });
      this.updateAllTasksToNewBoardname(inputData, boardIDinFirestore, i); // all tasks must change reference to new board name
    }
  }

  checkDuplicates(inputTitle: string): Boolean {
    let foundDouplicate = this.db.boards.some(
      (board: any) => board.name == inputTitle
    );
    if (foundDouplicate) {
      return true;
    } else {
      return false;
    }
  }

  // after Board title was changed, update property "board" on every task obj
  updateAllTasksToNewBoardname(newBoardTitle: any, boardIDinFirestore: any, i: number) {
    let tasksOnBoard: [] = this.db.boards[i].tasks;
    if (tasksOnBoard.length > 0) {
      tasksOnBoard.map((task: any) => {
        this.db.updateDoc('tasks', task.customIdName, { board: newBoardTitle });
      });
    }
  }

  // EventHandler: delete Board REQUEST--> opens Confirmation Alert
  deleteBoard(i: number): void {
    this.currentBoard = this.db.boards[i];
    if (this.currentBoard.name == 'ToDo') {
      this.alertService.setAlert('editsProhibited');
      return;
    } else {
      this.alertService.indexOfBoardToDelete = i;
      this.alertService.setAlert('confirmDeleteBoard');
    }
  }

  // Click on existing Task to edit
  editTask(task: any): void {
    this.taskservice.currentTask = task;
    this.taskservice.taskPopupOpen = true;
    this.taskservice.editMode = true;
  }

  openTaskPopUp(currentBoardName: string): void {
    // consider implementing: prefill with currentBoardname
    this.taskservice.taskPopupOpen = true;
  }

  setFocusToTitle (currentTitle: number): void {
    let allTitles = this.boardTitles.toArray(); // toArray() is specific method for Querylists (e.g. with Viewchildren)
    setTimeout(() => {
      allTitles[currentTitle].nativeElement.focus();
    }, 200);
  };

  //++++++++  DRAG AND DROP ******
  allowDrop(ev: any): void {
    this.dragdropService.allowDrop(ev);
  }

  drag(ev: any): void {
    this.dragdropService.drag(ev);
    this.draggingInProgress = !this.draggingInProgress;
  }


  drop(ev: any, targetboard: string): void {
    if (!!this.droppingIsAllowed(ev)){
      this.dragdropService.drop(ev, targetboard);
    }
    if (!!this.draggingInProgress){
      this.draggingInProgress = false;
    } 
  }

  droppingIsAllowed(ev: any): Boolean {
    if(ev.target.classList.contains('noDrop')) {
      return false;
    } else {
      return true;
    }
}   

}

