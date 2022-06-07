import { Injector, NgModule } from '@angular/core';
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
import { AuthServiceService } from 'src/services/auth-service.service';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import { ValidatorComponent } from './validator/validator.component';
import { EventemitterService } from 'src/services/eventemitter.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutModule } from '@angular/cdk/layout';
import { AlertComponent } from './alert/alert.component';
import { HelpComponent } from './help/help.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';

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
    ForgotPwComponent,
    ValidatorComponent,
    AlertComponent,
    HelpComponent,
    UserAvatarComponent,
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
    MatTooltipModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    HttpClientModule,
    DateValueAccessorModule,
    LayoutModule
  ],
  providers: [EventemitterService],
  bootstrap: [AppComponent]
})
export class AppModule {


    // 3 Steps for giving access to AuthService in Model Class (e.g. Task) - as workaround for Constructor DI of AuthService
    // AuthServiceService:: add injector property
    // in Model (e.g. Task.ts): acceass AuthService via property (no DI in constructro needded)
    // in app.module: Add the following: 
  constructor(private injector: Injector) {
    AuthServiceService.injector = injector;
}

 }
