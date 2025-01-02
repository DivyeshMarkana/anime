import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlyrComponent } from '@atom-platform/ngx-plyr';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';
import { register } from 'swiper/element/bundle';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

// import SwiperCore from 'swiper';
// import Navigation from 'swiper/modules/navigation';
// import Pagination from 'swiper/modules/pagination';
// import Scrollbar from 'swiper/modules/scrollbar';
// import A11y from 'swiper/modules/a11y';
register();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'video';
  loading = true;

  // get the component instance to have access to plyr instance
  @ViewChild('plyrElement', { static: true }) plyr: PlyrComponent;
  @ViewChild('swiper', { static: false }) swiper!: ElementRef<SwiperContainer>;

  // or get it from plyrInit event
  player: Plyr[] = [];


  // http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8
  videoSources= [
    {
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
  ];

  options: SwiperOptions = {
    speed: 500,
    slidesPerView: 3,
    slidesPerGroup: 1,
    // loop: true,
    spaceBetween: 10,

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


  slides:any = []

  constructor(private firestore: Firestore){}

  

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.getList();
    }, 3000);
  }

  ngAfterViewInit(): void {
    // Object.assign(this.swiper.nativeElement, this.options);
    // this.swiper.nativeElement.initialize();
  }

  initPlyr(event:any){
    this.player = event;
  }

  played(event: any) {
    console.log('played', event);
  }

  play(): void {
    // this.player.play(); // or this.plyr.player.play()
  }

  getList(){
    const q = query(collection(this.firestore, "anime"), where("groups", "array-contains", 'Recommendation'));

    (() => {
      getDocs(q).then((snapshot) => {
        let data: any[] = []
        snapshot.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id })
        });

        // console.log(data);
        
        this.slides = data;
        // this.loadingLatest = false;
        // console.log(this.latestList);
        // this._change.detectChanges();
      })
    })();
  }


}
