import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatabaseService } from 'src/services/database.service';
import { TasksService } from 'src/services/tasks.service';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  task: any = {
    title: '',
    description: '',
    dueTo!: '',
    urgency: '',
    board: 'backlog',
    category: '',
    users: ''
  }
  
  constructor(public db: DatabaseService, public tasksService: TasksService) {

  }
  ngOnInit(): void {
  }

  saveTask() {
    console.log(this.task);
    this.db.addDocToCollection('tasks', this.task)
  }


  setUrgency(urgency = 'normal') {
    // default: normal
   console.log(urgency);
    
  }

}
