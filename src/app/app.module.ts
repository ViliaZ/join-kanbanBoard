import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImprintComponent } from './imprint/imprint.component';
import { BoardComponent } from './board/board.component';
import { BacklogComponent } from './backlog/backlog.component';
import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatSelectModule} from '@angular/material/select';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { NewTaskComponent } from './new-task/new-task.component';
import { TaskComponent } from './task/task.component';
import { LogoAnimationComponent } from './logo-animation/logo-animation.component';
import { GradientAnimationComponent } from './gradient-animation/gradient-animation.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutSuccessComponent } from './logout-success/logout-success.component';
import { ForgotPwComponent } from './forgot-pw/forgot-pw.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    DashboardComponent,
    ImprintComponent,
    BoardComponent,
    BacklogComponent,
    MenuComponent,
    NewTaskComponent,
    TaskComponent,
    LogoAnimationComponent,
    GradientAnimationComponent,
    SignupComponent,
    LogoutSuccessComponent,
    ForgotPwComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
