import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  title:any = '';
  constructor(private modalRef: BsModalRef){}

  // for hiding
  hide(){
    this.modalRef.hide();
  }
}
