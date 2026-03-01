import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../../core/service/common.service';
import { LoaderService } from '../../../../core/service/loader.service';
import { TaskService } from '../../../../core/service/task.service';
import { TOAST_TYPES } from '../../enums/toastType';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent implements OnInit{
  title: string = '';
  popUpType: string = '';
  data: any;

  taskForm!:FormGroup

  constructor(
    private modelRef: BsModalRef,
    private commonService: CommonService,
    private loaderService: LoaderService,
    private taskService: TaskService
  ){
    this.taskForm = new FormGroup({
      subject: new FormControl('',Validators.required),
      grade: new FormControl('',Validators.required),
      count: new FormControl('',Validators.required),
      word: new FormControl('',Validators.required),
      timer: new FormControl('',Validators.required),
      meaning: new FormControl('',Validators.required)
    })
  }

  userDetails: any;
  ngOnInit(): void {
      this.getGrade();
      this.getSubject();
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetails') || '');
      if(this.popUpType == 'edit') {
        console.log(this.data,'data')
        this.taskForm.patchValue({
          subject: this.data?.subject,
          grade: this.data?.grade,
          count: this.data?.count,
          word: this.data?.word,
          timer: this.data?.timer,
          meaning: this.data?.meaning
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

  hide() {
    this.modelRef.hide();
  }

  save() {
    this.loaderService.show();
    const payload = {
      grade: this.taskForm.get('grade')?.value,
      subject: this.taskForm.get('subject')?.value,
      meaning: this.taskForm.get('meaning')?.value,
      count: this.taskForm.get('count')?.value,
      timer: this.taskForm.get('timer')?.value,
      word: this.taskForm.get('meaning')?.value,
      createdBy: this.userDetails?.name
    }
    console.log(payload,'payload')
    this.taskService.postTaskData(payload)
    .subscribe({
      next: (res: any) => {
        console.log(res);
        this.loaderService.hide();
        this.hide();
        this.commonService.show('Task created',TOAST_TYPES.SUCCESS);
      },
      error: (error: any) => {
        console.log(error);
        this.loaderService.hide();
        this.commonService.show('Failed create task',TOAST_TYPES.ERROR);
        this.hide();
      }
    })
  }

onClose: Subject<any> = new Subject();

  closeModal(data?: any) {
    this.onClose.next(data);   // send data back
    this.onClose.complete();
    this.modelRef.hide();
  }

  update() {
    this.loaderService.show();
     const payload ={
      "id":this.data?.id,
      "subject": this.taskForm.get('subject')?.value,
      "grade": this.taskForm.get('grade')?.value,
      "count": this.taskForm.get('count')?.value,
      "timer": this.taskForm.get('timer')?.value,
      "word": this.taskForm.get('word')?.value,
      "meaning": this.taskForm.get('meaning')?.value,
      "createdBy": this.userDetails?.name,
     }

     this.taskService.updateTaskData(payload)
     .subscribe({
      next: (res: any) => {
        if(res?.statusCode =='200') {
          this.commonService.show('Update successfull',TOAST_TYPES.SUCCESS);
          this.loaderService.hide();
          this.hide();
        }
      },
      error: (error: any) => {
        console.log(error);
        this.loaderService.hide();
        this.commonService.show('Failed to update task',TOAST_TYPES.ERROR);
        this.hide();
      }
     })
  }

  delete(): void {
    this.closeModal('Y');
  }
}
