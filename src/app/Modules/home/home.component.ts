import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ApiService } from 'src/app/shared/api.service';
import { ApiService } from '../../shared/api.service';
import { collection, Firestore, onSnapshot, deleteDoc, updateDoc, doc, getDocs, where, query } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeHelpersService } from '../../shared/theme-helpers.service';
import { getMobile } from '../../shared/theme-helpers.service';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';


interface Slide {
  title: string;
  subtitle: string;
  info: string;
  description: string;
  imageUrl: string;
  id:number
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('webCarouselSwiper', { static: false }) webCarouselSwiper!: ElementRef<SwiperContainer>;
  @ViewChild('mobCarouselSwiper', { static: false }) mobCarouselSwiper!: ElementRef<SwiperContainer>;
  @ViewChild('latestSlides', { static: false }) latestSlides!: ElementRef<SwiperContainer>;
  @ViewChild('recommendationSlides', { static: false }) recommendationSlides!: ElementRef<SwiperContainer>;
  @ViewChild('popularSlides', { static: false }) popularSlides!: ElementRef<SwiperContainer>;

  recommendationList: any = [];
  latestList: any = [];
  popularList: any = [];
  sectionAnime: any = null;

  loadingLatest = true;
  loadingRecommed = true;
  loadingPopular = true;

  // TODO ********** SECTION WITH EPISOADS **********
  sectionEpisodes: any[] = [];
  sectionSeasons: any[] = [];

  selectedSeason: any = null
  selectedSeasonNumber = '-1';


  // TODO *********** SWIPER CONFIGS ***********

  swiperConfigCarouselWeb: SwiperOptions = {
    speed: 1000,
    slidesPerView: 1.3,
    centeredSlides: true,
    slidesPerGroup: 1,
    loop: true,
    spaceBetween: -50,
    navigation: true,
    autoplay: {
      delay: 3000,  // Time between slide transitions in milliseconds
      disableOnInteraction: false  // Continue autoplay even if user interacts with the swiper
    }

    // breakpoints: {
    //   576: {
    //     slidesPerView: tablet
    //   },
    //   1200: {
    //     slidesPerView: this.slides,
    //     spaceBetween: desktopSpace
    //   }
    // }
  };

  swiperConfigCarouselMob: SwiperOptions = {
    speed: 1000,
    slidesPerView: 1,
    centeredSlides: true,
    slidesPerGroup: 1,
    loop: true,
    spaceBetween: 0,
    navigation: true,
    autoplay: {
      delay: 3000,  // Time between slide transitions in milliseconds
      disableOnInteraction: false  // Continue autoplay even if user interacts with the swiper
    }

    // breakpoints: {
    //   576: {
    //     slidesPerView: tablet
    //   },
    //   1200: {
    //     slidesPerView: this.slides,
    //     spaceBetween: desktopSpace
    //   }
    // }
  };

  swiperSlidesConfig: SwiperOptions = {
    slidesPerView: 'auto',
    centeredSlides: false,
    spaceBetween: 10,
    direction: 'horizontal',

    // breakpoints: {
    //   576: {
    //     slidesPerView: tablet
    //   },
    //   1200: {
    //     slidesPerView: this.slides,
    //     spaceBetween: desktopSpace
    //   }
    // }
  };


  //  *********************************************
  //  *********************************************
  // TODO ******** T O P - C A R O U S E L ********
  //  *********************************************
  //  *********************************************

  slides: Slide[] = [
    {
      title: 'Itachi Uchiha',
      subtitle: 'Dream is Real',
      info: '2010 | Sci-Fi, Action | 4K HDR | 5.1',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
      imageUrl: 'assets/posters/itachi-uchiha.jpg',
      id:1
    },
    {
      title: 'Naruto',
      subtitle: 'King of Monsters',
      info: '2023 | Action | 4K HDR | 5.1',
      description: 'The colossal spectacle throws terrifying monsters, including Godzilla, Mothra, and King Ghidorah into an epic battle that threatens the very existence of humanity. As these ancient super-species rise again, they all vie for supremacy, leaving humanity\'s fate hanging in the balance.',
      imageUrl: 'assets/posters/naruto.jpg',
      id:2
    },
    {
      title: 'Tokyo Ghoul',
      subtitle: 'Endgame',
      info: '2019 | Action, Adventure | 4K HDR | 5.1',
      description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
      imageUrl: 'assets/posters/ken kaneki.jpg',
      id:3
    },
    {
      title: 'Wind Braker',
      subtitle: 'Dream is Real',
      info: '2010 | Sci-Fi, Action | 4K HDR | 5.1',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
      imageUrl: 'assets/posters/wind-braker-poster.jpeg',
      id:4
    },
  ];





