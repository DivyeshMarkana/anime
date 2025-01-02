import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Modules/home/home.component';
import { DashboardComponent } from './Modules/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: ':id', loadChildren: () => import('./Modules/series-detail/series-detail.module').then(m => m.SeriesDetailModule)
      },
      {
        path: '', loadChildren: () => import('./Modules/home/home.module').then(m => m.HomeModule)
      },
      // {
      //   path: 'products', loadChildren: () => import('./components/products/products.module').then(m => m.ProductsModule)
      // },
    ],
    // canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
