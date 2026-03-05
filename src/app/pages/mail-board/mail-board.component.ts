import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MainboardModalComponent } from '../../shared/reusableComponens/modal/mainboard-modal/mainboard-modal.component';
import { MODALCSS, TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { initialState } from '../../shared/reusableComponens/enums/toastType';
import { CommonService } from '../../core/service/common.service';
import { LoaderService } from '../../core/service/loader.service';
import { WorkboardService } from '../../core/service/workboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mail-board',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './mail-board.component.html',
  styleUrl: './mail-board.component.css'
})
export class MailBoardComponent implements OnInit {

 letters: string[] = [];
previousValue: string = '';
animatedIndex: number = -1;

setCount: any;
actualCount: any = 0;
timer: any;
word: any;
wordForm:any;

constructor(
  private bsModal: BsModalService,
  private commonService: CommonService,
  private loaderService: LoaderService,
  private workboard: WorkboardService,
  private router: Router
){}

userDetails: any;
studentTaskHistoryjson: any;
taskDetails: any;
ngOnInit(): void {
    const mainboardData = (sessionStorage.getItem('mailBoardData') || '');
    const jsonMainboardData = JSON.parse(mainboardData);
    this.taskDetails = jsonMainboardData;
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails') || '');

    if(jsonMainboardData) {
      this.setCount = Number(jsonMainboardData?.count);
      this.timer = Number(jsonMainboardData?.timer);
      this.word = jsonMainboardData?.word
    }
}

onInput(event: any) {
  const input = event.target as HTMLInputElement;
  this.invalidWord = false;
  // Remove all spaces automatically
  input.value = input.value.replace(/\s/g, '');

  const currentValue = input.value;
  this.letters = currentValue.split('');
  this.animatedIndex = currentValue.length - 1;

  this.previousValue = currentValue;
}

preventSpace(event: KeyboardEvent) {
  if (event.key === ' ') {
    event.preventDefault();
  }
}

preventPaste(event: ClipboardEvent) {
  event.preventDefault();
}

preventCopy(event: ClipboardEvent) {
  event.preventDefault();
}

invalidWord:boolean= false;
submit(event: any) {
  const word = event.target.value;
  console.log(this.word);
  const typedWord = this.letters.join("");
  if(word) {
    if(this.word == typedWord) {
      console.log("entered");
      this.actualCount++;
      this.triggerPopup();
      this.wordForm = '';
      this.invalidWord = false;
      this.letters = [];
    } else if(this.word !== typedWord) {
        this.invalidWord=true;
    }
  }
}

showPopup = false;
private previousActualCount = 0;

ngOnChanges() {
  this.checkActualChange();
}

// OR call this method wherever you update actualCount
checkActualChange() {
  if (this.actualCount !== this.previousActualCount) {
    this.triggerPopup();
    this.previousActualCount = this.actualCount;
  }
}

triggerPopup() {
  this.showPopup = true;

  setTimeout(() => {
    this.showPopup = false;
  }, 500); // 2 seconds
}

warning(msg: any,title: string,type: string){
    const initialState: initialState = {
      title :title,
      msg: msg,
      popUpType:type,
      data: {}
    }

    console.log(initialState)

   const modelRef = this.bsModal.show(MainboardModalComponent,{
      initialState,
      class:MODALCSS.DEFAULT_SMALL,
    });

    modelRef.content?.onClose.subscribe((result: any) => {
      console.log(result,'res---------------------')
      if(result == 'y') {
        this.getConfigHistory();
      } else {
        this.resetData()
      }
    })
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

configKey:any;
//get task history
configTaskHistory(): void {
   this.configKey = `${this.taskDetails?.subject}LastTaskId`;
  if(this.studentTaskHistoryjson?.taskHistoryJson[this.configKey]) {
    this.studentTaskHistoryjson.taskHistoryJson[this.configKey]=this.taskDetails?.nextTaskId;
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
        this.router.navigateByUrl('workboard');
        sessionStorage.removeItem('mailBoardData');
        this.resetData();
      },
      error: (error: any) => {
        console.log(error);
        this.loaderService.hide();
      }
    })
  }
  
}

resetData() {
  this.actualCount = 0;
}

submitTest(): void {
  if(this.actualCount >= this.setCount) {
    const msg ='Your task is completed!, Proceed to the next task.';
   this.warning(msg,'Task Completed','success')
  }else {
    const msg ='your actual count is not equal to the set count';
     this.warning(msg,'Warning','warning');
  }
}

ngOnDestroy() {
  sessionStorage.removeItem('mailBoardData');
}

}
 