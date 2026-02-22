import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { initialState, MODALCSS } from '../../shared/reusableComponens/enums/toastType';
import { TaskModalComponent } from '../../shared/reusableComponens/modal/task-modal/task-modal.component';
import { TaskDefaulterModalComponent } from '../../shared/reusableComponens/modal/task-defaulter-modal/task-defaulter-modal.component';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    SidebarComponent,
    MultiSelectComponent
  ],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.css'
})
export class TaskManagerComponent {

  constructor(private bsModal: BsModalService){}


  addTask(){
    const initialState: initialState = {
      title: 'Add Task',
      msg: '',
      popUpType:'add',
      data:{}
    }

    this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })

  }

  openDefaulter(){
    const initialState: initialState = {
      title: 'Defaulter',
      msg: '',
      popUpType: 'default',
      data: {}
    }
    
    this.bsModal.show(TaskDefaulterModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })
  }

  edit(){
    const initialState: initialState = {
      title: 'Edit',
      msg: '',
      popUpType: 'edit',
      data: {}
    }

    this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.CENTER
    })

  }

  delete(){
    const initialState: initialState = {
      title: 'Delete',
      msg: '',
      popUpType: 'delete',
      data: {}
    }

    this.bsModal.show(TaskModalComponent,{
      initialState,
      class: MODALCSS.DEFAULT_SMALL
    })

  }
}
