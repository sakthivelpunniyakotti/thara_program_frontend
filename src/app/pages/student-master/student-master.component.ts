import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { initialState, TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { MODALCSS } from '../../shared/reusableComponens/enums/toastType';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import { StudentModalComponent } from '../../shared/reusableComponens/modal/student-modal/student-modal.component';
import { LoaderService } from '../../core/service/loader.service';
import { CommonService } from '../../core/service/common.service';
import { StudentService } from '../../core/service/student.service';
import { CommonModule } from '@angular/common';
import { error } from 'highcharts';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-master',
  standalone: true,
  imports: [SidebarComponent,MultiSelectComponent,CommonModule,FormsModule],
  templateUrl: './student-master.component.html',
  styleUrl: './student-master.component.css'
})
export class StudentMasterComponent implements OnInit{

  serialNo: any = 1;

  constructor(
    private bsModal: BsModalService,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private studentService: StudentService
  ){}

  ngOnInit(): void {
      this.getAllStudentData();
      this.getGrade()
  }

  gradeFilter: any =''
  onGradeSelect(event: any) {
    this.gradeFilter = event;
    console.log(this.gradeFilter)
    this.getAllStudentData();
  }
  
   back() {
    this.page--;
    this.getAllStudentData();
  
}

forward() {
  this.page++;
  this.getAllStudentData()
}

  limit: number= 8;
  page: number = 1;
  filterData: any='';
  studentList: any[] = [];
  totalPage: any
  pageMultiple: number = 1;
  getAllStudentData() {
    console.log(this.page,'page')
    const payload = {
      page:  (this.page<=0)?1:this.page,
      limit: this.limit,
      filter: this.filterData.toLowerCase(),
      grade: this.gradeFilter
    }
    if(this.page<=0) {
      this.page = 1;
    }
    this.loaderService.show();

    this.studentService.getAllStudentData(payload)
    .subscribe({
      next: (res: any) =>{
        this.studentList = res.responseBody;
        this.loaderService.hide();
       this.pageMultiple = res?.pagination?.page;
       this.totalPage = res?.pagination?.totalPages;
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.commonService.show('failed to fetch the student list',TOAST_TYPES.ERROR);

      }
    })
  }

  // add
  addStudent(){
    const initialState: initialState = {
      title: 'Add Student',
      msg:'',
      popUpType:'add',
      data:{}
    }

   const modalRef = this.bsModal.show(StudentModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    });

    modalRef.onHidden?.subscribe(()=>{
      this.getAllStudentData()
    })
  }

  edit(student: any){
    const initialState: initialState = {
      title: 'Edit',
      msg:'',
      popUpType:'edit',
      data: student
    }

   const modelRef = this.bsModal.show(StudentModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })

    modelRef?.content?.onClose.subscribe((res: any) => {
      this.getAllStudentData();
    })
  }

  delete(student: any){
    const initialState: initialState = {
      title: 'Delete',
      msg:'',
      popUpType:'delete',
      data: {}
    }

   const modelRef = this.bsModal.show(StudentModalComponent,{
      initialState,
      class: MODALCSS.DEFAULT_SMALL
    });

    modelRef?.content?.onClose.subscribe((result: any) => {
      if(result == 'y') {
        this.studentService.deleteStudentData(student?.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.loaderService.hide();
            this.commonService.show('Record deleted successfully',TOAST_TYPES.SUCCESS);
            this.getAllStudentData();
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.commonService.show('Failed to delete the record',TOAST_TYPES.ERROR);
          }
        })
      }
    })
  }

  grades:any;
  getGrade():any {
    this.loaderService.show();
    this.commonService.getGrade()
    .subscribe({
      next: (res) => {
        this.grades = res?.responseBody;
        this.loaderService.hide();
      },
      error: (err:any) => {
        this.loaderService.hide();
      }
    })
  }
}
