import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from '../data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  task: any = {
  };

// via ngModel
  title: string = '';
  description: string = '';
  dueTo:any;
  urgency:string = '';
  board: string = '';
  category: string = '';
  users: any = '';

  constructor(private firestore: AngularFirestore, public dataService: DataService) {

  }
  ngOnInit(): void {
  }

  saveTask(){
    // fill the task object with input from ngModel
    this.task['ticketId'] = new Date().getTime();
    this.task['title'] = this.title;
    this.task['description'] = this.description;
    this.task['dueTo'] = this.dueTo;
    this.task['urgency'] = this.urgency;
    this.task['category'] = this.category;
    this.task['board'] = 'backlog';    
    this.task['users'] = this.users;


    console.log('dueTo', this.task['dueTo'] )
    // save task json to firestore database
    this.firestore.collection('tasks').add(this.task).then((result:any)=> console.log('task added', result ))
  // this.setDate(this.dueTo);
  }

  // date:any;
  // formattedDate:any;
  // setDate(date: string) {
  //   this.date = date;
  //   this.formattedDate = new Date(date)
  //   console.log('date now', this.gmtDate.toLocaleDateString());
  // }

}


