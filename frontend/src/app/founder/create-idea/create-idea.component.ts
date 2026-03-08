import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { InputComponent } from '../../shared/ui/input/input.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-create-idea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, CardComponent],
  template: `
    <div class="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-neutral-900 tracking-tight">Post a New Idea</h1>
          <p class="mt-2 text-sm text-neutral-500 font-medium">Share your startup vision and attract investors.</p>
        </div>
        <app-button variant="ghost" size="sm" routerLink="/founder/dashboard">
          &larr; Back to Dashboard
        </app-button>
      </div>

      <app-card [noPadding]="true" class="shadow-sm border-neutral-200">
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
                  Publish Idea
                </app-button>
              </div>
            </div>
          </form>
        </div>
      </app-card>
    </div>
  `
})
export class CreateIdeaComponent {
  private fb = inject(FormBuilder);
  private ideaService = inject(IdeaService);
  private router = inject(Router);
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

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.ideaForm.invalid) {
      this.ideaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.ideaService.createIdea(this.ideaForm.value).subscribe({
      next: () => {
        this.router.navigate(['/founder/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create idea.';
        this.cdr.markForCheck();
      }
    });
  }
}
