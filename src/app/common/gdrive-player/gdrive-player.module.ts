import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GdrivePlayerComponent } from './gdrive-player.component';
import { PlyrModule } from '@atom-platform/ngx-plyr';



@NgModule({
  declarations: [
    GdrivePlayerComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    PlyrModule,
    MatProgressSpinnerModule
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GdrivePlayerModule { }
