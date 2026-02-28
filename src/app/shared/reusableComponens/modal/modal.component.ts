import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../core/service/common.service';
import { LoaderService } from '../../../core/service/loader.service';
import { TOAST_TYPES } from '../enums/toastType';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    TitleCasePipe
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
 
  data: any;
  popUpType: any;
  title: any = '';
  selectedValue: any = '';
  configForm!: FormGroup

  constructor(
    private modalRef: BsModalRef,
    private commonService: CommonService,
    private loaderSerive: LoaderService,
    private titleCase: TitleCasePipe  
  ){
    this.configForm = new FormGroup({
      configType: new FormControl('',Validators.required),
      value: new FormControl('',Validators.required)
    })
  }

  ngOnInit(): void {
    this.getConfigData();
    console.log(this.data)
    if(this.title == 'Edit') {
      this.configForm.patchValue({
        configType:this.data?.configType ,
        value: this.titleCase.transform(this.data?.value)
      })
    }
  }

  onClose: Subject<any> = new Subject();

  closeModal(data?: any) {
    this.onClose.next(data);   // send data back
    this.onClose.complete();
    this.modalRef.hide();
  }

  // for hiding
  hide(){
    this.modalRef.hide();
  }

  configData:any;
  getConfigData() {
    this.loaderSerive.show();
    this.commonService.getConfigData(true)
    .subscribe({
      next: (res: any) => {
        this.configData = res?.responseBody;
        this.loaderSerive.hide();
      },
      error: (error: any) => {
        this.loaderSerive.hide();
        console.log(error);
      }
    })
  }

  /**
   * @function to create a config type
   * @param con
   */

  postConfigData() {
    this.loaderSerive.show();
    const payload  = {
    "configType": this.configForm.get('configType')?.value,
    "value": this.configForm.get('value')?.value
    }
    console.log(this.configForm.value,'form data')

      this.commonService.postConfigData(payload)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.loaderSerive.hide();
          this.commonService.show('Config data added',TOAST_TYPES.SUCCESS);
          this.modalRef.hide();
        },
        error: (err: any) => {
          console.log(err);
          this.loaderSerive.hide();
          this.commonService.show(err?.error?.statusMsg,TOAST_TYPES.ERROR);
          this.modalRef.hide();
        }
      })
    

  }

  updateConfig() {
    this.loaderSerive.show();
    const payload = {
      "configType":this.configForm.get('configType')?.value,
      "value":this.configForm.get('value')?.value,
      "id": this.data?.id
    }

    this.commonService.updateConfigData(payload)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.loaderSerive.hide();
          this.hide();
          this.commonService.show('Updated Successfully',TOAST_TYPES.SUCCESS);
        },
        error: (error: any) => {
          console.log(error);
          this.commonService.show('Failed to update',TOAST_TYPES.ERROR);
          this.loaderSerive.hide();
        }
      })
  }

  showDropdown() {
    if(this.selectedValue == 'new') {
      this.selectedValue = '';
    }
  }

  selectValue(event: any) {
    console.log(event.target.value)
    this.selectedValue = event.target.value;
    if(this.selectedValue == 'new') {
      this.configForm.get('configType')?.reset();
    }
  }

  delete() {
     this.closeModal('Y');
  }
}
