import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MultiSelectComponent } from '../../multi-select/multi-select.component';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { CommonService } from '../../../../core/service/common.service';
import { LoaderService } from '../../../../core/service/loader.service';
import { StudentService } from '../../../../core/service/student.service';
import { TOAST_TYPES } from '../../enums/toastType';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-student-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MultiSelectComponent,
    CommonModule
  ],
  providers: [
    TitleCasePipe
  ],
  templateUrl: './student-modal.component.html',
  styleUrl: './student-modal.component.css'
})
export class StudentModalComponent implements OnInit {

  studentsForm!: FormGroup;

  title:any = '';
  data: any='';
  popUpType:any = '';
  constructor(
    private modalRef: BsModalRef,
    private commonService: CommonService,
    private loaderService: LoaderService,
    private studentService: StudentService,
    private titleCase: TitleCasePipe
  ){
    // exclude id. add role as default student.
    this.studentsForm = new FormGroup({
      // id: new FormControl(),
      role: new FormControl('student'),
      grade: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      skill: new FormControl(''),
      org: new FormControl('',Validators.required)
    })
  }

  ngOnInit(): void {
      this.getGrade();
      this.getSkills();
      this.getOrganization();

      if(this.popUpType == 'edit') {
        console.log(this.data);
      this.skillList = this.data?.skills
      this.studentsForm.patchValue({
        role: this.titleCase.transform('student'),  
        grade: this.data?.grade,
        name: this.data?.name,
        org: (this.data?.org)
      })
    }
  }

  onClose: Subject<any> = new Subject();
  
    closeModal(data?: any) {
      this.onClose.next(data);   // send data back
      this.onClose.complete();
      this.modalRef.hide();
    }



  skillList: any [] = [];
  addSkill(): void {
  const skills = this.studentsForm.get('skill')?.value;
  
  if(!this.skillList.includes(skills)) {
    this.skillList.push(skills)
  }
  
  this.studentsForm.get('skill')?.setValue('');
}

get skillArray() {
  return Array.from(this.skillList);
}

save() {
  const payload = {
    name: this.studentsForm.get('name')?.value,
    type: this.studentsForm.get('role')?.value,
    grade: this.studentsForm.get('grade')?.value,
    skills: this.skillList,
    org: this.studentsForm.get('org')?.value
  }
  this.loaderService.show();
  
  this.studentService.postStudentData(payload)
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.loaderService.hide();
      this.commonService.show('Student record created successfully',TOAST_TYPES.SUCCESS);
      this.hide();
    },
    error: (error: any) => {
      console.log(error);
      this.commonService.show("Unable to create student record",TOAST_TYPES.ERROR);
      this.loaderService.hide();
      this.hide()
    }
  })
}

update() {
  this.loaderService.show();
  console.log('student');
  const payload = {
     type: this.studentsForm.get('role')?.value,
     grade: this.studentsForm.get('grade')?.value,
     name: this.studentsForm.get('name')?.value,
     skills: this.skillList,
     org: this.studentsForm.get('org')?.value,
     id: this.data?.id
  };
  console.log(payload)
  this.studentService.updateStudentData(payload)
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.loaderService.hide();
      this.closeModal();
      this.commonService.show('Updated successfully',TOAST_TYPES.SUCCESS);
    },
    error: (error: any) => {
      this.loaderService.hide();
      console.log(error);
      this.closeModal();
      this.commonService.show('failed to update record',TOAST_TYPES.ERROR);
    }
  })
}

delete() {
  this.closeModal('y')
}

removeSkill(index: any): void {
  this.skillList.splice(index, 1);
}
  skills:any;
  getSkills() {
  this.loaderService.show();
  this.commonService.getFilteredConfig('skill')
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.skills = res?.responseBody;
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.log(error);
      this.loaderService.hide();
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

  organization:any;
  getOrganization() {
  this.loaderService.show();
  this.commonService.getFilteredConfig('organization')
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.organization = res?.responseBody;
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.log(error);
      this.loaderService.hide();
    }
  })
}

  // for hiding
  hide(){
    this.modalRef.hide();
  }

}
