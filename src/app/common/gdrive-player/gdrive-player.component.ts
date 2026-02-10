import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// import { PlyrComponent } from 'ngx-plyr';
// import { HlsjsPlyrDriver } from 'src/app/hlsjs-plyr-driver';
import { ApiService } from '../../shared/api.service';
import { ThemeHelpersService } from '../../shared/theme-helpers.service';
import { PlyrComponent } from '@atom-platform/ngx-plyr';
import { HlsjsPlyrDriver } from '../../hlsjs-plyr-driver';
import Hls from 'hls.js';
import { environment } from '../../../environments/environment';

import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-gdrive-player',
  templateUrl: './gdrive-player.component.html',
  styleUrls: ['./gdrive-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GdrivePlayerComponent implements OnInit {

  data: any = null;
  loading = true;
  title = '';
  epNumber = '';
  HTML: any = '';

  src: SafeResourceUrl = '';

  constructor(
    private api: ApiService,
    private firestore: Firestore,
    private _change: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialofRef: MatDialogRef<GdrivePlayerComponent>,
    private themeHelper: ThemeHelpersService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    if (this.data) {
      this.title = this.data['title'];
      this.epNumber = this.data['episodeNumber'];
      const id = this.data.gdriveLink.split(environment.SOURCE_URL)[1].split('/')[0];
      const URL = environment.SOURCE_URL + id + '/preview';
       this.src = this.sanitizer.bypassSecurityTrustResourceUrl(URL);
      this._change.detectChanges();
      setTimeout(() => {
        this.loading = false;
        this._change.detectChanges();
      }, 3500);
    }
  }

  close() {
    this._dialofRef.close();
    const queryParams = { code: null };
    this._router.navigate(
      [],
      {
        relativeTo: this._route,
        queryParams: queryParams,
      });
  }
}
