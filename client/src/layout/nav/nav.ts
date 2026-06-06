import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { theme } from '../themes';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {

  protected creds: any= {};
  private router = inject(Router);
  private toast = inject(ToastService);
  protected accountService= inject(AccountService);

  protected selectedTheme = signal<string>(localStorage.getItem('selectedTheme') || 'light');
  protected themes = theme;

  handleSelectTheme(theme: string){
    this.selectedTheme.set(theme);
    localStorage.setItem('selectedTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLElement;
    if(elem) elem.blur();

  }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme',  this.selectedTheme());
  }

  login() {
    // console.log(this.creds);
    this.accountService.login(this.creds).subscribe({
      next: response => {
       this.router.navigateByUrl('/members');
       this.toast.success('Login successful!', 5000);
       this.creds= {};
      },
      error: error => {
        this.toast.error(error.error, 5000);
      }
    });
  }

  logout() {
   this.accountService.logout();
   this.router.navigateByUrl('/');
  }
}
