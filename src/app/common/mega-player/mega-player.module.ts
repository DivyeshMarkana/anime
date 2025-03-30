import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MegaPlayerComponent } from './mega-player.component';
import { PlyrModule } from '@atom-platform/ngx-plyr';



@NgModule({
  declarations: [
    MegaPlayerComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    PlyrModule,
    MatProgressSpinnerModule
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MegaPlayerModule { }
