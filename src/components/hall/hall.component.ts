import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { HallService } from '../../services/hall.service';
import { Hall } from '../../interfaces/hall';
import { DotsPipe } from '../../Pipes/dots.pipe';
import { AddressServiceService } from '../../services/address-service.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FavouritesService } from '../../services/favourites.service';
import Swal from 'sweetalert2';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-hall',
  standalone: true,
  templateUrl: './hall.component.html',
  imports: [CommonModule, RouterLink, FormsModule, DotsPipe, SpinnerComponent],
  styleUrls: ['./hall.component.scss'],
})
export class HallComponent implements OnInit {
  AllGovernments: any[] = [];
  Cites: any[] = []; 
  selectedTown: number = 0;
  selectedCity: number = 0;
  selectedPriceRange: string = 'all';
  halls: Hall[] = [];
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;

  registerForm: FormGroup;
  isload: boolean = false;
  constructor(
    private hallService: HallService,
    private addressService: AddressServiceService,
    private fb: FormBuilder,
    private fav:FavouritesService,
    private chatService: ChatService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      govID: [''],
      cityID: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.loadGovernorates();

    this.registerForm
      .get('govID')
      ?.valueChanges.subscribe((governorateID: number) => {
        if (governorateID) {
          this.onGovernorateChange(governorateID);
        } else {
          this.Cites = [];
          this.registerForm.get('cityID')?.reset({ value: '', disabled: true });
        }
      });

    this.filterHalls();
  }

  loadGovernorates(): void {
    this.isload = true;
    this.addressService.getGovernorates().subscribe((response: any) => {
      this.AllGovernments = response.data;
      this.isload = false;
    });
  }

  onGovernorateChange(governorateID: number): void {
    if (governorateID) {
      this.addressService
        .getCitiesByGovId(governorateID)
        .subscribe((response: any) => {
          this.Cites = response.data;
          this.registerForm.get('cityID')?.enable();
          this.selectedCity = 0;
          this.selectedTown = 0; // تحديث المحافظة المختارة
          this.currentPage = 1; // إعادة تعيين الصفحة الحالية إلى 1 عند تغيير المحافظة
          this.filterHalls();
        });
    } else {
      this.Cites = [];
      this.selectedCity = 0;
      this.registerForm.get('cityID')?.disable();
      this.currentPage = 1; // إعادة تعيين الصفحة الحالية إلى 1 عند إلغاء تحديد المحافظة
      this.filterHalls();
    }
  }

  filterHalls(): void {
    const govId = this.selectedTown || 0;
    const cityId = this.selectedCity || 0;
this.isload=true;
    this.hallService
      .getAllHalls(
        this.currentPage,
        this.pageSize,
        this.selectedPriceRange,
        govId,
        cityId
      )
      .subscribe({
        
        next: (data) => {
          this.isload=false;
          this.halls = data.data;
          this.totalPages = data.paginationInfo.totalPages;
          console.log(data);
          
    
        },
        error: (error) => {
          this.isload=false;
          if (error.status === 404) {
            this.halls = [];
      
          } else {
            console.error('An error occurred:', error);
          
          }
        },
      });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterHalls();
    }
  }

  getPaginatedHalls(): Hall[] {
    return this.halls;
  }

  truncateDescription(description: string): string {
    return description.length > 100
      ? description.substring(0, 100) + '...'
      : description;
  }

  toogleFavorite(id:number){
    if (localStorage.getItem('token')) {
      this.fav.toggleFavorite(id).subscribe({
        next:(res)=>{
          console.log(res);
          this.filterHalls();
          
        }
      })
    } else {
      Swal.fire({
        title: 'غير مسجل ',
        text: 'أنت غير مسجل . يجب عليك تسجيل الدخول أولاً.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'تسجيل الدخول',
        cancelButtonText: 'إلغاء',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/Login']);
        }
      });
    }



   
      }
      


  
  openChat(ownerId: string) {
    if (localStorage.getItem('token')) {
      this.chatService.GetChatIdFromServices(ownerId).subscribe((res) => {
        localStorage.setItem('ownerId', ownerId);
        sessionStorage.setItem('ownerId', res.data.user.id);

        this.router.navigate(['/Chats/chat', res.data.chatId]);
      });
    } else {
      Swal.fire({
        title: 'غير مسجل ',
        text: 'أنت غير مسجل . يجب عليك تسجيل الدخول أولاً.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'تسجيل الدخول',
        cancelButtonText: 'إلغاء',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/Login']);
        }
      });
    }
  }
}
