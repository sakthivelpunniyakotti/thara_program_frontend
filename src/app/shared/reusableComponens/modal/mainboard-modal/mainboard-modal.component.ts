import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mainboard-modal',
  standalone: true,
  imports: [],
  templateUrl: './mainboard-modal.component.html',
  styleUrl: './mainboard-modal.component.css'
})
export class MainboardModalComponent {

  title: string = '';
  popUpType: string = '';
  msg: string='';
  proceedStatus:any;

  constructor(
    private modalref: BsModalRef,
    private router: Router
  ){}

  onClose: Subject<any> = new Subject();
  
    closeModal(data?: any) {
      this.onClose.next(this.proceedStatus);   // send data back
      this.onClose.complete();
      this.modalref.hide();
      this.proceedStatus='';
    }

  hide(): void {
    this.modalref.hide();
  }

  retry() {
    this.closeModal('n')
  }

  resetTimer() {
    this.closeModal('r');
  }

  proceed(): void {
   this.proceedStatus = 'y';
   this.closeModal('y');   
}
  
}
