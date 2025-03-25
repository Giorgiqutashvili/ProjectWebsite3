import { Component, HostListener, OnInit } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public isTokenChecker!: boolean;
  public isMobile: boolean = window.innerWidth < 900;
  public isMenuOpen: boolean = false;

  constructor(public service: ApiService, public cookie: CookieService) {
      this.checkLogin()
  }

 
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 900;
  }

  checkLogin() {
    this.service.cookieCheckSender.subscribe({
      next: (data: any) => {
        this.isTokenChecker = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
