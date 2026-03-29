import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { initialState, MODALCSS, TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { TaskModalComponent } from '../../shared/reusableComponens/modal/task-modal/task-modal.component';
import { TaskDefaulterModalComponent } from '../../shared/reusableComponens/modal/task-defaulter-modal/task-defaulter-modal.component';
import { TaskService } from '../../core/service/task.service';
import { LoaderService } from '../../core/service/loader.service';
import { CommonService } from '../../core/service/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    SidebarComponent,
    MultiSelectComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.css'
})
export class TaskManagerComponent implements OnInit{

  serialNo: number=1;
  taskSearch: any;

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

search(): void {
  this.loaderService.show();
  const payload = {
    searchkey : this.taskSearch,
    page: this.page,
    limit : this.limit
  }
  this.taskService.searchTask(payload)
  .subscribe({
    next: (res: any) => {
      if(res?.statusCode == '200') {
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

  back() {
    this.page--;
    this.getTaskTableData();
  
}

forward() {
  this.page++;
  this.getTaskTableData()
}

limit: number= 8;
  page: number = 1;
  subjectFilter= '';
  gradeFilter='';
  taskTableData:any;
  totalPage: any
  pageMultiple: number = 1;
  getTaskTableData() {
    this.loaderService.show();

    const payload = {
  "subject": this.subjectFilter,
  "grade": this.gradeFilter,
  "page":  (this.page<=0)?1:this.page,
  "limit": this.limit
}

    this.taskService.getFilteredTaskListPost(payload)
    .subscribe({
      next: (res: any) => {
          if(res?.statusCode == '200' ) {
            this.taskTableData = res?.responseBody;
            this.pageMultiple = res?.pagination?.currentPage;
       this.totalPage = res?.pagination?.totalPages;
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

   const modelRef = this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    });

    modelRef?.onHidden?.subscribe(() => {
      this.getTaskTableData();
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

   const modelRef = this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })

    
    modelRef.onHidden?.subscribe(() => {
      this.getTaskTableData();
    })

  }

  delete(task: any){
    const initialState: initialState = {
      title: 'Delete',
      msg: '',
      popUpType: 'delete',
      data: task
    }

  const modelRef =  this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.DEFAULT_SMALL
    })

  modelRef.content?.onClose.subscribe((result: any) => {
    if(result == 'Y') {
      this.deleteTask(task)
    }
  })

  }

  uploadExcel(event: any) {
    console.log(event,'event')
  }

  deleteTask(data: any) {
    this.loaderService.show();

    this.taskService.deleteTaskData(data?.id)
    .subscribe({
      next: (res: any) => {
        if(res?.statusCode == '200') {
          this.commonService.show('Delete successfull',TOAST_TYPES.SUCCESS);
          this.getTaskTableData();
        }
        this.loaderService.hide();
      },
      error: (error: any) => {
        console.log(error);
        this.loaderService.hide();
        this.commonService.show('Delete not completed',TOAST_TYPES.ERROR);
      }
    })
  }
}
