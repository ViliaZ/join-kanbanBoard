import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BacklogComponent } from './backlog/backlog.component';
import { BoardComponent } from './board/board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'board', component: BoardComponent },
  { path: 'backlog', component: BacklogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
