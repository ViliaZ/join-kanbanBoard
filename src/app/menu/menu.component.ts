import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {


  public activeNavItem: string = 'home';

  constructor(public authService: AuthServiceService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
  }

}
