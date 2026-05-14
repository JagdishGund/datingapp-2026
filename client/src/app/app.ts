import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // private http = Inject(HttpClient);
  protected  title = 'Dating App';
  protected members = signal<any>([]);

  constructor(private http: HttpClient) {   }

  async ngOnInit() {
    this.members.set(await this.getMembers());
  }

  async getMembers() {
    try {
      return lastValueFrom(this.http.get('http://localhost:5247/members'));
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error; // Rethrow the error after logging it  
    }
  }
}