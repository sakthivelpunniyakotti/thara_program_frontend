import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.testUrl;
  
  constructor(private http: HttpClient) { }

  getAllAdminData(payload: any): Observable<any> {
      const url = `${this.baseUrl}/admin/data`;
      return this.http.post(url,payload).pipe(
        catchError((error) => {
            console.log('Error while getting the admin data');
            return throwError(() => error)
         })
      )
    }
  
    postAdminData(payload: any): Observable<any> {
      const url = `${this.baseUrl}/admin/create`;
  
      return this.http.post(url,payload).pipe(
        catchError((error) => {
          console.log('Error while posting the admin data');
          return throwError(() => error.error)
        })
      )
    }
  
    updateAdminData(payload: any): Observable<any> {
      const url = `${this.baseUrl}/admin/update`
  
      return this.http.put(url,payload).pipe(
        catchError((error) => {
          console.log('Error while updating the admin data');
          return throwError(() => error)
        })
      )
    }
  
    deleteAdminData(id:number): Observable<any> {
    const url = `${this.baseUrl}/admin/delete/${id}`;
  
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.log('Error while deleting the admin data');
        return throwError(() => error);
      })
    );
    }
}
