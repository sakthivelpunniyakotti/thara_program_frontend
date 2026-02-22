import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MODALCSS } from '../../shared/reusableComponens/enums/toastType';
import { initialState } from '../../shared/reusableComponens/enums/toastType';
import { AdminModalComponent } from '../../shared/reusableComponens/modal/admin-modal/admin-modal.component';

@Component({
  selector: 'app-admin-master',
  standalone: true,
  imports: [
    SidebarComponent,
    MultiSelectComponent,
  ],
  templateUrl: './admin-master.component.html',
  styleUrl: './admin-master.component.css'
})
export class AdminMasterComponent {



  constructor(private bsModal: BsModalService){
  }

  // for adding admin and subadmin
  addAdmin(){
    const initialState:initialState = {
      title: 'Admin',
      msg:'',
      popUpType:'add',
      data: {}
    }
    this.bsModal.show(AdminModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    });
  }

  // for editing
  edit(){
    const initialState:initialState = {
      title: 'Edit',
      msg: '',
      popUpType:'edit',
      data: {}
    }

    this.bsModal.show(AdminModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })
  }

  delete(){
    const initialState: initialState = {
      title :'Delete',
      msg: '',
      popUpType:'delete',
      data: {}
    }

    this.bsModal.show(AdminModalComponent,{
      initialState,
      class:MODALCSS.DEFAULT_SMALL,
    })
  }
}


