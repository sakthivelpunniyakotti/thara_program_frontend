import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { error } from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  baseUrl = environment.testUrl;

  constructor(private http: HttpClient) { }

  getAllStudentData(): Observable<any> {
    const url = `${this.baseUrl}/student/data`;
    return this.http.get(url).pipe(
      catchError((error) => {
          console.log('Error while getting the student data');
          return throwError(() => error)
       })
    )
  }

  postStudentData(payload: any): Observable<any> {
    const url = `${this.baseUrl}/student/create`;

    return this.http.post(url,payload).pipe(
      catchError((error) => {
        console.log('Error while posting the student data');
        return throwError(() => error)
      })
    )
  }

  updateStudentData(payload: any): Observable<any> {
    const url = `${this.baseUrl}/student/update;`

    return this.http.post(url,payload).pipe(
      catchError((error) => {
        console.log('Error while updating the student data');
        return throwError(() => error)
      })
    )
  }

  deleteStudentData(id:number): Observable<any> {
  const url = `${this.baseUrl}/student/delete/${id}`;

  return this.http.delete(url).pipe(
    catchError((error) => {
      console.log('Error while deleting the student data');
      return throwError(() => error);
    })
  );
  }
}
