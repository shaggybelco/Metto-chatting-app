import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private route: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requests.push(request);
    return next.handle(request).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse) {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const ErrorMessage = this.setError(error);
        // this.notify.showError(ErrorMessage);
        const showHelloToast = async () => {
          await Toast.show({
            text: ErrorMessage,
            duration: 'long',
            position: 'top',
          });
        };

        console.log(ErrorMessage);
        return throwError(error);
      })
    );
  }

  

  setError(error: HttpErrorResponse) {
    let ErrorMessage = 'Sorry we are facing technical problems';

    if (error.error instanceof ErrorEvent) {
      //client side
      ErrorMessage = error.error.error;
    } else {
      //server side
      if (error.status != 0 && error.status != 404) {
        ErrorMessage = error.error.error;
      } else if (error.status === 0) {
        // this.route.navigate(['/nointernet'])
        return (ErrorMessage = 'Check your Internet connection');
      }
    }
    console.log(ErrorMessage);
    return ErrorMessage;
  }
}
