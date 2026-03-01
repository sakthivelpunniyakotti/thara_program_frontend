import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = environment.testUrl;

  constructor(private http: HttpClient) { }

  postTaskData(payload: any):Observable<any> {
    const url = `${this.baseUrl}/task/create`;
    return this.http.post(url,payload).pipe(
      catchError((error) => {
        console.log('Error while posting the task data');
        return throwError(() => error)
      })
    )

  }

  // get with filter
  // getFilteredTaskList(subject='',grade=''): Observable<any> {
  //   const url = `${this.baseUrl}/task/filter/${subject}/${grade}`;

  //   return this.http.get(url).pipe(
  //     catchError((error) => {
  //       console.error('Error while fetching filtered task master list', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  getFilteredTaskList(subject: string = '', grade: string = ''): Observable<any> {

  let params = new HttpParams();

  if (subject) {
    params = params.set('subject', subject);
  }

  if (grade) {
    params = params.set('grade', grade);
  }

  return this.http.get(`${this.baseUrl}/task/filter`, { params }).pipe(
    catchError((error) => {
      console.error('Error while fetching filtered task master list', error);
      return throwError(() => error);
    })
  );
}
}
