import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/services/tasks.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(public tasksservice: TasksService) { }

  ngOnInit(): void {
  }
}
