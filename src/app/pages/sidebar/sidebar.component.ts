import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface icons {
  name: string,
  imgUrl: string,
  navigateUrl: string
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  //back api structure
  icons : icons[] = [{
    name: 'Dashboard',
    imgUrl: 'dashboard.svg',
    navigateUrl: 'dashboard'
  },{
    name: 'Admin',
    imgUrl: 'adminmaster.svg',
    navigateUrl: 'admin'
  },{
    name: 'Dev',
    imgUrl: 'dev.svg',
    navigateUrl: 'dev'
  },{
    name: 'Student Master',
    imgUrl: 'studentmaster.svg',
    navigateUrl: 'student-master'
  },{
    name: 'Workboard',
    imgUrl: 'workboard.svg',
    navigateUrl: 'workboard'
  },{
    name: 'Task',
    imgUrl: 'task.svg',
    navigateUrl: 'task-manager'
  }];

  ngOnInit(): void {
    // restore the screen access from the local storage.
  }


}
