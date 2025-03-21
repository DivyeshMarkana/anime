import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from './auth.utils';

@Injectable()
export class AuthService {
    _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        // private appConfig: AppConfigService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('userToken', token);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get accessToken(): string {
        return localStorage.getItem('userToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /** Returns the auth token from local storage */
    loadToken() {
        return localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : null;
    }

    /**
     * @param includeToken - Wether or not to include the auth token in the header
     * @param contentType - the content type to specify in the header
     */
    loadHeaders(includeToken: boolean = true, contentType: string = 'application/json') {
        let headers = {};
        if (includeToken) {
            headers = {
                Authorization: localStorage.getItem('userToken'),
                'Content-Type': contentType
            };
        } else {
            headers = {
                'Content-Type': contentType
            };
        }
        return headers;
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.clear();

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        } else {
            return of(true);
        }
    }
}
