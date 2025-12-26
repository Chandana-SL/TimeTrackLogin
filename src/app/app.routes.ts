import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './roles/auth/home/home.component';
import { NgModule } from '@angular/core';
import { AdminComponent } from './roles/admin/admin.component';

export const routes: Routes = [
    { path: '',component:HomeComponent},
    {path:'admin',component:AdminComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingMosule{}
