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

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  data: any = null;
  @ViewChild('plyrElement', { static: true }) plyrElement: PlyrComponent;
  loading = true;
  title = '';
  epNumber = '';
  player: Plyr[] = [];
  playingId: any;
  videoPlayerOptions = {
    autoplay: false,
    muted: false,
    autopause: false,
    // seekTime: 15,
    controls: ['play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'fullscreen'],
    quality: { default: 720, options: [1440, 1080, 720, 576] },
    resetOnEnd: true,
  };

  hlsDriver = new HlsjsPlyrDriver(true)

  vidSrc = [
    {
      src: "",
      type: 'video',
      fileId: ''
    }
  ]

  constructor(
    private api: ApiService,
    private firestore: Firestore,
    private _change: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialofRef: MatDialogRef<PlayerComponent>,
    private themeHelper: ThemeHelpersService
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    if (this.data) {
      this.vidSrc[0]['src'] = this.data['url'];
      this.vidSrc[0]['fileId'] = this.data['fileId'];
      this.title = this.data['title'];
      this.epNumber = this.data['episodeNumber'];

      setTimeout(() => {
        this.loading = false;
        this._change.detectChanges();
      }, 2500);
    }
  }

  ngAfterViewInit() {
    console.log(this.plyrElement);
  }

  ngOnDestroy(): void {
    this.hlsDriver = new HlsjsPlyrDriver(false);
  }

  @HostListener('window:keyup', ['$event'])
  onkeyUp(event) {
    event.preventDefault();

    if (this.plyrElement && this.plyrElement.player) {
      switch (event.keyCode) {
        case 32: // Space key
          this.togglePlayPause();
          event.preventDefault(); // Prevent the default spacebar action (page scroll)
          break;
        // Add more cases for other keys if needed
      }
    }

    if (event.keyCode == 27) {
      event.preventDefault();
    }

    if (event.keyCode == 39) {
      if (this.player[this.playingId]) {
        this.player[this.playingId].currentTime = this.player[this.playingId].currentTime + 10;
      }
    } else if (event.keyCode == 37) {
      if (this.player[this.playingId]) {
        this.player[this.playingId].currentTime = this.player[this.playingId].currentTime - 10;
      }
    }
  }

  initPlyr(event:any){
    this.player = event;
  }
  
  played(e, id) {
    this.playingId = id;
    let videos: any = document.getElementsByClassName("feed-player") as HTMLCollection;

    for (const i of videos) {
      if (i['data-id'] === this.playingId) {
        // if (!this.isInViewport(i)) {
        this.player[this.playingId].pause();
      }
    }
  }

  togglePlayPause() {
    const player = this.plyrElement.player;
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }

  onPlyrInit(event: any) {
    console.log('plyr init callsss');
    this.player[this.vidSrc[0]['fileId']] = event;
    this.loading = false;
    // this._change.detectChanges();




    // this.player[0].on('enterfullscreen', () => {
    //   if (this.isMobile()) {
    //     this.lockScreenOrientation();
    //   }
    // });

    // // Listen for the exitfullscreen event
    // this.player[0].on('exitfullscreen', () => {
    //   if (this.isMobile()) {
    //     this.unlockScreenOrientation();
    //   }
    // });

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



  // ********* VIDEO - ROTATION ********** 

  // handleFullscreenChange() {
  //   if (!document.fullscreenElement && this.isMobile()) {
  //     this.unlockScreenOrientation();
  //   }
  // }

  // isMobile(): boolean {
  //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  // }

  // lockScreenOrientation() {
  //   if (screen.orientation && screen.orientation.lock) {
  //     screen.orientation.lock('landscape').catch((error) => {
  //       console.error('Error locking screen orientation:', error);
  //     });
  //   }
  // }

  // unlockScreenOrientation() {
  //   if (screen.orientation && screen.orientation.unlock) {
  //     screen.orientation.unlock();
  //   }
  // }

}
