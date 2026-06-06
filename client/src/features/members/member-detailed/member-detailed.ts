import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed {

  private route = inject(ActivatedRoute);
  protected member =  signal<Member | undefined>(undefined);
  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member.set(data['member'])
    });
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.subscribe(() => { // we can use pipe also to filter the events and only listen to NavigationEnd event
      this.title.set(this.route.firstChild?.snapshot?.title);
    });
  }
}
