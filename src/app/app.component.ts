import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from "./footer/footer.component";
import { LoadingScreenComponent } from "./loading-screen/loading-screen.component";
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, NavbarComponent, FooterComponent, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AngularProjectWebsite';
  constructor(public service: ApiService){
    this.loaderData()
  }

  public isLoading: any;

  loaderData(){
    this.service.loaderSent.subscribe({
      next: (data:any) => {
        this.isLoading = data
      },
      error: (err:any) => console.log(err)
    })
  }
}
