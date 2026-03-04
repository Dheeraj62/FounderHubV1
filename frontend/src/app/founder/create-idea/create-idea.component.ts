import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';

@Component({
  selector: 'app-create-idea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Post a New Idea</h1>
          <p class="mt-2 text-sm text-gray-500">Share your startup vision and attract investors.</p>
        </div>
        <a routerLink="/founder/dashboard" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to Dashboard
        </a>
      </div>

      <div class="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div class="p-8">
          <form [formGroup]="ideaForm" (ngSubmit)="onSubmit()" class="space-y-8">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-6">
                <label for="title" class="block text-sm font-semibold text-gray-700">Project Title</label>
                <div class="mt-1">
                  <input type="text" formControlName="title" id="title" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50" placeholder="e.g. NextGen AI CRM">
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="industry" class="block text-sm font-semibold text-gray-700">Industry</label>
                <div class="mt-1">
                  <select id="industry" formControlName="industry" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50">
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
              </div>

              <div class="sm:col-span-3">
                <label for="stage" class="block text-sm font-semibold text-gray-700">Current Stage</label>
                <div class="mt-1">
                  <select id="stage" formControlName="stage" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50">
                    <option value="">Select a stage</option>
                    <option value="Idea">Idea Only</option>
                    <option value="MVP">MVP Built</option>
                    <option value="EarlyRevenue">Early Revenue</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Core Pitch -->
            <div class="grid grid-cols-1 gap-y-6 gap-x-4">
              <div>
                <label for="problem" class="block text-sm font-semibold text-gray-700">The Problem <span class="text-xs text-gray-400 font-normal">(What are you solving?)</span></label>
                <div class="mt-1">
                  <textarea id="problem" formControlName="problem" rows="3" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg bg-gray-50"></textarea>
                </div>
              </div>

              <div>
                <label for="solution" class="block text-sm font-semibold text-gray-700">The Solution <span class="text-xs text-gray-400 font-normal">(How are you escaping the competition?)</span></label>
                <div class="mt-1">
                  <textarea id="solution" formControlName="solution" rows="4" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg bg-gray-50"></textarea>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="fundingRange" class="block text-sm font-semibold text-gray-700">Target Funding Range</label>
                <div class="mt-1">
                  <input type="text" formControlName="fundingRange" id="fundingRange" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50" placeholder="e.g. $100k - $250k">
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="location" class="block text-sm font-semibold text-gray-700">Primary Location</label>
                <div class="mt-1">
                  <input type="text" formControlName="location" id="location" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50" placeholder="e.g. San Francisco, CA">
                </div>
              </div>
            </div>

            <!-- Rejection Data -->
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div class="relative flex items-start">
                <div class="flex items-center h-5">
                  <input id="previouslyRejected" formControlName="previouslyRejected" type="checkbox" class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded">
                </div>
                <div class="ml-3 text-sm">
                  <label for="previouslyRejected" class="font-bold text-gray-700">Have you pitched this before and been rejected?</label>
                  <p class="text-gray-500">We encourage transparency. Sharing learnings from rejections shows coachability.</p>
                </div>
              </div>
              
              <div *ngIf="ideaForm.get('previouslyRejected')?.value" class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label for="rejectedBy" class="block text-sm font-medium text-gray-700">Rejected By <span class="text-xs text-gray-400 font-normal">(Optional)</span></label>
                  <div class="mt-1">
                    <input type="text" formControlName="rejectedBy" id="rejectedBy" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  </div>
                </div>
                <div>
                  <label for="rejectionReasonCategory" class="block text-sm font-medium text-gray-700">Core Reason for Rejection</label>
                  <div class="mt-1">
                    <select id="rejectionReasonCategory" formControlName="rejectionReasonCategory" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      <option value="">Select a reason</option>
                      <option value="Market Size">Market Size Too Small</option>
                      <option value="Too Early">Too Early / Lack of Traction</option>
                      <option value="Team">Team Composition</option>
                      <option value="Competition">Too Much Competition</option>
                      <option value="Unit Economics">Poor Unit Economics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label for="whatChangedAfterRejection" class="block text-sm font-medium text-gray-700">What changed since then? Keep it brief.</label>
                  <div class="mt-1">
                    <textarea id="whatChangedAfterRejection" formControlName="whatChangedAfterRejection" rows="2" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="errorMessage" class="text-red-600 text-sm font-medium">
              {{ errorMessage }}
            </div>

            <div class="pt-5 border-t border-gray-200">
              <div class="flex justify-end">
                <button type="button" routerLink="/founder/dashboard" class="bg-white py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="ideaForm.invalid || isLoading" class="ml-3 inline-flex justify-center py-2.5 px-8 border border-transparent shadow-md text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition transform hover:-translate-y-0.5">
                  <span *ngIf="isLoading">Publishing...</span>
                  <span *ngIf="!isLoading">Publish Idea</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
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
