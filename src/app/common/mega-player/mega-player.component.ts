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

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-mega-player',
  templateUrl: './mega-player.component.html',
  styleUrls: ['./mega-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MegaPlayerComponent implements OnInit {

  data: any = null;
  loading = true;
  title = '';
  epNumber = '';
  HTML: any = '';

  constructor(
    private api: ApiService,
    private firestore: Firestore,
    private _change: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialofRef: MatDialogRef<MegaPlayerComponent>,
    private themeHelper: ThemeHelpersService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    console.log(this.data);

    if (this.data) {
      this.title = this.data['title'];
      this.epNumber = this.data['episodeNumber'];

      this.HTML = this.sanitizer.bypassSecurityTrustHtml(this.data.embededHTML);
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
