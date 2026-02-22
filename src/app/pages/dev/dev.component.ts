import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { initialState } from '../../shared/reusableComponens/enums/toastType';
import { ModalComponent } from '../../shared/reusableComponens/modal/modal.component';
import { MODALCSS } from '../../shared/reusableComponens/enums/toastType';

@Component({
  selector: 'app-dev',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.css'
})
export class DevComponent {

  constructor(private bsmodel: BsModalService){}

  addLabel(){
    const initialState: initialState = {
      title: 'Label',
      msg: '',
      popUpType:'add',
      data: {}
    }

    this.bsmodel.show(ModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })
  }

  delete(){
    const initialState: initialState = {
      title: 'delete',
      msg: '',
      popUpType:'delete',
      data: {}
    }

    this.bsmodel.show(ModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })
  }

  edit(){
    const initialState: initialState ={
      title: 'Edit',
      msg:'',
      popUpType:'edit',
      data: {}
    }
    this.bsmodel.show(ModalComponent,{
      initialState,
      class:MODALCSS.CENTER
    })
  }
}
