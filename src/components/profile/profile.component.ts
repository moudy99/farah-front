

import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
  import { City } from './../../interfaces/city';
import Swal from 'sweetalert2';
import { Governorate } from './../../interfaces/governorate';
import { AddressServiceService } from '../../services/address-service.service';
import { CustomerInfoService } from '../../services/customer-info.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  editProfileForm:FormGroup;
  AllGovernments: Governorate[] = [];
  Cites: City[] = [];
  constructor(private fb: FormBuilder,private addressService:AddressServiceService
     ,private ownerService:CustomerInfoService){
    this.editProfileForm=this.fb.group({
      FirstName:['',Validators.required],
      LastName:['',Validators.required],
      Email:['',Validators.required],
      PhoneNumber:['',Validators.required],
      SSN:['',Validators.required],
      GovID:['',Validators.required],
      CityID: [{ value: '', disabled: true }, Validators.required],
      YourFavirotePerson:['',Validators.required],
      SetNewProfileImage:['',Validators.required],
    });
  }
  ngOnInit(): void {
    let email = localStorage.getItem('email');
    if (email) {
      this.GetOwnerProfileInfo(email);
    } else {
      console.error('Email not found in local storage.');
    }
    this.loadGovernorates();
  
    this.editProfileForm
      .get('GovID')
      ?.valueChanges.subscribe((governorateID: number) => {
        if (governorateID) {
          this.onGovernorateChange(governorateID);
        } else {
          this.Cites = [];
          this.editProfileForm
            .get('CityID')
            ?.reset({ value: '', disabled: true });
        }
      });
  }
  loadGovernorates(): void {
    this.addressService.getGovernorates().subscribe((response: any) => {
      this.AllGovernments = response.data;
    });
  }
  onGovernorateChange(governorateID: number): void {
    this.addressService
      .getCitiesByGovId(governorateID)
      .subscribe((response: any) => {
        this.Cites = response.data;
        this.editProfileForm.get('CityID')?.enable();
      });
  }
  GetOwnerProfileInfo(Email: string) {
    this.ownerService.GetCustomerInfo(Email).subscribe(
      (response: any) => {
        console.log('Full response:', response); // Log the entire response
  
        const data = response.data;
        console.log('Data:', data); // Log the data object
  
        if (data) {
          console.log('FirstName:', data.firstName); // Log FirstName specifically
  
          this.editProfileForm.patchValue({
            FirstName: data.firstName,
            LastName: data.lastName,
            Email: data.email,
            PhoneNumber: data.phoneNumber,
            SSN: data.ssn,
            GovID: data.govID,
            CityID: data.cityID,
            YourFavirotePerson: data.yourFavirotePerson,
            SetNewProfileImage: data.setNewProfileImage
          });
        } else {
          console.error('Data is undefined or null');
        }
      },
      (error: any) => {
        console.error('Error fetching owner info:', error);
      }
    );
  }
  
  
  onSubmit(): void {
    this.editProfileForm.markAllAsTouched();
  
    if (this.editProfileForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول وإضافة الصور.',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('FirstName', this.editProfileForm.get('FirstName')?.value);
    formData.append('LastName', this.editProfileForm.get('LastName')?.value);
    formData.append('Email', this.editProfileForm.get('Email')?.value);
    formData.append('PhoneNumber', this.editProfileForm.get('PhoneNumber')?.value);
    formData.append('SSN', this.editProfileForm.get('SSN')?.value);
    formData.append('GovID', this.editProfileForm.get('GovID')?.value);
    formData.append('CityID', this.editProfileForm.get('CityID')?.value);
    formData.append('YourFavirotePerson', this.editProfileForm.get('YourFavirotePerson')?.value);
    formData.append('SetNewProfileImage', this.editProfileForm.get('SetNewProfileImage')?.value);
    
    this.ownerService.UpdateCustomerInfo(formData).subscribe(
      (response: any) => {
        console.log(response);
        
        Swal.fire({
          icon: 'success',
          title: 'نجاح',
          text: 'تم تحديث البروفايل بنجاح.',
        });
        this.editProfileForm.reset();
        // this.images = [];
        // features.clear();
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء تحديث البروفايل.',
        });
      }
    );
    
  }
  
  }
  
  
  
  
