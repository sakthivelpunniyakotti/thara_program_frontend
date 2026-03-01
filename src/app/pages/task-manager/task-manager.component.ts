import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { initialState, MODALCSS } from '../../shared/reusableComponens/enums/toastType';
import { TaskModalComponent } from '../../shared/reusableComponens/modal/task-modal/task-modal.component';
import { TaskDefaulterModalComponent } from '../../shared/reusableComponens/modal/task-defaulter-modal/task-defaulter-modal.component';
import { TaskService } from '../../core/service/task.service';
import { LoaderService } from '../../core/service/loader.service';
import { CommonService } from '../../core/service/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    SidebarComponent,
    MultiSelectComponent,
    CommonModule
  ],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.css'
})
export class TaskManagerComponent implements OnInit{

  serialNo: number=1;

  constructor(
    private bsModal: BsModalService,
    private taskService: TaskService,
    private loaderService: LoaderService,
    private commonService: CommonService
   ){}

   ngOnInit(): void {
       this.getTaskTableData();
       this.getGrade();
       this.getSubject();
   }

  onGradeSelect(event: any) {
    this.gradeFilter = event;
    console.log(this.gradeFilter)
    this.getTaskTableData();
  }
  onSubjectSelect(event: any) {
    this.subjectFilter = event;
    console.log(this.subjectFilter);
    this.getTaskTableData();
  }

  grades: any;
  getGrade() {
  this.loaderService.show();
  this.commonService.getFilteredConfig('grade')
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.grades = res?.responseBody;
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.log(error);
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
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.log(error);
      this.loaderService.hide();
    }
  })
}


  subjectFilter= '';
  gradeFilter='';
  taskTableData:any;
  getTaskTableData() {
    this.loaderService.show();

    this.taskService.getFilteredTaskList(this.subjectFilter,this.gradeFilter)
    .subscribe({
      next: (res: any) => {
          if(res?.statusCode == '200' ) {
            this.taskTableData = res?.responseBody;
          }
          this.loaderService.hide();
      },
      error: (error: any) => {
        console.log(error);
        this.taskTableData = [];
        this.loaderService.hide();
      }
    })
  }

  addTask(){
    const initialState: initialState = {
      title: 'Add Task',
      msg: '',
      popUpType:'add',
      data:{}
    }

    this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })

  }

  openDefaulter(){
    const initialState: initialState = {
      title: 'Defaulter',
      msg: '',
      popUpType: 'default',
      data: {}
    }
    
    this.bsModal.show(TaskDefaulterModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })
  }

  edit(task: any){
    const initialState: initialState = {
      title: 'Edit',
      msg: '',
      popUpType: 'edit',
      data: task
    }

    this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })

  }

  delete(task: any){
    const initialState: initialState = {
      title: 'Delete',
      msg: '',
      popUpType: 'delete',
      data: {}
    }

    this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.DEFAULT_SMALL
    })

  }
}
