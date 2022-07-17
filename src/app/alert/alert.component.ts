import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() currentBoard!: any;

  constructor( 
    public alertService: AlertService) {
   }

  ngOnInit(): void {
  }

  onConfirmDeleteBoard(): void { 
    this.alertService.confirmDeleteBoard();   
  }

  onCancelDeleteBoard(): void {
    this.alertService.cancelDeleteBoard();
  }

}
