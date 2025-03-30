import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { PlyrModule } from '@atom-platform/ngx-plyr';
// import { HomeComponent } from './Modules/home/home.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApiService } from './shared/api.service';
import { MaterialModule } from './material/material.module';
import { DashboardComponent } from './Modules/dashboard/dashboard.component';
import { ThemeHelpersService } from './shared/theme-helpers.service';
import { PlayerModule } from './common/player/player.module';
import { AuthModule } from './core/auth/auth.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { MegaPlayerModule } from './common/mega-player/mega-player.module';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    PlyrModule,
    PlayerModule,
    MegaPlayerModule,
    AppRoutingModule,
    MaterialModule,
    AuthModule

  ],
  providers: [
    ApiService,
    ThemeHelpersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideAnimationsAsync(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
