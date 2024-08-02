import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ServiceService } from 'src/service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public destroy$ = new Subject<void>();
  public title: any = 'Untitled';
  public moreInfo = {
    completed: 0,
    total: 0
  }

  public taskList: any = [];

  constructor(private _appService: ServiceService) { }

  ngOnInit(): void {
    this.getTaskItems();
  }

  getTaskItems = () => {
    try {
      if (localStorage.getItem('todoList')) {
        const tasks = localStorage.getItem('todoList');
        this.taskList = tasks?.length ? JSON.parse(tasks).filter((ele: any) => !ele.completed) : [{ id: 1, title: null, completed: false }];
        this.getTotalItems();
        return;
      }
      const task = {
        userId: 1,
        title: null,
        completed: false
      };
      this._appService.getAllTasks().pipe(takeUntil(this.destroy$)).subscribe((resp) => {
        if (resp) {
          this.taskList = resp || [];
          this.taskList = this.taskList.slice(0, 21);
          this.taskList.push(task);
          this.taskList[this.taskList.length - 1]['id'] = this.taskList.length;
          this.getTotalItems();
        }
      }, (err) => {
        console.error(err);
      })
    } catch (error) {
      console.error(error);
    }
  }

  checkCompletedItems = () => {
    try {
      setTimeout(() => {
        this.getTotalItems();
      }, 100);
    } catch (error) {
      console.error(error);
    }
  }

  getTotalItems = () => {
    try {
      this.moreInfo.total = this.taskList.length - 1;
      let completedItems = this.taskList.filter((ele: any) => ele.completed);
      this.moreInfo.completed = completedItems.length;
      localStorage.setItem('todoList', JSON.stringify(this.taskList));
    } catch (error) {
      console.error(error);
    }
  }

  addTask = () => {
    try {
      const task = {
        userId: 1,
        title: null,
        completed: false,
        id: this.taskList.length + 1
      }
      this.taskList.push(task);
      this.getTotalItems();
    } catch (error) {
      console.error(error);
    }
  }

  deleteTask = (item: any) => {
    try {
      const index = this.taskList.findIndex((ele: any) => ele.id === item.id);
      if (index > -1) {
        this.taskList.splice(index, 1);
      }
      this.getTotalItems();
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
