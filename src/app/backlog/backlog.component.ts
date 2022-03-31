import { Component, OnInit, OnChanges } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  backlogEmpty: boolean = false;

  constructor(public db: DatabaseService) {
    this.db.getBacklogTasks();
  }

  ngOnInit(): void {
  }

  moveToBoardToDo(idInFirestore: string) {
    this.db.updateDoc('tasks', idInFirestore, { board: 'todo' });
  }

  updateDoc(collection: string, docID: string, updateData: object) {
    this.db.updateDoc(collection,docID, updateData)
  }

  editTask(idInFirestore: string) {
  }

  deleteTask(idInFirestore: string) {
    this.db.deleteDoc('tasks', idInFirestore);
  }

}

