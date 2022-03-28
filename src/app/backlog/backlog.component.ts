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
    this.firestore
      .collection('tasks')
      .valueChanges()
      .subscribe((result) => {
        this.tasks = result;
        this.backlogtasks = result.filter((item: any) => {
          // convert to local timeformat (in firebase data is set dueTo['seconds']= seconds)
          item.dueTo = new Date(item.dueTo['seconds']).toLocaleDateString('en-GB');
          // filter all backlog tasks
          let result = item.board === "backlog";
          return result
        })
        // console.log('backlogtasks due', new Date(this.backlogtasks[1].dueTo['seconds']).toLocaleDateString())

      });
  }


  ngOnInit(): void {
  }



  movetoBoardToDo(i: number) {
    // get ID of Task
    i = 2;
    this.firestore.collection("firestoreSammlung").doc('idinFirestore').update({ foo: "bar" });
    // change task['board'] = todo; 
    // render new --> macht angular selbst


  }

  editTask() {
  }

  deleteTask() { }
}


