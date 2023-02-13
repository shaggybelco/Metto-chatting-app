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

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private route: Router) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.showLoader(this.requests.length > 0);
  }

  showLoader(isShow: boolean) {
    if (isShow) {
      // Show Loader
      console.log('loading...');
    } else {
      // Hide Loader
      console.log('hide loader...');
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requests.push(request);
    this.showLoader(true);
    return next.handle(request).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse) {
          this.removeRequest(request);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.removeRequest(request);
        const ErrorMessage = this.setError(error);
        // this.notify.showError(ErrorMessage);
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
