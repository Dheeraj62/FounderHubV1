import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { UpsertInvestorProfileRequest } from '../../core/models/profile.models';

@Component({
  selector: 'app-investor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto py-10 px-4">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
          <h1 class="text-3xl font-bold text-white uppercase tracking-widest">Investor Preferences</h1>
          <p class="text-emerald-100 mt-2">Adjust your criteria to receive higher quality matches.</p>
        </div>

        <form (ngSubmit)="save()" class="p-8 space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Investment Thesis -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-emerald-400 border-b border-gray-800 pb-3 flex items-center">
                <span class="mr-2">🎯</span> Focus
              </h3>
              
              <div>
                <label class="block text-sm font-semibold text-gray-500 mb-2">Preferred Industries</label>
                <div class="grid grid-cols-2 gap-3">
                  <div *ngFor="let industry of industries" class="flex items-center">
                    <input type="checkbox" [id]="industry" [checked]="isIndustrySelected(industry)"
                           (change)="toggleIndustry(industry)"
                           class="w-4 h-4 rounded border-gray-700 bg-gray-800 text-emerald-600">
                    <label [for]="industry" class="ml-2 text-sm text-gray-300">{{ industry }}</label>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-500 mb-2">Investment Stage</label>
                <select [(ngModel)]="model.investmentStage" name="stage"
                        class="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 transition-all">
                  <option value="Idea">Idea Stage</option>
                  <option value="MVP">MVP / Prototype</option>
                  <option value="Early-Traction">Early Traction</option>
                  <option value="Growth">Growth</option>
                </select>
              </div>
            </div>

            <!-- Parameters -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-emerald-400 border-b border-gray-800 pb-3 flex items-center">
                <span class="mr-2">⚖️</span> Scope
              </h3>

              <div>
                <label class="block text-sm font-semibold text-gray-500 mb-2">Typical Ticket Size</label>
                <input type="text" [(ngModel)]="model.ticketSizeRange" name="ticket" placeholder="$50k - $250k"
                       class="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 transition-all">
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-500 mb-2">Target Location</label>
                <input type="text" [(ngModel)]="model.location" name="loc" placeholder="San Francisco, Berlin, etc."
                       class="w-full bg-gray-800 border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 transition-all">
              </div>
              
              <div class="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mt-4">
                <p class="text-[10px] text-emerald-300/60 leading-relaxed uppercase tracking-widest text-center">
                  Matches are dynamically calculated using industry focus, stage alignment, and location proximity.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-xl font-bold text-emerald-400 flex items-center">
              <span class="mr-2">✍️</span> Investor Bio
            </h3>
            <textarea [(ngModel)]="model.bio" name="bio" rows="4" placeholder="Briefly describe your investment philosophy..."
                      class="w-full bg-gray-800 border-gray-700 rounded-xl p-4 text-white resize-none"></textarea>
          </div>

          <div class="flex justify-center">
            <button type="submit" 
                    class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-16 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02]">
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
  model: UpsertInvestorProfileRequest = {
    preferredIndustries: [],
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

  save() {
    this.profileService.upsertInvestorProfile(this.model).subscribe({
      next: () => alert('Preferences updated successfully!'),
      error: (err) => {
        console.error('Error saving investor profile:', err);
        alert('Failed to update preferences. Status: ' + (err.status || 'Unknown'));
      }
    });
  }
}
