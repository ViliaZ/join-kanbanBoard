import { HttpClient } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/services/auth-service.service';
import { DatabaseService } from 'src/services/database.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  today: Date = new Date();
  futureDate: any = (date: Date, daysToCount: number) => {
    const today = new Date(date)
    const tomorrow = new Date(today.setDate(today.getDate() + daysToCount))
    return tomorrow
  }


  variable: string = '';
  currentDate: any = new Date().getTime();
  public amountUrgentTasks: any = '0'; // default
  public width: any = {  // width of bar diagrams
    allTasks: '0%',
    toDoTasks: '0%',
    backlogTasks: '0%'
  }

  constructor(
    public db: DatabaseService,
    public authService: AuthServiceService,
    public httpClient: HttpClient) {
      
     }

  ngOnInit(): void {
    console.log("Guest is Initialized : ", this.db.guestIsInitialized);
    if (!this.db.guestIsInitialized) {
      this.createDummyData();
    }

    setTimeout(() => {
      console.log('dashboard', this.db.guestIsInitialized);
      this.getCurrentStatistics();
    }, 2000)
  }

    // if(this.authService.guestLoggedIn){
    //   this.createDummyData();
    // }

  createDummyData() {
    console.log('create Dummy Data');

    let dummyData = this.httpClient.get('assets/json/guestData.JSON')
    dummyData.subscribe(async (res: any) => {
      await this.setDummyBoards(res.dummyBoards);
      console.log(res);

      await this.setDummyTasks(res.dummyTasks);
    })
    this.db.guestIsInitialized = true;
  }

  async setDummyBoards(dummmyBoards: any) {
    for (let i = 0; i < dummmyBoards.length; i++) {
      dummmyBoards[i].createdAt = this.today;
      await this.db.addDocToCollection('boards', dummmyBoards[i]);
    }
  }

  async setDummyTasks(dummmyTasks: any) {
    // dynamically adjust JSON data (dueDates) to always get some dummydata in the future, so we never have tasks in the past
    let daysFromNow = 1;
    for (let i = 0; i < dummmyTasks.length; i++) {
      dummmyTasks[i].createdAt = this.today;
      dummmyTasks[i].dueTo = this.futureDate(this.today, daysFromNow);
      daysFromNow++
      await this.db.addDocToCollection('tasks', dummmyTasks[i]);
    }
  }


  getCurrentStatistics() {
    if (this.db.allTasks.length > 0) {
      this.width.allTasks = '100%';
      this.getWidthToDoTasks();
      this.getWidthBacklogTasks();
    }
  }

  getWidthToDoTasks() {
    if (this.db.todoTasks.length > 0) {
      let percentToDo = this.db.todoTasks.length * 100 / this.db.allTasks.length;
      this.width.toDoTasks = percentToDo + '%';
    }
  }

  getWidthBacklogTasks() {
    if (this.db.backlogtasks.length > 0) {
      let percentBacklog = this.db.backlogtasks.length * 100 / this.db.allTasks.length;
      this.width.backlogTasks = percentBacklog + '%';
    }
  }

}
