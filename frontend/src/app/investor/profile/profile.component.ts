import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { UpsertInvestorProfileRequest } from '../../core/models/profile.models';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-investor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto py-10 px-4">
      <div class="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-lg">
        <div class="bg-primary-50 border-b border-primary-100 p-8 text-center sm:text-left">
          <h1 class="text-3xl font-bold text-neutral-900 uppercase tracking-widest">Investor Preferences</h1>
          <p class="text-primary-700 mt-2">Adjust your criteria to receive higher quality matches.</p>
        </div>

        <form #investorForm="ngForm" (ngSubmit)="save(investorForm)" class="p-8 space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Investment Thesis -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-primary-600 border-b border-neutral-200 pb-3 flex items-center">
                <span class="mr-2">🎯</span> Focus
              </h3>
              
              <div>
                <label class="block text-sm font-semibold text-neutral-600 mb-2">Preferred Industries</label>
                <div class="grid grid-cols-2 gap-3">
                  <div *ngFor="let industry of industries" class="flex items-center group">
                    <input type="checkbox" [id]="industry" [checked]="isIndustrySelected(industry)"
                           (change)="toggleIndustry(industry)"
                           class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500">
                    <label [for]="industry" class="ml-2 text-sm text-neutral-700 group-hover:text-neutral-900 cursor-pointer">{{ industry }}</label>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-neutral-600 mb-2">Target Stages</label>
                <div class="grid grid-cols-2 gap-3">
                  <div *ngFor="let stg of ['Idea', 'MVP', 'Early-Traction', 'Growth']" class="flex items-center group">
                    <input type="checkbox" [id]="stg" [checked]="isStageSelected(stg)"
                           (change)="toggleStage(stg)"
                           class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500">
                    <label [for]="stg" class="ml-2 text-sm text-neutral-700 group-hover:text-neutral-900 cursor-pointer">{{ stg }}</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Parameters -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-primary-600 border-b border-neutral-200 pb-3 flex items-center">
                <span class="mr-2">⚖️</span> Scope
              </h3>

              <div>
                <label class="block text-sm font-semibold text-neutral-600 mb-2">Preferred Funding Range <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="model.preferredFundingRange" name="fundingRange" placeholder="$50k - $250k" required
                       class="w-full bg-white border border-neutral-300 rounded-xl p-3 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm">
              </div>

              <div>
                <label class="block text-sm font-semibold text-neutral-600 mb-2">Preferred Location <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="model.preferredLocation" name="preferredLocation" placeholder="San Francisco, Berlin, etc." required
                       class="w-full bg-white border border-neutral-300 rounded-xl p-3 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm">
              </div>

              <div>
                <label class="block text-sm font-semibold text-neutral-600 mb-2">Preferred Team Size</label>
                <select [(ngModel)]="model.preferredTeamSize" name="teamSize"
                        class="w-full bg-white border border-neutral-300 rounded-xl p-3 text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm">
                  <option value="">Any</option>
                  <option value="1">Solo Founder</option>
                  <option value="2-5">2-5 members</option>
                  <option value="6-10">6-10 members</option>
                  <option value="11+">11+ members</option>
                </select>
              </div>
              
              <div class="p-4 bg-primary-50/50 border border-primary-100 rounded-xl mt-4 hidden sm:block">
                <p class="text-[10px] text-primary-600/80 font-semibold leading-relaxed uppercase tracking-widest text-center">
                  Matches are dynamically calculated using industry focus, stage alignment, and location proximity.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-xl font-bold text-primary-600 flex items-center">
              <span class="mr-2">✍️</span> Investor Bio <span class="text-red-500 text-sm ml-2">*</span>
            </h3>
            <textarea [(ngModel)]="model.bio" name="bio" rows="4" placeholder="Briefly describe your investment philosophy..." required
                      class="w-full bg-white border border-neutral-300 rounded-xl p-4 text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none shadow-sm"></textarea>
          </div>

          <div class="flex justify-center sm:justify-end">
            <button type="submit" [disabled]="investorForm.invalid"
                    class="w-full sm:w-auto bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary-500/30">
              Update Criteria
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class InvestorProfileComponent implements OnInit {
  private toastService = inject(ToastService);
  
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
    portfolioCompanies: [],
    angelListProfile: '',
    linkedInVerified: false,
    linkedInProfileUrl: ''
  };

  industries: string[] = ['Fintech', 'Healthtech', 'AI/ML', 'SaaS', 'Edtech', 'E-commerce', 'Crypto', 'Clean Energy'];

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

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
            investmentStage: p.investmentStage,
            ticketSizeRange: p.ticketSizeRange,
            location: p.location,
            bio: p.bio,
            investmentFirm: p.investmentFirm || '',
            portfolioCompanies: p.portfolioCompanies || [],
            angelListProfile: p.angelListProfile || '',
            linkedInVerified: !!p.linkedInVerified,
            linkedInProfileUrl: p.linkedInProfileUrl || ''
          };
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading investor profile:', err);
        }
      });
    }
  }

  isIndustrySelected(industry: string): boolean {
    return this.model.preferredIndustries?.some(i => i.toLowerCase() === industry.toLowerCase()) || false;
  }

  toggleIndustry(industry: string) {
    if (!this.model.preferredIndustries) {
      this.model.preferredIndustries = [];
    }
    if (this.isIndustrySelected(industry)) {
      this.model.preferredIndustries = this.model.preferredIndustries.filter(i => i !== industry);
    } else {
      this.model.preferredIndustries.push(industry);
    }
  }

  isStageSelected(stage: string): boolean {
    return this.model.preferredStages?.includes(stage) || false;
  }

  toggleStage(stage: string) {
    if (!this.model.preferredStages) {
      this.model.preferredStages = [];
    }
    if (this.isStageSelected(stage)) {
      this.model.preferredStages = this.model.preferredStages.filter(s => s !== stage);
    } else {
      this.model.preferredStages.push(stage);
    }
  }

  save(form: any) {
    if (form.invalid) {
      this.toastService.warning('Please fill in all required fields correctly.');
      return;
    }
    
    // Fill in default values for required backed fields missing from UI
    this.model.investmentStage = this.model.investmentStage || 'Any';
    this.model.ticketSizeRange = this.model.ticketSizeRange || this.model.preferredFundingRange || 'Any';
    this.model.location = this.model.location || this.model.preferredLocation || 'Any';
    this.model.preferredTeamSize = this.model.preferredTeamSize || 'Any';

    this.profileService.upsertInvestorProfile(this.model).subscribe({
      next: () => this.toastService.success('Preferences updated successfully!'),
      error: (err: any) => {
        console.error('Error saving investor profile:', err);
        let errorMsg = 'Failed to update preferences. Status: ' + (err.status || 'Unknown');
        if (err.status === 400 && err.error?.errors) {
            errorMsg = Object.values<{[_: string]: string[]}>(err.error.errors).flat().join(' ');
        } else if (err.status === 400 && typeof err.error === 'string') {
            errorMsg = err.error;
        }
        this.toastService.error(errorMsg);
      }
    });
  }
}
