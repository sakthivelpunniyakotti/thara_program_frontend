import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MODALCSS, TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { initialState } from '../../shared/reusableComponens/enums/toastType';
import { AdminModalComponent } from '../../shared/reusableComponens/modal/admin-modal/admin-modal.component';
import { LoaderService } from '../../core/service/loader.service';
import { CommonService } from '../../core/service/common.service';
import { AdminService } from '../../core/service/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-master',
  standalone: true,
  imports: [
    SidebarComponent,
    MultiSelectComponent,
    CommonModule
  ],
  templateUrl: './admin-master.component.html',
  styleUrl: './admin-master.component.css'
})
export class AdminMasterComponent implements OnInit{

  serialNo: any = 1;

  constructor(
    private bsModal: BsModalService,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private adminService: AdminService
  ){
  }

  ngOnInit(): void {
      this.getAllAdminList();
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

    modalref.onHidden?.subscribe(()=>{
      this.getAllAdminList()
    })
  }

  adminList: any []=[];
  getAllAdminList() {
    this.loaderService.show();
    const payload = {
      page: 1,
      limit: 8
    }
    this.adminService.getAllAdminData(payload)
    .subscribe({
      next: (res: any) => {
        this.adminList = res?.responseBody;
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.commonService.show('failed to fetch the admin list',TOAST_TYPES.ERROR);
      }
    })
  }

  // for editing
  edit(admin: any){
     admin.cPassword = admin?.password;
    const initialState:initialState = {
      title: 'Edit',
      msg: '',
      popUpType:'edit',
      data: admin
    }

   const modelRef = this.bsModal.show(AdminModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    });

    modelRef?.content?.onClose.subscribe((res: any) => {
      this.getAllAdminList();
    })
  }

  delete(admin: any){
    const initialState: initialState = {
      title :'Delete',
      msg: '',
      popUpType:'delete',
      data: {}
    }

   const modalRef = this.bsModal.show(AdminModalComponent,{
      initialState,
      class:MODALCSS.DEFAULT_SMALL,
    });
    modalRef?.content?.onClose.subscribe((result: any) => {
      if(result == 'y') {
        this.adminService.deleteAdminData(admin?.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.loaderService.hide();
            this.commonService.show('Record deleted successfully',TOAST_TYPES.SUCCESS);
            this.getAllAdminList();
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.commonService.show('Failed to delete the record',TOAST_TYPES.ERROR);
          }
        })
      }
    })
  }
}


