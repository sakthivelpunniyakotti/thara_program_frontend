import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import {HighchartsChartModule} from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import { ChartServiceService } from '../../core/service/chart-service.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { LoaderService } from '../../core/service/loader.service';
import { StudentService } from '../../core/service/student.service';
import { CommonService } from '../../core/service/common.service';
import { TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { FormsModule } from '@angular/forms';
import { WorkboardService } from '../../core/service/workboard.service';
import { TaskService } from '../../core/service/task.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';


Highcharts3D(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    MultiSelectComponent,
    HighchartsChartModule,
    CommonModule,
    FormsModule,
    MatTooltipModule
   ],
   providers: [
    TitleCasePipe
   ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  // chart data
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions:any;

  constructor(
    private chartService: ChartServiceService,
    private router: Router,
    private loaderService: LoaderService,
    private studentService: StudentService,
    private commonService: CommonService,
    private workboard: WorkboardService,
    private taskService: TaskService,
    private titlecase: TitleCasePipe
  ){

  }

  userDetails: any;
  ngOnInit(): void {
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails') || '');
    this.getAllStudentData();
  }

  logOut() {
    sessionStorage.removeItem('userDetails')
    this.router.navigateByUrl('');
  }

    page: number = 1;
    filterData: any='';
    studentList: any[] = [];
 getAllStudentDataFilter() {
    const payload = {
      page: this.page,
      limit: 100,
      filter: this.filterData.toLowerCase(),
      grade: ''
    }
    this.loaderService.show();

    this.studentService.getAllStudentData(payload)
    .subscribe({
      next: (res: any) =>{
        this.studentList = res.responseBody;
        this.loaderService.hide();

      },
      error: (error: any) => {
        this.loaderService.hide();
        this.commonService.show('failed to fetch the student list',TOAST_TYPES.ERROR);

      }
    })
  }


    studentHeadCount: any
    getAllStudentData() {
      const payload = {
        page: this.page,
        limit: 100,
        filter: this.filterData.toLowerCase(),
        grade: ''
      }
      this.loaderService.show();
  
      this.studentService.getAllStudentDataAll()
      .subscribe({
        next: (res: any) =>{
          this.studentList = res.responseBody;
          this.loaderService.hide();
          this.studentHeadCount = this.getStudentCategoryCounts(this.studentList);
          console.log(this.studentList);
          this.studentDetailsChart(this.studentList[0])
          this.getConfigHistory(this.studentList[0]);
          // this.chartOptions = this.chartService.pieChart('dd');

        },
        error: (error: any) => {
          this.loaderService.hide();
          this.commonService.show('failed to fetch the student list',TOAST_TYPES.ERROR);
  
        }
      })
    }
 
  selectedStudent: any;
  studentDetailsChart(student: any) {
    this.studentSubject = [];
    this.selectedStudent= student;
    this.gradeFilter = student?.grade
    this.getConfigHistory(student);
    this.getTaskTableData();

  }

gradeFilter: any;
subjectFilter: any ='';
homeWorkList: any [] = [];
getTaskTableData() {
    this.loaderService.show();

    this.taskService.getFilteredTaskList(this.subjectFilter,this.gradeFilter)
    .subscribe({
      next: (res: any) => {
          if(res?.statusCode == '200' ) {
            this.homeWorkList = res?.responseBody;
            // this.getConfigHistory();
          }
          this.loaderService.hide();
          this.calculateChartData()
      },
      error: (error: any) => {
        console.log(error);
        if(error?.statusCode == 404) {
          this.chartOptions = ''
          this.commonService.show("No home work found",TOAST_TYPES.ERROR);
          this.homeWorkList = [];
        }
        this.homeWorkList = [];
        this.loaderService.hide();
      }
    })
  }

  studentSubject: any[]=[];
  chartData: any=''
  calculateChartData() {
   this.chartData = this.getHomeworkStats(this.homeWorkList,this.studentTaskHistoryjson);
    console.log(this.chartData,'chart data');
    for (let subject of Object.keys(this.chartData?.subjects || {})) {
     this.studentSubject.push(subject)
    };

    this.studentSubject.push('total')
    console.log(this.studentSubject);
    this.onSubjectChange();
  }
  studentSubjectFilter: any='total';
  onSubjectChange() {
  let data;

  if (this.studentSubjectFilter === 'total') {
    data = [
      ['Completed', this.chartData?.overall?.completed],
      ['Incompleted', this.chartData?.overall?.incomplete]
    ];
  } else {
    const subjectData = this.chartData?.subjects?.[this.studentSubjectFilter];

    data = [
      ['Completed', subjectData?.completed || 0],
      ['Incompleted', subjectData?.incomplete || 0]
    ];
  }

  const fullData = {
    name:  this.titlecase.transform(this.selectedStudent?.name),
    grade: this.selectedStudent?.grade,
    subject: this.titlecase.transform(this.studentSubjectFilter),
    data: data
  }
 this.chartOptions = this.chartService.pieChart(fullData);
}

  getHomeworkStats(homeworks: any[], history: any) {
  const result: any = {};
  const taskHistory = history?.taskHistoryJson || {};

  let totalCompleted = 0;
  let totalIncomplete = 0;
  let totalHomework = 0;

  homeworks.forEach(task => {
    const subject = task.subject;
    const taskId = Number(task.id);

    const historyKey = `${subject}LastTaskId`;
    const lastTaskId = Number(taskHistory[historyKey]);

    if (!result[subject]) {
      result[subject] = {
        total: 0,
        completed: 0,
        incomplete: 0,
        notStarted: false
      };
    }

    result[subject].total++;
    totalHomework++;

    if (!taskHistory[historyKey]) {
      result[subject].notStarted = true;
      result[subject].incomplete++;
      totalIncomplete++;
    } else {
      if (taskId <= lastTaskId) {
        result[subject].completed++;
        totalCompleted++;
      } else {
        result[subject].incomplete++;
        totalIncomplete++;
      }
    }
  });

  return {
    subjects: result,
    overall: {
      total: totalHomework,
      completed: totalCompleted,
      incomplete: totalIncomplete
    }
  };
}

studentTaskHistoryjson: any;
 getConfigHistory(student: any) {
  const payload = {
    studentId: student?.id,
    studentName: student?.name,
    taskHistoryJson: {
      name: student?.name
    }
  }
  this.loaderService.show();

  this.workboard.getTaskHistoryOrCreate(payload)
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.studentTaskHistoryjson = res?.responseBody[0];
      this.loaderService.hide();
      console.log(this.studentTaskHistoryjson,'student task history')
      // if(this.studentTaskHistoryjson) {
      //     this.configTaskHistory();
      // }
      
    },
    error: (error: any) => {
      console.log(error);
      this.commonService.show('failed to fetch task history',TOAST_TYPES.ERROR);
      this.loaderService.hide();
    }
  })
}


  getStudentCategoryCounts(data: any[]) {
  let primary = 0;
  let higherSec = 0;
  let collage = 0;

  data.forEach(student => {
    const grade = Number(student.grade); // convert string to number

    if (!isNaN(grade)) {
      if (grade >= 1 && grade <= 5) {
        primary++;
      } else if (grade >= 6 && grade <= 12) {
        higherSec++;
      } else if (grade > 12) {
        collage++;
      }
    }
  });

  return {
    primary,
    higherSec,
    collage
  };
}

}
