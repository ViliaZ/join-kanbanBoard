import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-logout-success',
  templateUrl: './logout-success.component.html',
  styleUrls: ['./logout-success.component.scss']
})
export class LogoutSuccessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
