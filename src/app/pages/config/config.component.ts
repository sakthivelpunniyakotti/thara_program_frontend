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
pageNo: number = 1;

constructor(private bsmodel: BsModalService,private loaderService: LoaderService, private commonService: CommonService){}


ngOnInit(): void {
    this.getConfigList();
    this.getConfigData();
}

back() {
  
    this.pageNo--;
    this.filterTable();
  
}

forward() {
  this.pageNo++;
  this.filterTable()
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

pageMultiple: number =1;
totalPage: any;
limit: number =7;
filterTable() {
  this.loaderService.show();
  const payload = {
    page: (this.pageNo<=0)?1:this.pageNo ,
    limit: this.limit
  }
  if(this.pageNo<=0) {
      this.pageNo = 1;
    }
  this.commonService.getFilteredConfigPagination(this.filterType,payload)
  .subscribe({
    next: (res: any) => {
      console.log(res);
      this.configTableData = res?.responseBody;
       this.pageMultiple = res?.pagination?.currentPage;
        this.totalPage = res?.pagination?.totalPages;
      this.loaderService.hide();
    },
    error: (error: any) => {
      console.log(error);
      this.loaderService.hide();
      this.pageNo = 1
    }
  })
}

filterData:any;
  getConfigData() {
    this.loaderService.show();
    const payload = {
      page: (this.pageNo<=0)?1:this.pageNo,
      limit: 7
    }
    this.commonService.getConfigData(true,payload)
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
  const payload = {
      page: 1,
      limit: 7
    }
  this.commonService.getConfigData(false,payload)
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
      this.getConfigData()
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
        this.loaderService.show()
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
