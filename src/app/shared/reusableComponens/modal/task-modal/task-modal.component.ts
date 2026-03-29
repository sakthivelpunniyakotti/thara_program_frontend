import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../../core/service/common.service';
import { LoaderService } from '../../../../core/service/loader.service';
import { TaskService } from '../../../../core/service/task.service';
import { TOAST_TYPES } from '../../enums/toastType';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
 import { from, EMPTY } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';

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

  taskForm!:FormGroup;
  defaulterData: any;

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
        });
      }

      const defaulter = localStorage.getItem('defaulter');
      
      if(defaulter && this.popUpType !== 'edit') {
        const defaultJson = JSON.parse(defaulter);
        this.defaulterData = defaultJson;
        this.taskForm.patchValue({
          subject: defaultJson?.subject,
          grade: defaultJson?.grade,
          count: defaultJson?.count,
          word: defaultJson?.word,
          timer: defaultJson?.timer,
          meaning: defaultJson?.meaning
        });
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
      meaning: this.taskForm.get('meaning')?.value.trim(),
      count: this.taskForm.get('count')?.value,
      timer: this.taskForm.get('timer')?.value,
      word: this.taskForm.get('word')?.value.trim(),
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
        this.commonService.show('Task creation failed',TOAST_TYPES.ERROR);
        this.hide();
      }
    })
  }

 

callSaveforFileUpload() {

  if (!this.checkForDefaulter()) {
    this.commonService.show(`Defaulter is missing`, TOAST_TYPES.ERROR);
    this.hide();
    return;
  }

  from(this.wordsList)
    .pipe(
      concatMap((item: any, index: number) => {

        // set form values
        this.loaderService.show();
        this.taskForm.patchValue({
          word: item.word,
          meaning: item.meaning
        });

        const payload = {
      grade: this.taskForm.get('grade')?.value,
      subject: this.taskForm.get('subject')?.value,
      meaning: this.taskForm.get('meaning')?.value.trim(),
      count: this.taskForm.get('count')?.value,
      timer: this.taskForm.get('timer')?.value,
      word: this.taskForm.get('word')?.value.trim(),
      createdBy: this.userDetails?.name
    }

        // return API observable
        return this.taskService.postTaskData(payload).pipe(
          catchError(err => {
            console.error(`Error at index ${index}`, err);
            this.commonService.show('Task creation failed',TOAST_TYPES.ERROR);
            // 🔥 Option 1: skip error and continue
            return EMPTY;

            // 🔥 Option 2 (stop completely):
            // throw err;
          })
        );
      })
    )
    .subscribe({
      next: (res) => {
        console.log('Saved:', res);
        this.loaderService.hide();
        this.hide()
        this.commonService.show('Task created',TOAST_TYPES.SUCCESS);
      },
      error: (err) => {
        console.error('Stopped due to error:', err);
        this.loaderService.hide();
        this.hide()
        this.commonService.show('Failed create task',TOAST_TYPES.ERROR);
      },
      complete: () => {
        console.log('All records processed');
        this.loaderService.hide()
        this.hide()
        // this.commonService.show('Upload completed', TOAST_TYPES.SUCCESS);
      }
    });
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
      "word": this.taskForm.get('word')?.value.trim(),
      "meaning": this.taskForm.get('meaning')?.value.trim(),
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

wordsList: any[] = [];

uploadExcel(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e: any) => {
    try {
      const binaryStr = e.target.result;

      // Read workbook
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const data: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      console.log('Full Data:', data);

      // ❌ Empty file check
      if (!data || data.length === 0) {
        this.showFormatError();
        return;
      }

      // ✅ Validate headers
      const headers = Object.keys(data[0]).map(h => h.trim().toLowerCase());
      const requiredHeaders = ['serial no', 'words', 'meaning'];

      const isValidTemplate = requiredHeaders.every(h => headers.includes(h));

      if (!isValidTemplate) {
        this.showFormatError();
        return;
      }

      // ✅ Extract data
      const extractedData = data
        .map((row, index) => {
          const wordKey = Object.keys(row).find(
            k => k.toLowerCase() === 'words'
          );
          const meaningKey = Object.keys(row).find(
            k => k.toLowerCase() === 'meaning'
          );

          const word = row[wordKey!]?.toString().trim();
          let meaning = row[meaningKey!]?.toString().trim();

          // ❌ Skip if word is empty
          if (!word) {
            console.warn(`Skipping empty word at row ${index + 2}`);
            return null;
          }

          // ✅ Fallback: meaning = word
          if (!meaning) {
            meaning = word;
          }

          return {
            word,
            meaning
          };
        })
        .filter(Boolean);

      // ❌ No valid rows
      if (extractedData.length === 0) {
        this.showFormatError();
        return;
      }

      console.log('Extracted Data:', extractedData);

      // ✅ Final assignment
      this.wordsList = extractedData;
      this.callSaveforFileUpload();

    } catch (error) {
      console.error('Excel parsing error:', error);
      this.showFormatError();
    }
  };

  reader.readAsBinaryString(file);
}

checkForDefaulter() {
    return (this.defaulterData?.subject && 
            this.defaulterData?.grade &&
            this.defaulterData?.count && 
            this.defaulterData?.timer       
    )?true:false;
}

// old one
// callSaveforFileUpload() {

// if(this.checkForDefaulter()) {

//   for(let i=0; i<this.wordsList.length ; i++ ) {
//     this.taskForm.get('word')?.setValue(this.wordsList[i]?.word);
//     this.taskForm.get('meaning')?.setValue(this.wordsList[i]?.meaning);
//     this.save();
//   }
// } else {
//   this.commonService.show(`Defaulter is missing`,TOAST_TYPES.ERROR);
//   this.hide()
// }
// }


showFormatError() {
  this.commonService.show(
    `Invalid Excel format. Please use the correct template.`,
    TOAST_TYPES.ERROR
  );
  this.hide();
}

}
