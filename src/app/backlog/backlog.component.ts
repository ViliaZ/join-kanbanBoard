import { Component, OnInit, OnChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  backlogEmpty: boolean = false;
  dueDateFormatted: any;

  public tasks: any = []; // all tasks
  public backlogtasks: any = []; // filtered 


  constructor(public firestore: AngularFirestore) {
    this.getBacklogTasks();
  }

  ngOnInit(): void {
  }

  getBacklogTasks() {
    this.firestore
      .collection('tasks', ref => ref.where('board', '==', 'backlog'))
      .valueChanges({ idField: 'customIdName' })
      .subscribe((result: any) => {
        this.backlogtasks = result;
        this.backlogtasks
          .map((task: any) => {
            task.dueTo = new Date(task.dueTo['seconds'] * 1000).toLocaleDateString('en-GB')
          }
          )
      })
  }

  // id is id in firestore for each item
  movetoBoardToDo(idInFirestore: string) {
    // change task['board'] = todo; 
    this.firestore.collection('tasks').doc(idInFirestore).update({ board: 'todo' })
  }

  editTask(idInFirestore: string) {
  }

  deleteTask(idInFirestore: string) {
    this.firestore.collection('tasks').doc(idInFirestore).delete();
  }
}

