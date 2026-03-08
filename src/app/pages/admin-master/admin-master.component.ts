import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MODALCSS, TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { initialState } from '../../shared/reusableComponens/enums/toastType';
import { AdminModalComponent } from '../../shared/reusableComponens/modal/admin-modal/admin-modal.component';
import { LoaderService } from '../../core/service/loader.service';
import { CommonService } from '../../core/service/common.service';
import { AdminService } from '../../core/service/admin.service';

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



  constructor(
    private bsModal: BsModalService,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private adminService: AdminService
  ){
  }

  // for adding admin and subadmin
  addAdmin(){
    const initialState:initialState = {
      title: 'Admin',
      msg:'',
      popUpType:'add',
      data: {}
    }
  const modalref = this.bsModal.show(AdminModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    });

    modalref.content?.onClose.subscribe((result: any) => {
      this.getAllAdminList();
    })
  }

  adminList: any []=[];
  getAllAdminList() {
    this.loaderService.show();

    this.adminService.getAllAdminData()
    .subscribe({
      next: (res: any) => {
        this.adminList = res?.responseBody;
        this.loaderService.hide();
      },
      error: (erroe: any) => {
        this.loaderService.hide();
        this.commonService.show('failed to fetch the admin list',TOAST_TYPES.ERROR);
      }
    })
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


