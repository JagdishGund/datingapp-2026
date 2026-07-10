import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../types/member';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {

  private memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updatedParams = new MemberParams();
  @ViewChild('filterModal') modal!: FilterModal;

  constructor(){
    const filters = localStorage.getItem('filters');
    if(filters){ 
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
     this.memberService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.paginatedMembers.set(result);
      }
     });
  }

  onPageChange(event: any){
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  openModal(){
    this.modal.open();
  }

  onClose(){
    // this.modal.close();
    console.log("modal closed");    
  }

  onFilterChange(newParams: MemberParams){
     this.memberParams = {...newParams};
     this.updatedParams = {...newParams};
     this.loadMembers();
  }

  resetFilters(){
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    this.loadMembers();
  } 

  get displayMessage(): string {
    const defaultParams = new MemberParams();
    const filters: string[] = [];
    if(this.updatedParams.gender){
      filters.push(this.updatedParams.gender + 's');
    }
    else{
      filters.push('Males, Females');
    }

    if(this.updatedParams.minAge !== defaultParams.minAge
       || this.updatedParams.maxAge !== defaultParams.maxAge){
      filters.push(`Age ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`);
    }


      filters.push(this.updatedParams.orderBy === 'lastActive' ? 'Recently Active' : 'Newest Members');
    

    return filters.length > 0 ? `Selected : ${filters.join('  | ')}`  : 'All Members';
  }


}
