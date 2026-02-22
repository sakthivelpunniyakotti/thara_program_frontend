import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { error } from 'highcharts';

export type SnackBarType = TOAST_TYPES.SUCCESS | TOAST_TYPES.ERROR | TOAST_TYPES.WARNING;


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  baseUrl = environment.testUrl;

  constructor(private snackbar: MatSnackBar, private zone: NgZone, private http: HttpClient) { }

    /**
   * @service to initiate MAT-SNACKBAR.
   * @param message.
   * @param type.
   * @returns void.
   */

   show(message: string, type: SnackBarType): void {
    this.zone.run(() => {
      this.snackbar.open(
        message, '', { panelClass: ['snackbar-container', type], duration: 3 * 1000 },
      );
    });
  }


  // login service
  authenticateStudentUser(data: any): Observable<any> {
    const url = `${this.baseUrl}/login/student`;

    return this.http.post(url,data).pipe(
      catchError((error) => {
        console.error('Error in the authenticateUser',error);
        return throwError(() => new Error('Failed to login'));
      })
    )
  }

  authenticateOtherUser(data: any): Observable<any> {
    const url = `${this.baseUrl}/login/others`;

    return this.http.post(url,data).pipe(
      catchError((error) => {
        console.error('Error in the authenticateUser',error);
        return throwError(() => new Error('Failed to login'));
      })
    )
  }

  // grade
  getGrade():Observable<any>{
    const url = `${this.baseUrl}/student/grade`
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error in the getGrade',error);
        return throwError(() => new Error('failed to get grade'));
      })
    )
  }

  // role
  getRole():Observable<any>{
    const url = `${this.baseUrl}/others/role`
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error in the getGrade',error);
        return throwError(() => new Error('failed to get grade'));
      })
    )
  }
}
