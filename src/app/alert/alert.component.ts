import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/services/alert.service';
import { DatabaseService } from 'src/services/database.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() currentBoard!: any;

  constructor( 
    public alertService: AlertService,
    private db: DatabaseService ) {
   }

  ngOnInit(): void {
  }

  // eventHandler: delete CONFIRMED --> close alert
  confirmDelete(): any {
    this.currentBoard.tasks.forEach((task: any) => { // first: delete all tasks on board
      this.db.deleteDoc('tasks', task.customIdName)
    });
    this.db.deleteDoc('boards', this.currentBoard.customIdName);
    this.alertService.setAlert('confirmDeletion', 'close'); // reset alert
  }

  cancelDelete() {
    this.alertService.setAlert('confirmDeletion', 'close'); // reset alert

    // this.alertService.alerts.confirmDeletion = false;
  }

}
