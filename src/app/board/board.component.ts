import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Board } from 'src/models/board';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';
import { EventemitterService } from 'src/services/eventemitter.service';
import { TasksService } from 'src/services/tasks.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { AlertService } from 'src/services/alert.service';
import { Task } from 'src/models/task';
import { DragdropService } from 'src/services/dragdrop.service';

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

  // Info: Tooltip possible Positions
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];

  constructor(
    public db: DatabaseService,
    public taskservice: TasksService,
    private authService: AuthServiceService,
    private eventEmitterService: EventemitterService, 
    public alertService: AlertService, 
    public dragdropService: DragdropService) {
  }

  ngOnInit(): void {
    // this.db.getBoardAndTaskData();
    this.listenToEventEmitter();
  }

  // get updates if user filled inputfield for new board title (in menu comp) via EventemitterService
  listenToEventEmitter() {
    if (this.eventEmitterService.subscription == undefined) {
      this.eventEmitterService.subscription = this.eventEmitterService.
        callBoardEventHandler.subscribe((data: string) => {
          this.addNewBoard(data);
        });
    }
  }

  // userinput string from inputfield for adding a new board
  async addNewBoard(newBoardName: string) {
    let duplicate = await this.checkDuplicates(newBoardName);
    if (newBoardName.length > 0 && !duplicate) {
      let newBoard = Board.getEmptyBoard(newBoardName, this.authService.currentUser.uid);  // call a static function inside of model board
      this.db.addDocToCollection('boards', newBoard);
    } else {
      this.newBoardTitle = '';
      this.alertService.setAlert('duplicateAlert');
    }
  }

  // Board Title Edit
  enterEditMode(i: number) {
    if (this.db.boards[i].name == 'ToDo') {
      this.alertService.setAlert('editsProhibited');
      return
    }
    this.db.boards[i].editable = true;  // set LOCALLY in db.service (not in firestore) --> otherwise data would be newly rendered
    this.setFocusToTitle(i);
  }

  // disable Inputfield Board Title 
  exitEditMode(i: number) {
    this.db.boards[i].editable = false;
  }

  async saveBoardTitle(inputData: any, boardIDinFirestore: any, i: number) {
    if (inputData.length === 0) { // handle empty input  
      this.alertService.setAlert('duplicateAlert');
      this.setFocusToTitle(i);
      return
    }
    else if (inputData === 'backlog' || inputData === 'Backlog') {
      this.alertService.setAlert('backlogAlert');
      this.setFocusToTitle(i);
      return
    }
    else if (this.db.boards[i].name == inputData) {  // if no changes are made
      this.db.boards[i].editable = false;  // only local change in db.service (no new render from db firestore)
      return
    }
    else if (await this.checkDuplicates(inputData) == true) { // handle duplicates found
      this.alertService.setAlert('duplicateAlert');
      this.setFocusToTitle(i);
      return
    }
    // handle success case --> no duplicates, no backlog, inputdata.length > 0
    else {
      this.db.updateDoc('boards', boardIDinFirestore, { name: inputData });
      this.updateTasksOnBoard(inputData, boardIDinFirestore, i); // all tasks must change reference to new board name
    }
  }

  // Check for Title DUPLICATES --> boolean
  async checkDuplicates(inputTitle: string) {
    // this.alertService.alerts.duplicateAlert = false;    
    let foundDouplicate = await this.db.boards.some((board: any) => board.name == inputTitle)
    if (foundDouplicate) {
      console.log('duplicates found')
      return true
    }
    else {
      console.log('no duplicates found')
      return false
    }
  }

  // after Board title was changed, update property "board" on every task obj
  updateTasksOnBoard(newBoardTitle: any, boardIDinFirestore: any, i: number) {
    let tasksOnBoard: [] = this.db.boards[i].tasks;
    if (tasksOnBoard.length > 0) {
      tasksOnBoard.map((task: any) => {
        this.db.updateDoc('tasks', task.customIdName, { board: newBoardTitle })
      })
    }
  }

  // EventHandler: delete Board REQUEST--> opens Confirmation Alert
  deleteBoard(i: number) {
    this.currentBoard = this.db.boards[i];
    if (this.currentBoard.name == 'ToDo') {
      this.alertService.setAlert('editsProhibited');
      return
    } else {
      this.alertService.indexOfBoardToDelete = i;
      this.alertService.setAlert('confirmDeleteBoard');
  }
}

  // Click on existing Task to edit
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

  // Trigger: Click on Placeholder Task --> open empty Task BUT prefill it with current BoardName 
  openTaskPopUp(currentBoardName: string) {
    this.taskservice.taskPopupOpen = true;
    this.taskservice.editMode = true;
    this.taskservice.currentTask = new Task();
    this.taskservice.currentTask.board = currentBoardName;
  }

  //++++++++  DRAG AND DROP ******
  allowDrop(ev: any) {
    this.dragdropService.allowDrop(ev);
  }

  drag(ev: any) {
    this.dragdropService.drag(ev);
  }

  drop(ev: any, targetboard: string) {
    this.dragdropService.drop(ev, targetboard);
  }
}
