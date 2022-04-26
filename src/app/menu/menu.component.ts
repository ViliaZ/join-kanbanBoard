import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {


  public activeNavItem: string = 'home';

  constructor(public auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.auth.signOut().then(()=> this.router.navigate(['']));
  }
}
