import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { CartComponent } from './cart/cart.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "auth", component: AuthorizationComponent},
    {path: "cart", component: CartComponent},
    {path: "details", component: DetailsComponent}
];
