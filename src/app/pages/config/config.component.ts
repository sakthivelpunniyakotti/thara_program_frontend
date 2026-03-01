import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { initialState, TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { ModalComponent } from '../../shared/reusableComponens/modal/modal.component';
import { MODALCSS } from '../../shared/reusableComponens/enums/toastType';
import { LoaderService } from '../../core/service/loader.service';
import { CommonService } from '../../core/service/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent implements OnInit {

serialNo: number = 1;
filterType: any = 'all';
searchKey: any = '';

constructor(private bsmodel: BsModalService,private loaderService: LoaderService, private commonService: CommonService){}


ngOnInit(): void {
    this.getConfigList();
    this.getConfigData();
}

search() {
  this.loaderService.show();

  this.commonService.searchConfig(this.searchKey)
  .subscribe({
    next: (res: any) => {
      if(res?.statusCode == '200') {
        this.configTableData = res?.responseBody;
        this.loaderService.hide();
      }
    },
    error: (err: any) => {
      console.log(err);
      this.commonService.show(err?.error?.statusMsg,TOAST_TYPES.ERROR);
      this.configTableData = [];
      this.loaderService.hide();
    }
  })
}

filterTable() {
  this.loaderService.show();
  this.commonService.getFilteredConfig(this.filterType)
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.configTableData = res?.responseBody;
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.log(error);
      this.loaderService.hide();
    }
  })
}

filterData:any;
  getConfigData() {
    this.loaderService.show();
    this.commonService.getConfigData(true)
    .subscribe({
      next: (res: any) => {
        this.filterData = res?.responseBody;
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        console.log(error);
      }
    })
  }

configTableData: any;
getConfigList() {
  this.loaderService.show();
  this.commonService.getConfigData(false)
  .subscribe({
    next: (res: any) => {
      this.loaderService.hide();
      this.configTableData = res?.responseBody;
    },
    error: (error: any) => {
      console.log(error);
      this.loaderService.hide();
    }
  })
}

  addLabel(){
    const initialState: initialState = {
      title: 'Label',
      msg: '',
      popUpType:'add',
      data: {}
    }

   const modelRef = this.bsmodel.show(ModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })

    modelRef.onHidden?.subscribe(() => {
      this.getConfigList();
    })

  }

  delete(config: any){
    const initialState: initialState = {
      title: 'delete',
      msg: '',
      popUpType:'delete',
      data: {}
    }

   const modelRef = this.bsmodel.show(ModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })

    modelRef.content?.onClose.subscribe((result: any) => {
      console.log(result,'model response');
      if(result == 'Y') {
        this.commonService.deleteConfigData(config?.id)
        .subscribe({
          next: (res: any) => {
            if(res?.statusCode == '200') {
              this.getConfigList();
              this.commonService.show('Record deleted successfully',TOAST_TYPES.SUCCESS);
            }
            this.loaderService.hide();
          },
          error: (error: any) => {
            console.log(error);
            this.loaderService.hide();
            this.commonService.show('Failed to delete',TOAST_TYPES.ERROR);
          }
        })
      }
    })

  }

  edit(config: any){
    const initialState: initialState = {
      title: 'Edit',
      msg:'',
      popUpType:'edit',
      data: config
    }
   const modelRef = this.bsmodel.show(ModalComponent,{
      initialState,
      class:MODALCSS.CENTER
    })

    modelRef.onHidden?.subscribe(() => {
      this.getConfigList();
    })

    
  }



  
}
