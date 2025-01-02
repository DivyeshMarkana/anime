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

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PlyrModule,
    AppRoutingModule,
  
  ],
  providers: [
    // provideFirebaseApp(() => initializeApp({"projectId":"anime-cloud-b07fc","appId":"1:185931984465:web:a5cc7ecbf25477a7475270","storageBucket":"anime-cloud-b07fc.appspot.com","locationId":"us-central","apiKey":"AIzaSyBK4-aCmgdGi8-dk7puQuc3ILkCmGEcjwQ","authDomain":"anime-cloud-b07fc.firebaseapp.com","messagingSenderId":"185931984465","measurementId":"G-2X5VW5NE4N"})),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
