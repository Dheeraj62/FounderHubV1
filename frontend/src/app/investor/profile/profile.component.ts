import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { UpsertInvestorProfileRequest, UpdateUserProfileRequest, ProfileCompletion } from '../../core/models/profile.models';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-investor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto py-6 sm:py-10 px-3 sm:px-4 space-y-6">
      
      <!-- Profile Completion Banner -->
      <div *ngIf="completion" class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h2 class="text-xl font-bold">Investor Profile Strength</h2>
              <span class="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">{{ completion.percent }}%</span>
            </div>
            <p class="text-emerald-100 text-sm">Founders evaluate your thesis & portfolio before pitching.</p>
          </div>
          <a *ngIf="username" [routerLink]="['/investors', username]" class="px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm transition-all shadow-md shrink-0">
            View Public Profile ↗
          </a>
        </div>
        <div class="w-full bg-white/20 rounded-full h-2.5 mt-4 overflow-hidden">
          <div class="bg-white h-2.5 rounded-full transition-all duration-500" [style.width.%]="completion.percent"></div>
        </div>
        <div *ngIf="completion.missingFields.length > 0" class="mt-3 text-xs text-emerald-200 flex flex-wrap gap-2 items-center">
          <span class="font-bold">Suggested additions:</span>
          <span *ngFor="let field of completion.missingFields.slice(0, 4)" class="px-2 py-0.5 rounded bg-white/10">{{ field }}</span>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-lg">
        <div class="bg-primary-50 border-b border-primary-100 p-6 sm:p-8 text-center sm:text-left">
          <h1 class="text-2xl sm:text-3xl font-bold text-neutral-900">Investor Profile & Thesis</h1>
          <p class="text-primary-700 mt-1 text-sm sm:text-base">Define your investment thesis and criteria to receive high-quality deal flow.</p>
        </div>

        <form #investorForm="ngForm" (ngSubmit)="save(investorForm)" class="p-6 sm:p-8 space-y-8">
          
          <!-- Identity Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Identity & Title</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input type="text" [(ngModel)]="userModel.fullName" name="fullName" placeholder="e.g. David Vance"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Professional Title / Position</label>
                <input type="text" [(ngModel)]="model.position" name="position" placeholder="e.g. Managing Partner / Angel Investor"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Investment Firm / Fund Name</label>
                <input type="text" [(ngModel)]="model.investmentFirm" name="investmentFirm" placeholder="e.g. Horizon Ventures"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                <input type="text" [(ngModel)]="model.preferredLocation" name="preferredLocation" placeholder="e.g. New York / Remote" required
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>
            </div>
          </div>

          <!-- Thesis & Bio -->
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Investment Thesis & Bio</h3>
            
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Investment Thesis</label>
              <textarea [(ngModel)]="model.investmentThesis" name="investmentThesis" rows="3" placeholder="Describe the types of founders, markets, and tailwinds you invest in..."
                        class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 resize-none text-sm"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Investor Bio <span class="text-red-500">*</span></label>
              <textarea [(ngModel)]="model.bio" name="bio" rows="3" required placeholder="Background, prior investments, value-add as an investor..."
                        class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 resize-none text-sm"></textarea>
            </div>
          </div>

          <!-- Investment Criteria Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <h3 class="text-base sm:text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Industry & Stage Focus</h3>
              
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Preferred Industries</label>
                <div class="grid grid-cols-2 gap-2">
                  <div *ngFor="let ind of availableIndustries" class="flex items-center">
                    <input type="checkbox" [id]="ind" [checked]="isIndustrySelected(ind)" (change)="toggleIndustry(ind)" class="rounded text-primary-600">
                    <label [for]="ind" class="ml-2 text-xs font-semibold text-neutral-700 cursor-pointer">{{ ind }}</label>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Preferred Stages</label>
                <div class="grid grid-cols-2 gap-2">
                  <div *ngFor="let stg of ['Idea', 'MVP', 'Early-Traction', 'Growth']" class="flex items-center">
                    <input type="checkbox" [id]="stg" [checked]="isStageSelected(stg)" (change)="toggleStage(stg)" class="rounded text-primary-600">
                    <label [for]="stg" class="ml-2 text-xs font-semibold text-neutral-700 cursor-pointer">{{ stg }}</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-base sm:text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Cheque Size & Team Criteria</h3>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Average Ticket Size</label>
                <input type="text" [(ngModel)]="model.averageTicketSize" name="averageTicketSize" placeholder="e.g. $25k - $100k"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Target Funding Round Size <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="model.preferredFundingRange" name="fundingRange" placeholder="e.g. $250k - $1M" required
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Preferred Team Size</label>
                <select [(ngModel)]="model.preferredTeamSize" name="teamSize"
                        class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
                  <option value="">Any</option>
                  <option value="1">Solo Founder</option>
                  <option value="2-5">2-5 members</option>
                  <option value="6-10">6-10 members</option>
                  <option value="11+">11+ members</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Portfolio Companies Editor -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Portfolio Companies</label>
            <div class="flex gap-2 mb-2">
              <input type="text" [(ngModel)]="portfolioInput" name="portfolioInput" placeholder="Add company name (e.g. Stripe, Airbnb)" (keyup.enter)="addPortfolio()"
                     class="flex-1 bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              <button type="button" (click)="addPortfolio()" class="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 font-bold rounded-lg text-sm text-neutral-700">Add</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let company of model.portfolioCompanies; let i = index" class="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
                {{ company }}
                <button type="button" (click)="removePortfolio(i)" class="hover:text-rose-600">×</button>
              </span>
            </div>
          </div>

          <!-- Social Links -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">Web Presence</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Website / Fund Page</label>
                <input type="url" [(ngModel)]="model.website" name="website" placeholder="https://horizon.vc"
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">AngelList / Crunchbase Profile</label>
                <input type="url" [(ngModel)]="model.angelListProfile" name="angelListProfile" placeholder="https://angellist.com/..."
                       class="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-neutral-900 text-sm">
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" [disabled]="investorForm.invalid || saving"
                    class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-md text-sm sm:text-base w-full sm:w-auto">
              {{ saving ? 'Saving...' : 'Save Preferences' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InvestorProfileComponent implements OnInit {
  private toastService = inject(ToastService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  userModel: UpdateUserProfileRequest = {
    fullName: '',
    headline: ''
  };

  model: UpsertInvestorProfileRequest = {
    preferredIndustries: [],
    preferredStages: [],
    preferredFundingRange: '',
    preferredLocation: '',
    preferredTeamSize: '',
    investmentStage: 'Early-Traction',
    ticketSizeRange: '',
    location: '',
    bio: '',
    investmentFirm: '',
    position: '',
    investmentThesis: '',
    averageTicketSize: '',
    portfolioCompanies: [],
    angelListProfile: '',
    website: '',
    linkedInVerified: false,
    linkedInProfileUrl: ''
  };

  availableIndustries: string[] = ['Fintech', 'Healthtech', 'AI/ML', 'SaaS', 'Edtech', 'E-commerce', 'Crypto', 'Clean Energy', 'Deeptech', 'Consumer'];
  portfolioInput = '';
  saving = false;
  username = this.authService.getUsername();
  completion: ProfileCompletion | null = null;

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.getInvestorProfile(userId).subscribe({
        next: (p) => {
          this.model = {
            preferredIndustries: p.preferredIndustries || [],
            preferredStages: p.preferredStages || [],
            preferredFundingRange: p.preferredFundingRange || '',
            preferredLocation: p.preferredLocation || '',
            preferredTeamSize: p.preferredTeamSize || '',
            investmentStage: p.investmentStage || 'Early-Traction',
            ticketSizeRange: p.ticketSizeRange || '',
            location: p.location || '',
            bio: p.bio,
            investmentFirm: p.investmentFirm || '',
            position: p.position || '',
            investmentThesis: p.investmentThesis || '',
            averageTicketSize: p.averageTicketSize || '',
            portfolioCompanies: p.portfolioCompanies || [],
            angelListProfile: p.angelListProfile || '',
            website: p.website || '',
            linkedInVerified: !!p.linkedInVerified,
            linkedInProfileUrl: p.linkedInProfileUrl || ''
          };
          this.cdr.markForCheck();
        }
      });

      this.loadCompletion();
    }
  }

  loadCompletion(): void {
    this.profileService.getProfileCompletion().subscribe({
      next: (res) => {
        this.completion = res;
        this.cdr.markForCheck();
      }
    });
  }

  addPortfolio(): void {
    const item = this.portfolioInput.trim();
    if (item && !this.model.portfolioCompanies.includes(item)) {
      this.model.portfolioCompanies.push(item);
      this.portfolioInput = '';
    }
  }

  removePortfolio(index: number): void {
    this.model.portfolioCompanies.splice(index, 1);
  }

  isIndustrySelected(ind: string): boolean {
    return this.model.preferredIndustries.includes(ind);
  }

  toggleIndustry(ind: string): void {
    const idx = this.model.preferredIndustries.indexOf(ind);
    if (idx >= 0) this.model.preferredIndustries.splice(idx, 1);
    else this.model.preferredIndustries.push(ind);
  }

  isStageSelected(stg: string): boolean {
    return this.model.preferredStages ? this.model.preferredStages.includes(stg) : false;
  }

  toggleStage(stg: string): void {
    if (!this.model.preferredStages) {
      this.model.preferredStages = [];
    }
    const idx = this.model.preferredStages.indexOf(stg);
    if (idx >= 0) this.model.preferredStages.splice(idx, 1);
    else this.model.preferredStages.push(stg);
  }

  save(form: any): void {
    if (form.invalid) {
      this.toastService.warning('Please fill in all required fields correctly.');
      return;
    }

    this.saving = true;
    this.model.investmentStage = this.model.investmentStage || 'Any';
    this.model.ticketSizeRange = this.model.ticketSizeRange || this.model.preferredFundingRange || 'Any';
    this.model.location = this.model.location || this.model.preferredLocation || 'Any';

    if (this.userModel.fullName || this.userModel.headline) {
      this.profileService.updateUserProfile(this.userModel).subscribe();
    }

    this.profileService.upsertInvestorProfile(this.model).subscribe({
      next: () => {
        this.saving = false;
        this.toastService.success('Investor criteria saved successfully!');
        this.loadCompletion();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.saving = false;
        this.toastService.error(err.error?.message || 'Failed to update preferences.');
        this.cdr.markForCheck();
      }
    });
  }
}
