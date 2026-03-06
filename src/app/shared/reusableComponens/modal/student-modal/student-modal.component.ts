import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MultiSelectComponent } from '../../multi-select/multi-select.component';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../core/service/common.service';
import { LoaderService } from '../../../../core/service/loader.service';

@Component({
  selector: 'app-student-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MultiSelectComponent,
    CommonModule
  ],
  templateUrl: './student-modal.component.html',
  styleUrl: './student-modal.component.css'
})
export class StudentModalComponent implements OnInit {

  studentsForm!: FormGroup;

  title:any = '';
  popUpType:any = '';
  constructor(
    private modalRef: BsModalRef,
    private commonService: CommonService,
    private loaderService: LoaderService
  ){
    // exclude id. add role as default student.
    this.studentsForm = new FormGroup({
      // id: new FormControl(),
      role: new FormControl('Student'),
      grade: new FormControl('',Validators.required),
      name: new FormControl(''),
      skill: new FormControl('',Validators.required)
    })
  }

  ngOnInit(): void {
      this.getGrade();
      this.getSkills();
  }

  skillList: Set<any> = new Set();  
  addSkill(): void {
  const skills = this.studentsForm.get('skill')?.value;

  if (Array.isArray(skills)) {
    skills.forEach(skill => this.skillList.add(skill));
  } else {
    this.skillList.add(skills);
  }
  this.studentsForm.get('skill')?.setValue('');
}

get skillArray() {
  return Array.from(this.skillList);
}

save() {
  this.loaderService.show();
  console.log(this.studentsForm.value);
  console.log(this.skillArray,'skill')
}

update() {
  this.loaderService.show()
}

removeSkill(skill: any): void {
  this.skillList.delete(skill);
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

  // for hiding
  hide(){
    this.modalRef.hide();
  }

}
