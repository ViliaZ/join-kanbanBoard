import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataService } from 'src/services/data.service';


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

    console.log('AddTask: original time', this.task['dueTo'] )
    this.firestore.collection('tasks').add(this.task).then((result:any)=> console.log('task added', result ))
  }

}


