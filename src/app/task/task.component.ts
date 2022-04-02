import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() task:any;

  constructor(private db: DatabaseService) {
   }

  ngOnInit(): void {
  }



}