  constructor(
    private api: ApiService,
    private firestore: Firestore,
    private dialog: MatDialog,
    private _change: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }




  ngOnInit(): void {

    this.getPopularsAnime();
    this.getRecommendations();
    this.getLatests();
    this.getSectionAnime();

  }

  ngAfterViewInit(): void {
    Object.assign(this.webCarouselSwiper.nativeElement, this.swiperConfigCarouselWeb);
    this.webCarouselSwiper.nativeElement.initialize();

    Object.assign(this.mobCarouselSwiper.nativeElement, this.swiperConfigCarouselMob);
    this.mobCarouselSwiper.nativeElement.initialize();
    
    Object.assign(this.latestSlides.nativeElement, this.swiperSlidesConfig);
    this.latestSlides.nativeElement.initialize();
    
    Object.assign(this.recommendationSlides.nativeElement, this.swiperSlidesConfig);
    this.recommendationSlides.nativeElement.initialize();

    Object.assign(this.popularSlides.nativeElement, this.swiperSlidesConfig);
    this.popularSlides.nativeElement.initialize();
  }



    //  *********************************
  //  *********************************
  // TODO ******** L A T E S T ********
  //  *********************************
  //  *********************************

  getLatests() {
    this.loadingLatest = true;
    const q = query(collection(this.firestore, "anime"), where("groups", "array-contains", 'Latest'));

    (() => {
      getDocs(q).then((snapshot) => {
        let data: any[] = []
        snapshot.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id })
        });

        this.latestList = data;
        this.loadingLatest = false;
        // console.log(this.latestList);
        this._change.detectChanges();
      })
    })();
  }


  
  //  ***************************************************
  //  ***************************************************
  // TODO ******** R E C O M M E N D A T I O N S ********
  //  ***************************************************
  //  ***************************************************

  getRecommendations() {
    this.loadingRecommed = true;
    const q = query(collection(this.firestore, "anime"), where("groups", "array-contains", 'Recommendation'));

    (() => {
      getDocs(q).then((snapshot) => {
        let data: any[] = []
        snapshot.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id })
        });

        this.recommendationList = data;
        console.log(this.recommendationList);
        this.loadingRecommed = false;
        this._change.detectChanges();
      })
    })();
  }


  //  *********************************************
  //  *********************************************
  // TODO ******** M O S T - P O P U L A R ********
  //  *********************************************
  //  *********************************************

  getPopularsAnime() {
    this.loadingPopular = true;
    const q = query(collection(this.firestore, "anime"), where("groups", "array-contains", 'Most Popular'));

    (() => {
      getDocs(q).then((snapshot) => {
        let data: any[] = []
        snapshot.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id })
        });

        this.popularList = data;
        // console.log(this.popularList);
        this.loadingPopular = false;
        this._change.detectChanges();
      })
    })();
  }


  //  ***********************************************
  //  ***********************************************
  // TODO ******** S E C T I O N - A N I M E ********
  //  ***********************************************
  //  ***********************************************

  getSectionAnime() {
    const q = query(collection(this.firestore, "anime"), where("groups", "array-contains", 'Landing Page'));

    (() => {
      getDocs(q).then((snapshot) => {
        let data: any = null;
        snapshot.forEach(doc => {
          data = { ...doc.data(), id: doc.id }
        });

        this.sectionAnime = data;
        this.getSeasons(this.sectionAnime.id);
        this._change.detectChanges();
      })
    })();
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
        this.sectionSeasons = data;
        this.selectedSeason = data[0];
        this.selectedSeasonNumber = data[0].season.toString();
        this.sectionEpisodes = data[0].episodes.splice(0, 7);
        // console.log(this.sectionEpisodes);
        
      });
    })
  }

  selectSeason(s) {
    const season = this.sectionSeasons.find(x => x.season == s.season);
    this.selectedSeason = season;
    this.selectedSeasonNumber = s.season;
    this.sectionEpisodes = season['episodes'];
    this._change.detectChanges();
  }

    viewEpisode(episode, type) {
    // const dialogRef = this.dialog.open(PlayerComponent, {
    //   id: 'cloud-plyr-idx',
    //   width: '100vw',
    //   maxWidth: '100vw',
    //   maxHeight: '100vh',
    //   disableClose: true
    // });

    // if (type == 'play') {
    //   const queryParams = { season: this.selectedSeasonNumber, ep: episode.episodeNumber };
    //   this._router.navigate(
    //     [],
    //     {
    //       relativeTo: this._route,
    //       queryParams: queryParams,
    //     });
    //   dialogRef.componentInstance.data = episode;
    // }
  }

}
