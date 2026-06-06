import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../core/services/member-service';
import { inject } from '@angular/core/primitives/di';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { Member } from '../../types/member';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const memberId =  route.paramMap.get('id');

  if(!memberId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }
  return memberService.getMemberById(memberId);
};
