import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, Photo } from '../../types/member';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  private http= inject(HttpClient);
  private baseUrl = environment.apiUrl;
  EditMode = signal(false);
  member = signal<Member | null>(null);

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMember(id: string){
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member => {
        this.member.set(member);
      })
    )
  }

  getMemberById(id: string){
    return this.http.get<Member>(this.baseUrl + 'members/' + id);
  }

  getMemberPhotos(memberId: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + memberId + '/photos');
  }

  updateMember(member: EditableMember){
    return this.http.put(this.baseUrl + 'members', member)
  }

  // private getHttpOptions(){ we can use this method to add the token to the header of the request, but we will use an interceptor for that
  //   return {  like  return this.http.get<Member>(this.baseUrl + 'members/' + id, getHttpOptions());
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + this.accountService.currentUser()?.token
  //     })
  //   }
  // }
  
}
