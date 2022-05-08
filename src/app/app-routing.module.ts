import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BacklogComponent } from './backlog/backlog.component';
import { BoardComponent } from './board/board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LogoutSuccessComponent } from './logout-success/logout-success.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
{ path: '', redirectTo: 'home', pathMatch: 'full' },
{ path: 'home', component: DashboardComponent },
{ path: 'login', component: LoginPageComponent },
{ path: 'imprint', component: ImprintComponent },
{ path: 'board', component: BoardComponent },
{ path: 'backlog', component: BacklogComponent },
{ path: 'signup', component: SignupComponent },
{ path: 'logout', component: LogoutSuccessComponent },
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
