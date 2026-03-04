import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MainboardModalComponent } from '../../shared/reusableComponens/modal/mainboard-modal/mainboard-modal.component';
import { MODALCSS } from '../../shared/reusableComponens/enums/toastType';
import { initialState } from '../../shared/reusableComponens/enums/toastType';

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
  private bsModal: BsModalService
){}

ngOnInit(): void {
    const mainboardData = (sessionStorage.getItem('mailBoardData') || '');
    const jsonMainboardData = JSON.parse(mainboardData);
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
      if(result == 'y') {
        
      }
    })
  }

submitTest(): void {
  if(this.actualCount >= this.setCount) {
    const msg ='Your task is completed!, Proceed to the next task.';
   this.warning(msg,'Task Completed','success')
  }else {
    const msg ='your actual count is not equal to the set count';
     this.warning(msg,'Warning','warming');
  }
}


}
 