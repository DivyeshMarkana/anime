import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
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

  // featuredList: any = [];
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
    slidesPerView: 1,
    centeredSlides: true,
    slidesPerGroup: 1,
    loop: true,
    // spaceBetween: -50,
    spaceBetween: 0,
    // navigation: true,
    // autoplay: {
    //   delay: 3000,  // Time between slide transitions in milliseconds
    //   disableOnInteraction: false  // Continue autoplay even if user interacts with the swiper
    // }

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
    // navigation: true,
    // autoplay: {
    //   delay: 3000,  // Time between slide transitions in milliseconds
    //   disableOnInteraction: false  // Continue autoplay even if user interacts with the swiper
    // }

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
      title: 'Blue Lock',
      subtitle: 'Season 2',
      info: '2024 | Shonen, Sport, Thriller',
      description: 'High school soccer players from across Japan gather for a controversial project designed to create the best and most egoistic striker in the world.',
      imageUrl: 'assets/featured/blue-lock-anime.jpg',
      id:1
    },
    {
      title: 'Solo Leveling',
      subtitle: 'Season 2',
      info: '2025 | Action, Adventure, Survival',
      description: 'The adventures of Sung Jinwoo in a world that is constantly threatened by monsters and evil forces. In his battles Sung transforms himself from the weakest hunter of all mankind to one of the strongest hunters in existence.',
      imageUrl: 'assets/featured/solo-leveling-anime.jpg',
      id:2
    },
    // {
    //   title: 'Tokyo Ghoul',
    //   subtitle: 'Endgame',
    //   info: '2019 | Action, Adventure | 4K HDR | 5.1',
    //   description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    //   imageUrl: 'assets/posters/ken kaneki.jpg',
    //   id:3
    // },
    {
      title: 'Wind Braker',
      subtitle: 'Season 1',
      info: '2024 | Action, Adventure, Comedy',
      description: 'Haruka Sakura has no interest in weaklings, only the strongest fighters. Starting at Furin High, a school known for student brawlers who protect their town, Haruka seeks to battle his way to the top.',
      imageUrl: 'assets/posters/wind-braker-poster.jpeg',
      id:3
    },
  ];

  constructor(
    private api: ApiService,
    private firestore: Firestore,
    private dialog: MatDialog,
    private _change: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) { }




  ngOnInit(): void {
    // this.getFeaturedList();
    this.getPopularsAnime();
    this.getRecommendations();
    this.getLatests();
    this.getSectionAnime();

  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
      // Object.assign(this.webCarouselSwiper.nativeElement, this.swiperConfigCarouselWeb);
      // this.webCarouselSwiper.nativeElement.initialize();
  
      // Object.assign(this.mobCarouselSwiper.nativeElement, this.swiperConfigCarouselMob);
      // this.mobCarouselSwiper.nativeElement.initialize();
    // }, 1500);
    
    Object.assign(this.latestSlides.nativeElement, this.swiperSlidesConfig);
    this.latestSlides.nativeElement.initialize();
    
    Object.assign(this.recommendationSlides.nativeElement, this.swiperSlidesConfig);
    this.recommendationSlides.nativeElement.initialize();

    Object.assign(this.popularSlides.nativeElement, this.swiperSlidesConfig);
    this.popularSlides.nativeElement.initialize();

    // const swiperContainer = document.querySelector('swiper-container');
    // if (swiperContainer) {
    //   const shadowRoot = swiperContainer.shadowRoot;
    //   const swiperElement = shadowRoot?.querySelector('.swiper-initialized');
    //   if (swiperElement) {
    //     this.renderer.setStyle(swiperElement, 'padding-block', '50px');
    //   } else {
    //     console.warn('Swiper element not found inside shadow DOM.');
    //   }
    // } else {
    //   console.error('Swiper container not found.');
    // }




    const links = this.elRef.nativeElement.querySelectorAll('.nav-links a[href^="#"]');
      links.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (event: Event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1); // Remove #
        const targetElement = document.getElementById(targetId!);
        if (targetElement) {
          targetElement.scrollIntoView({behavior: 'smooth'});
        }
      });
    });




  }


  //  *************************************
  //  *************************************
  // TODO ******** F E A T U R E D ********
  //  *************************************
  //  *************************************

  // getFeaturedList() {
  //   // this.loadingLatest = true;
  //   const q = query(collection(this.firestore, "seasons"), where("isFeatured", "==", true));

  //   (() => {
  //     getDocs(q).then((snapshot) => {
  //       let data: any[] = []
  //       snapshot.forEach(doc => {
  //         data.push({ ...doc.data(), id: doc.id })
  //       });

  //       this.featuredList = data;
  //       console.log(this.featuredList);
  //       this._change.detectChanges();
  //     })
  //   })();
  // }







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
