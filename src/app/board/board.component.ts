import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError } from 'rxjs';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';
import { NewTaskComponent } from '../new-task/new-task.component';



@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'
  ]
})

export class BoardComponent implements OnInit {

  @ViewChildren('boardTitle') boardTitles!: QueryList<any>
  setFocusToTitle: CallableFunction = (currentTitle: number) => {
    let allTitles = this.boardTitles.toArray();  // toArray() is specific method for Querylists (e.g. with Viewchildren)
    setTimeout(() => { allTitles[currentTitle].nativeElement.focus() }, 200)
  }

  newBoardTitle: any;  // from inputfield ngModel (to ADD a new Board)
  editMode: boolean = false;
  doublicateAlert: boolean = false;
  deleteBoardAlert: boolean = false;
  currentBoard: any = {}; // board to delete

  constructor(public db: DatabaseService, public taskservice: TasksService) {
  }

  ngOnInit(): void { }


  addNewBoard() {
    let newBoard = { 'name': this.newBoardTitle, 'tasks': [], 'editable': false };
    this.db.addDocToCollection('boards', newBoard);
  }

  // Board Title Edit
  enterEditMode(i: number) {
    this.doublicateAlert = false;
    this.db.boards[i].editable = true;  // this change is only affecting local variable in db service (not the database in firestore) --> otherwise data would be newly rendered
    this.setFocusToTitle(i);
  }


  saveBoardTitle(inputTitle: string, boardIDinFirestore: any, i: number) {
    if (inputTitle === 'backlog' || inputTitle === 'Backlog') {
      alert('Backlog Tasks are already sorted to "Backlog" Section. Please choose another Title')
      this.setFocusToTitle(i);
      return
    }

    this.doublicateAlert = false;
    let findDouplicate = this.db.boards.filter((board: any) => {
      return (board.name == inputTitle)
    })

    if (findDouplicate.length <= 1) { // a return 1 means, its existing because ngModel already pushed the new name in local variable in db.service (boards)
      this.db.boards[i].editable = false;
      this.db.updateDoc('boards', boardIDinFirestore, { name: inputTitle });
      this.updateTasksOnBoard(inputTitle, boardIDinFirestore, i); // all tasks must change reference to new board name
    }
    else {
      this.doublicateAlert = true;
      this.setFocusToTitle(i);
    }
  }

  exitEditMode(i: number, event: Event) {
    console.log('exit', event.currentTarget);
    this.db.boards[i].editable = false;
  }

  stopPropagation(event: Event) {
    console.log('stoppropagation', event);
  }

  updateTasksOnBoard(newBoardTitle: any, boardIDinFirestore: any, i: number) {
    let tasksOnBoard: [] = this.db.boards[i].tasks;
    if (tasksOnBoard.length > 0) {
      tasksOnBoard.map((task: any) => {
        this.db.updateDoc('tasks', task.customIdName, { board: newBoardTitle })
      })
    }
  }

  deleteBoard(i: number, event: Event) {
    console.log('delete board requested');
    this.deleteBoardAlert = true;
    this.currentBoard = this.db.boards[i];
  }

  confirmDelete(): any {
    this.currentBoard.tasks.forEach((task: any) => {
      this.db.deleteDoc('tasks', task.customIdName)
    });
    this.db.deleteDoc('boards', this.currentBoard.customIdName);
  }

  editTask(task: any) {
    this.taskservice.currentTask = task;
    this.taskservice.taskPopupOpen = true;
    this.taskservice.editMode = true;
  }

  openTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }


  //++++++++  DRAG AND DROP ******
  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any) {
    ev.dataTransfer.setData("text", ev.target.id);
    // ev.target.id containes the HTML id="" of the div - the id of each task div is set to be the customID in Firestore for the element
  }

  drop(ev: any, targetboard: string) {
    ev.preventDefault();
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
