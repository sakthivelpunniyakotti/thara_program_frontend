import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { error } from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class WorkboardService {

  baseUrl = environment.testUrl;

  constructor(private http: HttpClient) { }

  getTaskHistoryOrCreate(payload: any): Observable<any> {
    const url = `${this.baseUrl}/history/get`;
    
    return this.http.post(url,payload).pipe(
          catchError((error) => {
            console.error('Error in the getting task history',error);
            return throwError(() => error.error);
          })
        )
  }
  updateTaskHistory(payload: any): Observable<any> {
    const url = `${this.baseUrl}/history/update`;
    
    return this.http.put(url,payload).pipe(
          catchError((error) => {
            console.error('Error in the updating task history',error);
            return throwError(() => error.error);
          })
        )
  }
}
