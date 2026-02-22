import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from '../../core/service/common.service';
import { TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { Router } from '@angular/router';
import { LoaderService } from '../../core/service/loader.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatSelectModule,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  // setting the default selection as students
  loginAs: string = 'students'
  studentsForm!:FormGroup;
  othersForm!:FormGroup;

  // need to replace with api
   roles = [
    {roleId: 'steak-0', role: 'Admin'},
    {roleId: 'pizza-1', role: 'Counsellor'},
    {roleId: 'tacos-2', role: 'Dev'}
  ];
   grades = [
    {gradeId: 'steak-0', grade: 'Steak'},
    {gradeId: 'pizza-1', grade: 'Pizza'},
    {gradeId: 'tacos-2', grade: 'Tacos'}
  ];

  constructor(private commonService: CommonService,private router: Router, private loaderService: LoaderService){
    this.studentsForm = new FormGroup({
      userName : new FormControl('',Validators.required),
      id : new FormControl('',Validators.required),
      grade : new FormControl('',Validators.required)
    })
    // add one more field called lock value should be Locked, after 3 wrong password attempt.
    this.othersForm = new FormGroup({
      userName : new FormControl('',Validators.required),
      password : new FormControl('',Validators.required),
      role : new FormControl('',Validators.required)
    })

  }

  ngOnInit(): void {
    this.getGrade();
    this.getRole();
    
  }

  getGrade():any {
    this.loaderService.show();
    this.commonService.getGrade()
    .subscribe({
      next: (res) => {
        this.loaderService.hide();
      },
      error: (err:any) => {
        this.loaderService.hide();
      }
    })
  }

  getRole():any{
    this.loaderService.show();
    this.commonService.getRole()
    .subscribe({
      next: (res) => {
        this.loaderService.hide();
      },
      error: (err: any) => {
        this.loaderService.hide();
      }
    })
  }


  // to switch between login 
  switchTo(logicAs: string){
    this.loginAs = logicAs;
    this.othersForm.reset();
    this.studentsForm.reset();
  }

  // authendicate user
  authendicateUser(formType: string){
    switch (formType){
      case 'students':
        console.log(this.studentsForm.value,'students data');
        this.loginUserAsStudent();
        // testing
        this.router.navigateByUrl('/dashboard');
        break;

      case 'others':
        console.log(this.othersForm.value,'others form data');
        this.loginUserAsOthers();
        // testing
        this.router.navigateByUrl('/dashboard');
        break;
    }
  }

  // user authentication
  loginUserAsStudent(){
    // loader
    this.loaderService.show();
    // login authentication
    this.commonService.authenticateStudentUser(this.studentsForm.value)
    .subscribe({
      next:(res:any) => {

        console.log(res,"response from server");
        // store the screen access to the local storage.
        this.loaderService.hide();
        this.router.navigateByUrl('/dashboard');
        this.commonService.show('Login successful',TOAST_TYPES.SUCCESS);
      },
      error:(err:any) => {
        this.loaderService.hide();
        this.commonService.show('Login failed',TOAST_TYPES.ERROR);
        console.log(err);
      }
    })
  }
  loginUserAsOthers(){
    // loader
    this.loaderService.show();
    // login authentication
    this.commonService.authenticateOtherUser(this.othersForm.value)
    .subscribe({
      next:(res:any) => {

        this.loaderService.hide();
        this.router.navigateByUrl('/dashboard');
        this.commonService.show('Login successful',TOAST_TYPES.SUCCESS);
      },
      error:(err:any) => {
        this.loaderService.hide();
        this.commonService.show('Login failed',TOAST_TYPES.ERROR);
        console.log(err);
      }
    })
  }
}
