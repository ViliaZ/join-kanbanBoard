import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  backlogEmpty:boolean = false;

  tasks:any = [];

  title:string = 'hello';
  item:any;

  constructor(public firestore: AngularFirestore) { 
    this.item = this.firestore
    .collection('tasks')
    .valueChanges()
    .subscribe((result)=> {

      console.log('this.tasks in backlog', result);
      let backlog = result.filter((item:any)=>{let res=item.category ==="Marketing"; return res})
      console.log('backlogtasks', backlog)

      // this.backlogtasks=this.tasks.includes('backlog');
      // console.log('backlogtasks', this.backlogtasks)
    
    });

    // this.backlogtasks = this.tasks.filter((task:any)=>{task.board ==='backlog'})
    // console.log('backlogtasks', this.backlogtasks)
  }

  ngOnInit(): void {
  }

}
