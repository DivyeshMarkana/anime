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

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    PlyrModule,
    AppRoutingModule,
    MaterialModule
  
  ],
  providers: [
    ApiService,
    ThemeHelpersService,

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
