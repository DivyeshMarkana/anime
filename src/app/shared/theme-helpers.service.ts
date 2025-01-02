import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
declare var $: any;

@Injectable()
export class ThemeHelpersService {

    private _listeners = new Subject<any>();

    constructor() { }

    /**
     * Listens to custom listeners
     */
    listen(): Observable<any> {
        return this._listeners.asObservable();
    }

    /**
     * Updates the custom set of listeners with new data.
     * @param type - the listener identifier or ID
     * @param data - The listener data to broadcast.
     */
    updateListener(type: string, data: any = {}) {
        this._listeners.next([type, data]);
    }

    /**
     * Check the value exists, not null, not undefined and not empty. returns true/false
     * @param value - value to check
     */
    valCheck(value) {
        if (value === null || value === '' || value === undefined) {
            return false;
        } else {
            return true;
        }
    }

    scrollToPosition(scrollDiv: string, scrollPositon: number) {
        $(scrollDiv).animate({
            scrollTop: scrollPositon
        }, 'slow');
    }

    blobToBase64(blob: Blob, callback) {
        const reader = new FileReader();
        let base64data;
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            base64data = reader.result;
            callback(base64data);
        };
    }
}

export function getMobile() {
    if (window.innerWidth < 600) {
        return true;
    } else {
        return false;
    }
}
