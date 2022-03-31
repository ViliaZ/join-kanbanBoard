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

  // @ViewChildren('columnTitle') boardTitles!: QueryList<any>

  @ViewChild('columnTitle') columnTitle!: ElementRef;

  newBoardName: any;  // from inputfield ngModel (new Board)

  constructor(public db: DatabaseService, public firestore: AngularFirestore, public taskservice: TasksService) {
  }

  ngOnInit(): void {
  }

  openTaskPopUp() {
    this.taskservice.taskPopupOpen = true;
  }

  addNewBoard() {
    let newBoard = { 'name': this.newBoardName, 'tasks': [], 'editable': false };
    this.db.addDocToCollection('boards', newBoard);
  }

  editTitle(boardIdInFirestore: string) {
   this.db.updateDoc('boards', boardIdInFirestore, { editable: true})
    this.columnTitle.nativeElement.focus()
    // setTimeout(() => { this.columnTitle.nativeElement.focus() }, 1000)

    console.log(this.columnTitle.nativeElement);

    // let boardTitlesArray = this.boardTitles.toArray()
    // boardTitlesArray[i].nativeElement.focus();

    // ViewChildren returns a querylist. toArray() is a method that can be called on a querlist
    // generate a normal array from the original querylist, content: all ElementRefs for the viewed Children
    // console.log(this.boardTitles.toArray()[0].focus())

  }

  saveNewTitle(inputTitle: any, boardIdInFirestore: any) {
    this.db.updateDoc('boards', boardIdInFirestore, { name: inputTitle });
    this.db.updateDoc('boards', boardIdInFirestore, { editable: false})

    // this.firestore.collection('boards').doc(boardIdInFirestore).update({ name: inputTitle })
    // this.boardTitles.nativeElement.setAttribute('disabled', true);

  }

  // updateDoc(collection: string, docID: string, updateData: object) {
  //   this.firestore.collection(collection).doc(docID).update(updateData);
  // }

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
    let data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    // "data" returns the HTML Id of the dragged element - this id is set to be the customID in Firestore for the element

    // change 'board' to new board in firestore
    try {
      this.firestore.collection('tasks').doc(data).update({ board: targetboard })
    } catch (error) {
      console.log(error);
    }
  }

}
