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
timer: string = "00:00";
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
setTime: any;
ngOnInit(): void {
    const mainboardData = (sessionStorage.getItem('mailBoardData') || '');
    const jsonMainboardData = JSON.parse(mainboardData);
    this.taskDetails = jsonMainboardData;
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails') || '');

    if(jsonMainboardData) {
      this.setCount = Number(jsonMainboardData?.count);
      this.startTimer(Number(jsonMainboardData?.timer));
      this.setTime = Number(jsonMainboardData?.timer)
      this.word = jsonMainboardData?.word
    }
}

back() {
  this.router.navigateByUrl('workboard');
}

speak(text: string) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en-US';
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

//timer
private interval: any;
public remainingTime: number = 0;

pauseBtn: boolean = false;
pause() {
   clearInterval(this.interval);
   this.pauseBtn = true;
   this.updateDisplay()
}

reset() {
  clearInterval(this.interval);
  this.startTimer(this.setTime);
}

resume() {
  this.startTimer(this.remainingTime);
}

startTimer(seconds: number) {
  this.pauseBtn = false;
    this.remainingTime = seconds;
    this.updateDisplay();

    this.interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.interval);
        this.timer = "Time Up!";
        return;
      }

      this.updateDisplay();
    }, 1000);
  }

  updateDisplay() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;

    this.timer =
      `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
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

finishedTimeInSec: number=0;
invalidWord:boolean= false;
submit(event: any) {
  const word = event.target.value;
  console.log(this.word);
  const typedWord = this.letters.join("");
  if(word) {
    this.finishedTimeInSec = this.remainingTime;
    if(this.word == typedWord) {
      console.log("entered");
      this.actualCount++;
      this.triggerPopup();
      this.speak(this.word)
      this.wordForm = '';
      this.invalidWord = false;
      this.letters = [];
      if(this.actualCount >= this.setCount && this.remainingTime!==0) {
        this.submitTest()
      }
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
      if(result == 'y') {
        this.getConfigHistory();
      } else {
        this.resetData();
        this.startTimer(this.setTime)
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
        sessionStorage.setItem('selectedSubject',this.taskDetails?.subject)
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

  if(this.remainingTime==0) {
    const msg = 'Times Up!, try agrain';
    this.warning(msg,'Warning','timesUp');
    return;
  } else {
  if(this.actualCount >= this.setCount) {
    const msg ='Your task is completed!, Proceed to the next task.';
   this.warning(msg,'Task Completed','success')
  }else {
    const msg ='your actual count is not equal to the set count';
     this.warning(msg,'Warning','warning');
  }
  }
}

ngOnDestroy() {
  sessionStorage.removeItem('mailBoardData');
}

}
 