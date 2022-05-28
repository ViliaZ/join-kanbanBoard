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

  onConfirmDeleteBoard(): any { 
    this.alertService.confirmDeleteBoard();   
  }

  onCancelDeleteBoard() {
    this.alertService.cancelDeleteBoard();
  }

}
