import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member, Photo } from '../../types/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  private http= inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMemberById(id: string){
    return this.http.get<Member>(this.baseUrl + 'members/' + id);
  }

  getMemberPhotos(memberId: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + memberId + '/photos');
  }
  // private getHttpOptions(){ we can use this method to add the token to the header of the request, but we will use an interceptor for that
  //   return {  like  return this.http.get<Member>(this.baseUrl + 'members/' + id, getHttpOptions());
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + this.accountService.currentUser()?.token
  //     })
  //   }
  // }
  
}
