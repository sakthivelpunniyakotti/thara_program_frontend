import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonService } from '../../core/service/common.service';
import { LoaderService } from '../../core/service/loader.service';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/service/task.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkboardService } from '../../core/service/workboard.service';
import { error } from 'highcharts';
import { TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';

@Component({
  selector: 'app-workboard',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './workboard.component.html',
  styleUrl: './workboard.component.css'
})
export class WorkboardComponent {

  serialNo:number=1;
  workboardList: any;

constructor(
  private commonService: CommonService,
  private loaderService: LoaderService,
  private taskService: TaskService,
  private router: Router,
  private workboard: WorkboardService
){}

userDetails: any;
ngOnInit(): void {
  this.getSubject();
  this.userDetails = JSON.parse(sessionStorage.getItem('userDetails') || '');
  
}

getConfigHistory() {
  const payload = {
    studentId: this.userDetails?.id,
    studentName: this.userDetails?.name,
    taskHistoryJson: {
      name: this.userDetails?.name
    }
  }
  this.loaderService.show();

  this.workboard.getTaskHistoryOrCreate(payload)
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.studentTaskHistoryjson = res?.responseBody[0];
      this.loaderService.hide();
      
      if(this.studentTaskHistoryjson) {
          this.configTaskHistory();
      }
      
    },
    error: (error: any) => {
      console.log(error);
      this.commonService.show('failed to fetch task history',TOAST_TYPES.ERROR);
      this.loaderService.hide();
    }
  })
}

subjects: any;
getSubject() {
  this.loaderService.show();
  this.commonService.getFilteredConfig('subject')
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.subjects = res?.responseBody;
      if(this.subjects?.length > 0 ) {
        this.subjectFilter = this.subjects[0]?.value;
        this.getTaskTableData();
        
      }
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.log(error);
      this.loaderService.hide();
    }
  })
}

onSubjectChange() {
  this.getTaskTableData();
}

configKey:any;
//get task history
configTaskHistory(): void {
  console.log('updating config history')
   this.configKey = `${this.subjectFilter}LastTaskId`;
  if(!this.studentTaskHistoryjson?.taskHistoryJson[this.configKey]) {
    this.studentTaskHistoryjson.taskHistoryJson[this.configKey]=this.workboardList[0].id;
    // update config history
    console.log('task history updating');
    const payload = {
      id: this.studentTaskHistoryjson?.id,
      studentName: this.studentTaskHistoryjson?.studentName,
      taskHistoryJson: this.studentTaskHistoryjson?.taskHistoryJson
    }
    this.loaderService.show();
    this.workboard.updateTaskHistory(payload)
    .subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        console.log(res,'res');
      },
      error: (error: any) => {
        console.log(error);
        this.loaderService.hide();
      }
    })
  }
  
}

goToMainBoard(workboardData: any, index: number): void {
  this.router.navigateByUrl('mail-board');
  if((index+1)<this.workboardList.length) {
    workboardData.nextTaskId = this.workboardList[index+1]?.id;
  } else {
    workboardData.nextTaskId = this.workboardList[index]?.id;
  }
  console.log(workboardData,'word')
  sessionStorage.setItem('mailBoardData',JSON.stringify(workboardData));
}

studentTaskHistoryjson: any;
gradeFilter: any;
subjectFilter: any ='english'
getTaskTableData() {
    this.loaderService.show();

    this.taskService.getFilteredTaskList(this.subjectFilter,this.gradeFilter)
    .subscribe({
      next: (res: any) => {
          if(res?.statusCode == '200' ) {
            this.workboardList = res?.responseBody;
            this.getConfigHistory();

            
          }
          this.loaderService.hide();
      },
      error: (error: any) => {
        console.log(error);
        this.workboardList = [];
        this.loaderService.hide();
      }
    })
  }
}
