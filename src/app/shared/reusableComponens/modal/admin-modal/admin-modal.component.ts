import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LoaderService } from '../../../../core/service/loader.service';
import { CommonService } from '../../../../core/service/common.service';
import { AdminService } from '../../../../core/service/admin.service';
import { TOAST_TYPES } from '../../enums/toastType';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './admin-modal.component.html',
  styleUrl: './admin-modal.component.css'
})
export class AdminModalComponent implements OnInit {

  title: string = '';
  popUpType: string = '';

  adminForm!:FormGroup;

  constructor(
    private modalref: BsModalRef,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private adminService: AdminService
   ){
    this.adminForm = new FormGroup({
      name: new FormControl(),
      password: new FormControl(),
      cPassword: new FormControl(),
      role: new FormControl(''),
      org: new FormControl()
    })
  }

  ngOnInit(): void {
      this.getRole();
      this.getOrganization();
  }
  onClose: Subject<any> = new Subject();
    
      closeModal(data?: any) {
        this.onClose.next(data);   // send data back
        this.onClose.complete();
        this.modalref.hide();
      }

  organization:any;
  getOrganization() {
  this.loaderService.show();
  this.commonService.getFilteredConfig('organization')
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.organization = res?.responseBody;
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.log(error);
      this.loaderService.hide();
    }
  })
}

  roles:any;
  getRole():any{
    this.loaderService.show();
    this.commonService.getRole()
    .subscribe({
      next: (res) => {
        this.roles = res?.responseBody;
        this.loaderService.hide();
      },
      error: (err: any) => {
        this.loaderService.hide();
      }
    })
  }

  save() {
    this.loaderService.show();

    const password = this.adminForm.get('password');
    const cPassword = this.adminForm.get('cPassword')
    if(password == cPassword) {

    const payload = {
      name: this.adminForm.get('name'),
      password: this.adminForm.get('password'),
      type: this.adminForm.get('role'),
      org: this.adminForm.get('org'),
    }
    this.adminService.postAdminData(payload)
    .subscribe({
      next: (res: any) => {
        console.log(res);
        this.loaderService.hide();
        this.commonService.show('Record created successfully',TOAST_TYPES.SUCCESS);

      }
    })
  } else {
    this.commonService.show('password and confirm pasword is not matching',TOAST_TYPES.ERROR);
  }
  }

  hide(){
    this.modalref.hide();
  }
}
