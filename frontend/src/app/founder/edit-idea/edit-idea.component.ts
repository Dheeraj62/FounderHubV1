import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IdeaService } from '../../core/services/idea.service';
import { VersionService } from '../../core/services/version.service';
import { Idea } from '../../core/models/idea.models';

@Component({
  selector: 'app-edit-idea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <!-- Template is mostly identical to Create except for titles -->
    <div class="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Your Idea</h1>
          <p class="mt-2 text-sm text-gray-500">Update your startup vision constraints have changed.</p>
        </div>
        <a routerLink="/founder/dashboard" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to Dashboard
        </a>
      </div>

      <div *ngIf="isFetching" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="!isFetching" class="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div class="p-8">
          <form [formGroup]="ideaForm" (ngSubmit)="onSubmit()" class="space-y-8">
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-6">
                <label for="title" class="block text-sm font-semibold text-gray-700">Project Title</label>
                <div class="mt-1">
                  <input type="text" formControlName="title" id="title" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50">
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

            <div class="grid grid-cols-1 gap-y-6 gap-x-4">
              <div>
                <label for="problem" class="block text-sm font-semibold text-gray-700">The Problem</label>
                <div class="mt-1">
                  <textarea id="problem" formControlName="problem" rows="3" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg bg-gray-50"></textarea>
                </div>
              </div>

              <div>
                <label for="solution" class="block text-sm font-semibold text-gray-700">The Solution</label>
                <div class="mt-1">
                  <textarea id="solution" formControlName="solution" rows="4" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg bg-gray-50"></textarea>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="fundingRange" class="block text-sm font-semibold text-gray-700">Target Funding Range</label>
                <div class="mt-1">
                  <input type="text" formControlName="fundingRange" id="fundingRange" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50">
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="location" class="block text-sm font-semibold text-gray-700">Primary Location</label>
                <div class="mt-1">
                  <input type="text" formControlName="location" id="location" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50">
                </div>
              </div>

              <div class="sm:col-span-6">
                <h3 class="text-sm font-bold text-gray-900 mt-4">Pitch Deck & Demo</h3>
                <p class="text-xs text-gray-500 mt-1">Optional links help investors evaluate faster.</p>
              </div>

              <div class="sm:col-span-2">
                <label for="pitchDeckUrl" class="block text-sm font-semibold text-gray-700">Pitch Deck URL</label>
                <div class="mt-1">
                  <input type="url" formControlName="pitchDeckUrl" id="pitchDeckUrl" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50">
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="demoUrl" class="block text-sm font-semibold text-gray-700">Demo URL</label>
                <div class="mt-1">
                  <input type="url" formControlName="demoUrl" id="demoUrl" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50">
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="startupWebsite" class="block text-sm font-semibold text-gray-700">Startup Website</label>
                <div class="mt-1">
                  <input type="url" formControlName="startupWebsite" id="startupWebsite" class="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50">
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div class="relative flex items-start">
                <div class="flex items-center h-5">
                  <input id="previouslyRejected" formControlName="previouslyRejected" type="checkbox" class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded">
                </div>
                <div class="ml-3 text-sm">
                  <label for="previouslyRejected" class="font-bold text-gray-700">Have you pitched this before and been rejected?</label>
                </div>
              </div>
              
              <div *ngIf="ideaForm.get('previouslyRejected')?.value" class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label for="rejectedBy" class="block text-sm font-medium text-gray-700">Rejected By</label>
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
                  <label for="whatChangedAfterRejection" class="block text-sm font-medium text-gray-700">What changed since then?</label>
                  <div class="mt-1">
                    <textarea id="whatChangedAfterRejection" formControlName="whatChangedAfterRejection" rows="2" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Idea Evolution / Pivot Tracking -->
            <div class="mt-12 p-8 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <div class="flex items-center gap-3 mb-6">
                <span class="text-2xl">🚀</span>
                <h3 class="text-xl font-bold text-gray-900">Signal a Pivot</h3>
              </div>
              <p class="text-sm text-gray-500 mb-8 leading-relaxed">
                Noticeable shifts in your model? Creating a pivot version notifies interested investors and preserves your evolution history.
              </p>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">What changed in this evolution?</label>
                  <input type="text" #whatChanged class="px-4 py-3 block w-full sm:text-sm border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" placeholder="e.g. Shifted focus from B2C to B2B enterprise SaaS">
                </div>
                <div class="flex justify-end">
                  <button type="button" 
                          (click)="onPivot(whatChanged.value)"
                          [disabled]="!whatChanged.value"
                          class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition">
                    Create Pivot Version
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="errorMessage" class="text-red-600 text-sm font-medium">
              {{ errorMessage }}
            </div>

            <div class="pt-5 border-t border-gray-200">
              <div class="flex justify-end">
                <button type="button" routerLink="/founder/dashboard" class="bg-white py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" [disabled]="ideaForm.invalid || isLoading" class="ml-3 inline-flex justify-center py-2.5 px-8 border border-transparent shadow-md text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition">
                  <span *ngIf="isLoading">Saving...</span>
                  <span *ngIf="!isLoading">Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
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
