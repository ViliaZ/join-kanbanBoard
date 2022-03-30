import { Component, OnInit, OnChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatabaseService } from 'src/services/database.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  backlogEmpty: boolean = false;

  constructor(public db: DatabaseService, public firestore: AngularFirestore) {
    this.db.getBacklogTasks();
  }

  ngOnInit(): void {
  }

  moveToBoardToDo(idInFirestore: string) {
    let updateData: object = { board: 'todo' };
    this.db.updateDoc('tasks', idInFirestore, updateData);
  }

  updateDoc(collection: string, docID: string, updateData: object) {
    this.firestore.collection(collection).doc(docID).update(updateData);
  }

  editTask(idInFirestore: string) {
  }

  deleteTask(idInFirestore: string) {
    this.db.deleteDoc('tasks', idInFirestore);
  }

}

