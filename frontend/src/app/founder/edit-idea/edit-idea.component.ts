import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { VersionService } from '../../core/services/version.service';
import { Idea } from '../../core/models/idea.models';
import { InputComponent } from '../../shared/ui/input/input.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-edit-idea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, CardComponent],
  template: `
    <div class="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-neutral-900 tracking-tight">Edit Your Idea</h1>
          <p class="mt-2 text-sm text-neutral-500 font-medium">Update your startup vision if constraints have changed.</p>
        </div>
        <app-button variant="ghost" size="sm" routerLink="/founder/dashboard">
          &larr; Back to Dashboard
        </app-button>
      </div>

      <div *ngIf="isFetching" class="flex justify-center py-20">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>

      <app-card *ngIf="!isFetching" [noPadding]="true" class="shadow-sm border-neutral-200">
        <div class="p-8 sm:p-10">
          <form [formGroup]="ideaForm" (ngSubmit)="onSubmit()" class="space-y-10">
            <!-- Basic Info -->
            <div>
              <h3 class="text-base font-bold text-neutral-900 mb-5 border-b border-neutral-100 pb-2">Basic Information</h3>
              <div class="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
                <div class="sm:col-span-6">
                  <app-input
                    id="title"
                    formControlName="title"
                    label="Project Title"
                    placeholder="e.g. NextGen AI CRM">
                  </app-input>
                </div>

                <div class="sm:col-span-3">
                  <label for="industry" class="block text-sm font-bold text-neutral-900 mb-1.5">Industry</label>
                  <select id="industry" formControlName="industry" class="block w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 h-[46px]">
                    <option value="">Select an industry</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Healthtech">Healthtech</option>
                    <option value="Edtech">Edtech</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Web3">Web3</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div class="sm:col-span-3">
                  <label for="stage" class="block text-sm font-bold text-neutral-900 mb-1.5">Current Stage</label>
                  <select id="stage" formControlName="stage" class="block w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 h-[46px]">
                    <option value="">Select a stage</option>
                    <option value="Idea">Idea Only</option>
                    <option value="MVP">MVP Built</option>
                    <option value="EarlyRevenue">Early Revenue</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Core Pitch -->
            <div>
              <h3 class="text-base font-bold text-neutral-900 mb-5 border-b border-neutral-100 pb-2">Core Pitch</h3>
              <div class="grid grid-cols-1 gap-y-6 gap-x-6">
                <div>
                  <label for="problem" class="block text-sm font-bold text-neutral-900 mb-1.5">The Problem <span class="text-xs text-neutral-400 font-normal ml-1">What are you solving?</span></label>
                  <textarea id="problem" formControlName="problem" rows="3" class="block w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 resize-y"></textarea>
                </div>

                <div>
                  <label for="solution" class="block text-sm font-bold text-neutral-900 mb-1.5">The Solution <span class="text-xs text-neutral-400 font-normal ml-1">How are you escaping the competition?</span></label>
                  <textarea id="solution" formControlName="solution" rows="4" class="block w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 resize-y"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <app-input
                    id="fundingRange"
                    formControlName="fundingRange"
                    label="Target Funding Range"
                    placeholder="e.g. $100k - $250k">
                  </app-input>

                  <app-input
                    id="location"
                    formControlName="location"
                    label="Primary Location"
                    placeholder="e.g. San Francisco, CA">
                  </app-input>
                </div>
              </div>
            </div>

            <!-- Links -->
            <div>
              <div class="flex items-center gap-2 mb-5 border-b border-neutral-100 pb-2">
                <h3 class="text-base font-bold text-neutral-900">Links & Resources</h3>
                <span class="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">Optional</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <app-input
                  id="pitchDeckUrl"
                  type="url"
                  formControlName="pitchDeckUrl"
                  label="Pitch Deck URL"
                  placeholder="https://...">
                </app-input>

                <app-input
                  id="demoUrl"
                  type="url"
                  formControlName="demoUrl"
                  label="Demo URL"
                  placeholder="https://...">
                </app-input>

                <div class="sm:col-span-2">
                  <app-input
                    id="startupWebsite"
                    type="url"
                    formControlName="startupWebsite"
                    label="Startup Website"
                    placeholder="https://...">
                  </app-input>
                </div>
              </div>
            </div>

            <!-- Pitch Details -->
            <div>
              <div class="flex items-center gap-2 mb-5 border-b border-neutral-100 pb-2">
                <h3 class="text-base font-bold text-neutral-900">Advanced Pitch Details</h3>
                <span class="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">Pitch Room Data</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <app-input
                  id="targetCustomers"
                  formControlName="targetCustomers"
                  label="Target Customers"
                  placeholder="e.g. Enterprise B2B SaaS Companies">
                </app-input>

                <app-input
                  id="marketSize"
                  formControlName="marketSize"
                  label="Total Addressable Market (TAM)"
                  placeholder="e.g. $5B globally">
                </app-input>

                <div class="sm:col-span-2">
                  <label for="tractionMetrics" class="block text-sm font-bold text-neutral-900 mb-1.5">Traction & Metrics <span class="text-xs text-neutral-400 font-normal ml-1">Current MRR, DAUs, waitlist size, etc.</span></label>
                  <textarea id="tractionMetrics" formControlName="tractionMetrics" rows="3" class="block w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-200 resize-y"></textarea>
                </div>
              </div>
            </div>

            <!-- Rejection Data -->
            <div class="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/50">
              <div class="relative flex items-start">
                <div class="flex items-center h-6">
                  <input id="previouslyRejected" formControlName="previouslyRejected" type="checkbox" class="w-5 h-5 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500 focus:ring-2 transition-colors cursor-pointer">
                </div>
                <div class="ml-3 text-sm">
                  <label for="previouslyRejected" class="font-bold text-amber-900 cursor-pointer">Have you pitched this before and been rejected?</label>
                  <p class="text-amber-700/80 mt-1 font-medium">We encourage transparency. Sharing learnings from rejections shows coachability.</p>
                </div>
              </div>
              
              <div *ngIf="ideaForm.get('previouslyRejected')?.value" class="mt-6 pt-6 border-t border-amber-200/50 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                <app-input
                  id="rejectedBy"
                  formControlName="rejectedBy"
                  label="Rejected By (Optional)">
                </app-input>

                <div>
                  <label for="rejectionReasonCategory" class="block text-sm font-bold text-amber-900 mb-1.5">Core Reason for Rejection</label>
                  <select id="rejectionReasonCategory" formControlName="rejectionReasonCategory" class="block w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-200 h-[46px]">
                    <option value="">Select a reason</option>
                    <option value="Market Size">Market Size Too Small</option>
                    <option value="Too Early">Too Early / Lack of Traction</option>
                    <option value="Team">Team Composition</option>
                    <option value="Competition">Too Much Competition</option>
                    <option value="Unit Economics">Poor Unit Economics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div class="sm:col-span-2">
                  <label for="whatChangedAfterRejection" class="block text-sm font-bold text-amber-900 mb-1.5">What changed since then? Keep it brief.</label>
                  <textarea id="whatChangedAfterRejection" formControlName="whatChangedAfterRejection" rows="2" class="block w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-200 resize-y"></textarea>
                </div>
              </div>
            </div>

            <!-- Idea Evolution / Pivot Tracking -->
            <div class="mt-12 p-8 bg-indigo-50 border border-indigo-100/50 rounded-2xl relative overflow-hidden">
              <!-- Grid background pattern -->
              <div class="absolute inset-0 pattern-grid-indigo-500/[0.05] pattern-[length:24px_24px] z-0"></div>

              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-white rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center text-xl">🚀</div>
                  <h3 class="text-xl font-black tracking-tight text-indigo-950">Signal a Pivot</h3>
                </div>
                <p class="text-sm text-indigo-800/80 mb-6 font-medium max-w-2xl">
                  Noticeable shifts in your model? Creating a pivot version notifies interested investors and preserves your evolution history.
                </p>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-bold text-indigo-900 mb-2">What changed in this evolution?</label>
                    <input type="text" #whatChanged class="block w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm text-neutral-900 placeholder:text-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200" placeholder="e.g. Shifted focus from B2C to B2B enterprise SaaS">
                  </div>
                  <div class="flex justify-start pt-2">
                    <app-button type="button" 
                            (onClick)="onPivot(whatChanged.value)"
                            [disabled]="!whatChanged.value"
                            variant="primary"
                            class="!bg-indigo-600 hover:!bg-indigo-700 hover:shadow-indigo-500/20">
                      Create Pivot Version
                    </app-button>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="errorMessage" class="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
              <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-rose-800">{{ errorMessage }}</p>
            </div>

            <div class="pt-6 border-t border-neutral-100 mt-8">
              <div class="flex justify-end gap-3">
                <app-button type="button" variant="secondary" routerLink="/founder/dashboard">
                  Cancel
                </app-button>
                <app-button type="submit" variant="primary" [loading]="isLoading" [disabled]="ideaForm.invalid">
                  Save Changes
                </app-button>
              </div>
            </div>
          </form>
        </div>
      </app-card>
    </div>
  `
})
export class EditIdeaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ideaService = inject(IdeaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private versionService = inject(VersionService);
  private cdr = inject(ChangeDetectorRef);

  ideaForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    problem: ['', Validators.required],
    solution: ['', Validators.required],
    stage: ['', Validators.required],
    industry: ['', Validators.required],
    fundingRange: [''],
    location: [''],
    pitchDeckUrl: [''],
    demoUrl: [''],
    startupWebsite: [''],
    targetCustomers: [''],
    marketSize: [''],
    tractionMetrics: [''],
    previouslyRejected: [false],
    rejectedBy: [''],
    rejectionReasonCategory: [''],
    whatChangedAfterRejection: ['']
  });

  ideaId = '';
  isFetching = true;
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.ideaId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.ideaId) {
      this.router.navigate(['/founder/dashboard']);
      return;
    }

    // Usually there's a getIdeaById API, let's load from memory or fetch from backend API. 
    // Oh, I created GetMyIdeas. I need GetIdeaById for Founder? Actually I created it in IIdeaService. Wait, did I expose an endpoint? 
    // Let's just fetch MyIdeas and find the correct one.
    this.ideaService.getIdeaById(this.ideaId).subscribe({
      next: (idea) => {
        this.ideaForm.patchValue(idea);
        this.isFetching = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load idea.';
        this.isFetching = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit() {
    if (this.ideaForm.invalid) return;

    this.isLoading = true;
    this.ideaService.updateIdea(this.ideaId, this.ideaForm.value).subscribe({
      next: () => {
        this.router.navigate(['/founder/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update idea.';
      }
    });
  }

  onPivot(whatChanged: string) {
    if (!whatChanged) return;

    const request = {
      problem: this.ideaForm.value.problem,
      solution: this.ideaForm.value.solution,
      whatChanged: whatChanged
    };

    this.isLoading = true;
    this.versionService.createVersion(this.ideaId, request).subscribe({
      next: () => {
        alert('Pivot version created successfully!');
        this.router.navigate(['/founder/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Failed to create pivot version.');
      }
    });
  }
}
