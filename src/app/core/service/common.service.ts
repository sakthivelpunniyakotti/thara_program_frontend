import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TOAST_TYPES } from '../../shared/reusableComponens/enums/toastType';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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
        return throwError(() =>error);
      })
    )
  }

  authenticateOtherUser(data: any): Observable<any> {
    const url = `${this.baseUrl}/login/others`;

    return this.http.post(url,data).pipe(
      catchError((error) => {
        console.error('Error in the authenticateUser',error);
        return throwError(() => error);
      })
    )
  }

  // grade
  getGrade():Observable<any> {
    const url = `${this.baseUrl}/student/grade`
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error in the getGrade',error);
        return throwError(() => error);
      })
    )
  }

  // role
  getRole():Observable<any> {
    const url = `${this.baseUrl}/others/role`
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error in the getGrade',error);
        return throwError(() => error);
      })
    )
  }

  // get config data
  getConfigData(fullData: boolean): Observable<any> {
  const url = `${this.baseUrl}/config/data`;

  const params = new HttpParams()
    .set('fullData', fullData.toString());

  return this.http.get(url, { params }).pipe(
    catchError((error) => {
      console.error('Error in the config data', error);
      return throwError(() => error);
    })
  );
}

  postConfigData(payload: any):Observable<any> {
    const url = `${this.baseUrl}/config/create`;
    return this.http.post(url,payload).pipe(
      catchError((error) => {
        console.log('Error while posting the config data');
        return throwError(() => error)
      })
    )

  }

  /**
   * @function to update config data
   * @param payload 
   * @returns 
   */
  updateConfigData(payload: any):Observable<any> {
    const url = `${this.baseUrl}/config/update`;
    return this.http.put(url,payload).pipe(
      catchError((error) => {
        console.log('Error while posting the config data');
        return throwError(() => error)
      })
    )
  }

  deleteConfigData(id: number): Observable<any> {
  const url = `${this.baseUrl}/config/delete/${id}`;

  return this.http.delete(url).pipe(
    catchError((error) => {
      console.log('Error while deleting the config data');
      return throwError(() => error);
    })
  );
}

 getFilteredConfig(filter: string): Observable<any> {
    const url = `${this.baseUrl}/config/filter/${filter}`;

    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error while fetching filtered config', error);
        return throwError(() => error);
      })
    );
  }

   searchConfig(searchKey: string): Observable<any> {
    const url = `${this.baseUrl}/config/search`;

    return this.http.post(url, { searchKey }).pipe(
      catchError((error) => {
        console.error('Error while searching configs', error);
        return throwError(() => error);
      })
    );
  }

  

}
