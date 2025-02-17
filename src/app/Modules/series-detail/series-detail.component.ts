import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// import { PlayerComponent } from 'src/app/common/player/player.component';
// import { HlsjsPlyrDriver } from '../../hlsjs-plyr-driver'; 
import { ApiService } from '../../shared/api.service';
import { ThemeHelpersService } from '../../shared/theme-helpers.service';
import { PlayerComponent } from '../../common/player/player.component';

@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.component.html',
  styleUrls: ['./series-detail.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class SeriesDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('posterVideo') public posterVideo : ElementRef<HTMLVideoElement>

  seasons: any = [];
  episodes: any = [];
  selectedSeason :any = null
  selectedSeasonNumber = '-1';
  loading = true;
  qParams: any = null;
  animeDetails: any = null;

  isGridView = false;

  constructor(
    private api: ApiService,
    private firestore: Firestore,
    private _change: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private dialog: MatDialog,
    private themeHelper: ThemeHelpersService
  ) {
    this._route.params.subscribe((params) => {
      if (params['id']) {
        this.getSeasons(params['id'])
        this._route.queryParams.subscribe(param => {
          if (param) {
            this.qParams = param;
          }
        });
      }
    });
  }
  

  ngOnInit(): void {
    this.getAnimeDetails(this._route.snapshot.params['id']);
    // alert(navigator.userAgent);
    // alert(window.innerHeight);
    // alert(window.innerWidth);
    
  }

  ngAfterViewInit(): void {

  }

  getAnimeDetails(id) {
    const animeDocRef = doc(this.firestore, 'anime', id); // Reference to the document

    getDoc(animeDocRef).then((snapshot) => {
      if (snapshot.exists()) {
        this.animeDetails = { ...snapshot.data(), id: snapshot.id };
      } else {
        console.log('No such document!');
      }
    }).catch((error) => {
      console.error('Error fetching document: ', error);
    });

  }


  getSeasons(id) {
    // this.loading = true;
    const list = collection(this.firestore, "seasons");
    const q = query(list, where("masterId", "==", id));

    getDocs(q).then((snapshot) => {
      let data: any[] = [];
      snapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id });
        data.sort((a, b) => a.season - b.season);
        this.seasons = data;
        this.selectedSeason = data[0];
        this.selectedSeasonNumber = data[0].season.toString();
        this.episodes = data[0].episodes;

        if (this.qParams && this.qParams['season'] && this.qParams['ep']) {
          if (this.qParams['season'] && this.qParams['ep']) {
            const season = this.seasons.find(x => x.season == this.qParams['season']);
            if (season && (season['episodes'] && season['episodes'].length > 0)) {
              const episode = season['episodes'].find(x => x.episodeNumber == this.qParams['ep']);
              if (episode) {
                const dialogRef = this.dialog.open(PlayerComponent, {
                  // id: 'cloud-plyr-idx',
                  width: '100vw',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  disableClose: true
                });
                dialogRef.componentInstance.data = episode;
              }
            }
          }
        }
        this.loading = false;
      });
    })
  }

  selectSeason(s) {
    const season = this.seasons.find(x => x.season == s);
    this.selectedSeason = season;
    this.selectedSeasonNumber = s;
    this.episodes = season['episodes'];
    this._change.detectChanges();
  }

  viewEpisode(episode, type) {
      // console.log(episode.episodeNumber);
      // return;
    // this._router.navigate([this._route.snapshot.paramMap.get('id') + `/video/${episode.episodeNumber}`]);








    const dialogRef = this.dialog.open(PlayerComponent, {
      id: 'cloud-plyr-idx',
      width: '100vw',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: true
    });

    if(type == 'play'){
      const queryParams = { season: this.selectedSeasonNumber, ep: episode.episodeNumber };
      this._router.navigate(
        [],
        {
          relativeTo: this._route,
          queryParams: queryParams,
        });
      dialogRef.componentInstance.data = episode;
    } else if(type == 'watch-now'){

      if (this.selectedSeason) {
        const episode = this.selectedSeason['episodes'][0]
        const queryParams = { season: this.selectedSeasonNumber, ep: episode['episodeNumber'] };
        this._router.navigate(
          [],
          {
            relativeTo: this._route,
            queryParams: queryParams,
          });
    
        dialogRef.componentInstance.data = episode;
        
      }
    }
  }
}
