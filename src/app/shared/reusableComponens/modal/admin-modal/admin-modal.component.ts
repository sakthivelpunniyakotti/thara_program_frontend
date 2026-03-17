import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  providers: [
    TitleCasePipe
  ],
  templateUrl: './admin-modal.component.html',
  styleUrl: './admin-modal.component.css'
})
export class AdminModalComponent implements OnInit {

  title: string = '';
  popUpType: string = '';
  data: any='';

  adminForm!:FormGroup;

  constructor(
    private modalref: BsModalRef,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private adminService: AdminService,
    private titlecase: TitleCasePipe
   ){
    this.adminForm = new FormGroup({
      name: new FormControl('',Validators.required),
      password: new FormControl('',[Validators.required, Validators.maxLength(30),Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]),
      cPassword: new FormControl('',Validators.required),
      role: new FormControl('',Validators.required),
      org: new FormControl('',Validators.required)
    })
  }

  ngOnInit(): void {
      this.getRole();
      this.getOrganization();

      if(this.popUpType == 'edit') {
        console.log(this.data,'data')
        this.adminForm.patchValue({
          name: this.titlecase.transform(this.data?.name),
          password: this.data?.password,
          cPassword: this.data?.cPassword,
          role: this.data?.type,
          org: this.data?.org
        });
      }
  }
  onClose: Subject<any> = new Subject();
    
      closeModal(data?: any) {
        this.onClose.next(data);   // send data back
        this.onClose.complete();
        this.modalref.hide();
        console.log('close modeal called')
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
    
    const password = this.adminForm.get('password')?.value;
    const cPassword = this.adminForm.get('cPassword')?.value;
    if(password == cPassword) {
      this.loaderService.show();

    const payload = {
      name: this.adminForm.get('name')?.value.trim(),
      password: this.adminForm.get('password')?.value.trim(),
      type: this.adminForm.get('role')?.value,
      org: this.adminForm.get('org')?.value,
    }
    this.adminService.postAdminData(payload)
    .subscribe({
      next: (res: any) => {
        console.log(res);
        this.loaderService.hide();
        this.hide()
        this.commonService.show('Record created successfully',TOAST_TYPES.SUCCESS);
      },
      error: (error: any) => {
        this.loaderService.hide();
        // this.hide()
        console.log(error)
        if(error.errorMsg.length == 0) {
          this.hide();
          this.commonService.show(error.statusMsg,TOAST_TYPES.ERROR);
        } else {
           this.commonService.show(error.errorMsg.errors[0].msg,TOAST_TYPES.ERROR);
        }
       this.hide()
      this.closeModal('created')
      }
    })
  } else {
    this.hide();
    this.commonService.show('password and confirm pasword is not matching',TOAST_TYPES.ERROR);
  }
  }

  hide(){
    this.modalref.hide();
  }

  update() {
    this.loaderService.show();
    console.log('student');

  if(this.adminForm.get('password')?.value === this.adminForm.get('cPassword')?.value) {
  const payload = {
     name: this.adminForm.get('name')?.value.trim(),
     password: this.adminForm.get('password')?.value.trim(),
     type: this.adminForm.get('role')?.value,
     org: this.adminForm.get('org')?.value,
     id: this.data?.id
  };
  console.log(payload)
  this.adminService.updateAdminData(payload)
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.loaderService.hide();
      this.closeModal();
      this.commonService.show('Updated successfully',TOAST_TYPES.SUCCESS);
    },
    error: (error: any) => {
      this.loaderService.hide();
      console.log(error);
      this.closeModal();
      this.commonService.show('failed to update record',TOAST_TYPES.ERROR);
    }
  })
} else {
   this.commonService.show('Password and Confirm password is not matching',TOAST_TYPES.ERROR);
   this.hide();
   this.loaderService.hide()
}
  }

  passwordMatch() {
    const password = this.adminForm.get('password')?.value 
    const cPassword = this.adminForm.get('cPassword')?.value
    
    return password == cPassword
  }

  toggleEye(event: HTMLInputElement) {
    if(event.type == 'text') {
      event.type = 'password'
    } else {
      event.type = 'text'
    }
  }
  
  delete() {
    this.closeModal('y');
  }
}
