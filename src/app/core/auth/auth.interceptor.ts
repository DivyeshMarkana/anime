import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    /**
     * Constructor
     */
    constructor(private _authService: AuthService)
    {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        let newReq = req.clone();

        // App auth token for normal API calls (when present).
        if ( this._authService.accessToken )
        {
            newReq = newReq.clone({
                headers: newReq.headers.set('Authorization',  this._authService.accessToken)
            });
        }

        // Video-proxy auth for HttpClient calls to the proxy only.
        // HLS.js does not use HttpClient — see HlsjsPlyrDriver xhrSetup.
        if (this.isVideoProxyRequest(newReq.url) && environment.videoProxy?.apiKey)
        {
            const apiKey = environment.videoProxy.apiKey;
            newReq = newReq.clone({
                headers: newReq.headers
                    .set('Authorization', `Bearer ${apiKey}`)
                    .set('X-API-Key', apiKey)
            });
        }

        return next.handle(newReq).pipe(
            catchError((error) => {

                if ( error instanceof HttpErrorResponse && error.status === 401 )
                {
                    // Sign out / reload intentionally left disabled.
                }

                return throwError(error);
            })
        );
    }

    private isVideoProxyRequest(url: string): boolean
    {
        try
        {
            const requestUrl = new URL(url, typeof window !== 'undefined' ? window.location.href : undefined);
            const proxyOrigin = new URL(environment.videoProxy.baseUrl).origin;
            return requestUrl.origin === proxyOrigin;
        }
        catch
        {
            return false;
        }
    }
}
