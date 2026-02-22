import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { initialState } from '../../shared/reusableComponens/enums/toastType';
import { MODALCSS } from '../../shared/reusableComponens/enums/toastType';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import { StudentModalComponent } from '../../shared/reusableComponens/modal/student-modal/student-modal.component';

@Component({
  selector: 'app-student-master',
  standalone: true,
  imports: [SidebarComponent,MultiSelectComponent],
  templateUrl: './student-master.component.html',
  styleUrl: './student-master.component.css'
})
export class StudentMasterComponent {

  constructor(private bsModal: BsModalService){}

  // add
  addStudent(){
    const initialState: initialState = {
      title: 'Add Student',
      msg:'',
      popUpType:'add',
      data:{}
    }

    this.bsModal.show(StudentModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })
  }

  edit(){
    const initialState: initialState = {
      title: 'Edit',
      msg:'',
      popUpType:'edit',
      data: {}
    }

    this.bsModal.show(StudentModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })
  }

  delete(){
    const initialState: initialState = {
      title: 'Delete',
      msg:'',
      popUpType:'delete',
      data: {}
    }

    this.bsModal.show(StudentModalComponent,{
      initialState,
      class: MODALCSS.DEFAULT_SMALL
    })
  }
}
