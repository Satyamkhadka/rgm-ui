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
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor(private myRoute: Router) { }
  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters
    const localItem = localStorage.getItem('LoggedInUser') ? localStorage.getItem('LoggedInUser') : '{}';
    const updatedRequest = request.clone({
      headers: request.headers.set("Authorization", localItem)
    });
    //logging the updated Parameters to browser's console
    // console.log("Before making api call : ", updatedRequest);
    return next.handle(updatedRequest).pipe(
      tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            // console.log("api call success :", event);
            if (event.body.err === 403) {
              Swal.fire('Oops', 'Session expired', 'warning');
              localStorage.removeItem("LoggedInUser");

              this.myRoute.navigate(["login"]);
            } else if (event.body.err === 401) {
              Swal.fire('Oops', 'Unauthorized!', 'info');
            }
          }
        },
        error => {
          //logging the http response to browser's console in case of a failuer
          if (error instanceof HttpErrorResponse) {
            // console.log("api call error :", event);
            console.log(error)
            Swal.fire('Oops', 'couldnot connect to node server.', 'error');

          }
        }
      )
    );
  }
}