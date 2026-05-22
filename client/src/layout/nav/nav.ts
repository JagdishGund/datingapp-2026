import { Component, inject, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {

  protected creds: any= {};
  private router = inject(Router);
  private toast = inject(ToastService);
  protected accountService= inject(AccountService);

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
