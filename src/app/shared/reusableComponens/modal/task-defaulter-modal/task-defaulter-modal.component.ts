import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../../core/service/common.service';
import { LoaderService } from '../../../../core/service/loader.service';

@Component({
  selector: 'app-task-defaulter-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './task-defaulter-modal.component.html',
  styleUrl: './task-defaulter-modal.component.css'
})
export class TaskDefaulterModalComponent implements OnInit {

  popUpType: string = '';
  title: string = ''

  defaultForm!: FormGroup

  constructor(
    private modalRef: BsModalRef,
    private commonService: CommonService,
    private loaderService: LoaderService  
  ){
    this.defaultForm = new FormGroup({
      grade: new FormControl(''),
      subject: new FormControl(''),
      count: new FormControl(),
      timer: new FormControl()
    })
  }

  ngOnInit(): void {
    this.getGrade();
    this.getSubject();
    const defaulter = localStorage.getItem('defaulter');
    if(defaulter) {
      const defaultJson = JSON.parse(defaulter);
      this.defaultForm.patchValue({
        grade: defaultJson?.grade,
        subject: defaultJson?.subject,
        count: defaultJson?.count,
        timer: defaultJson?.timer
      })
    }
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

  saveDefault(): void {
    localStorage.setItem('defaulter',JSON.stringify(this.defaultForm.value));
    this.hide();
  }

  resetDefault(): void {
    const defaulter = localStorage.getItem('defaulter');
    if(defaulter) {
      localStorage.removeItem('defaulter');
    }
    this.defaultForm.reset();
    this.hide();
  }

  hide(){
    this.modalRef.hide();
  }

}
