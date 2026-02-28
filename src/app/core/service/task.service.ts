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
}
