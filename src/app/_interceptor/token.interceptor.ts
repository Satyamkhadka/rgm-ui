import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor() { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters
    const localItem = localStorage.getItem('LoggedInUser')? localStorage.getItem('LoggedInUser'):  '{}';
    const updatedRequest = request.clone({
      headers: request.headers.set("Authorization",localItem )
    });
    //logging the updated Parameters to browser's console
    // console.log("Before making api call : ", updatedRequest);
    return next.handle(updatedRequest).pipe(
      tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            // console.log("api call success :", event);
          }
        },
        error => {
          //logging the http response to browser's console in case of a failuer
          if (event instanceof HttpResponse) {
            // console.log("api call error :", event);
          }
        }
      )
    );
  }
}