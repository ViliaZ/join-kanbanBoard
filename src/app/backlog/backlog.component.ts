import { Component, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit, OnChanges {

  backlogEmpty: boolean = false;
  


  public tasks: any = []; // all tasks
  backlogtasks: any = []; // filtered 
  public item: any;

  constructor(public firestore: AngularFirestore) {
    this.item = this.firestore
    .collection('tasks')
    .valueChanges()
    .subscribe((result) => {
      this.tasks = result;
      this.backlogtasks = result.filter((item: any) => { let result = item.board === "backlog"; return result })
      console.log('backlogtasks', this.backlogtasks);
    });

  }

  ngOnChanges(): void {

   }

  ngOnInit(): void {
  }

}


