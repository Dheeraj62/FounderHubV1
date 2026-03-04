import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConnectionService } from '../../../core/services/connection.service';
import { AuthService } from '../../../core/services/auth.service';
import { Connection } from '../../../core/models/connection.models';

@Component({
  selector: 'app-connections-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto py-12 px-4">
      <h1 class="text-4xl font-black text-white mb-2 flex items-center tracking-tight">
        <span class="mr-3">🤝</span> My Network
      </h1>
      <p class="text-gray-500 mb-10 font-bold uppercase tracking-widest text-xs">Manage your ecosystem relationships</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" *ngIf="connections.length > 0">
        <div *ngFor="let conn of connections" 
             class="bg-gray-900 border border-gray-800 rounded-3xl p-6 transition-all hover:bg-gray-800/10 flex items-center justify-between group">
          
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center text-xl font-bold text-indigo-400 border border-gray-700">
              {{ getDisplayName(conn).charAt(0) }}
            </div>
            <div>
              <h3 class="text-white font-bold text-lg mb-1">{{ getDisplayName(conn) }}</h3>
              <span [class]="getStatusClass(conn.status)" 
                    class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-current">
                {{ conn.status }}
              </span>
            </div>
          </div>

          <div class="flex gap-3">
            <!-- Pending Actions (Founder only) -->
            <ng-container *ngIf="conn.status === 'Pending' && isFounder">
              <button (click)="accept(conn.id)" class="bg-emerald-500 hover:bg-emerald-400 text-white p-2 rounded-xl transition-all">
                ✓
              </button>
              <button (click)="reject(conn.id)" class="bg-rose-500 hover:bg-rose-400 text-white p-2 rounded-xl transition-all">
                ✕
              </button>
            </ng-container>

            <!-- Accepted Actions -->
            <button *ngIf="conn.status === 'Accepted'" 
                    [routerLink]="['/messages', conn.id]"
                    class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/10">
              Message
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="connections.length === 0" class="text-center py-24 bg-gray-900/30 rounded-3xl border border-gray-800">
        <p class="text-gray-500">You haven't established any connections yet.</p>
      </div>
    </div>
  `,
  styles: []
})
export class ConnectionsListComponent implements OnInit {
  connections: Connection[] = [];
  isFounder = false;

  constructor(
    private connectionService: ConnectionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isFounder = this.authService.getUserRole() === 'Founder';
    this.loadConnections();
  }

  loadConnections() {
    this.connectionService.getMyConnections().subscribe(list => {
      this.connections = list;
      this.cdr.markForCheck();
    });
  }

  getDisplayName(conn: Connection): string {
    // In a real app, you'd fetch user names. For now, we use IDs or placeholders.
    return this.isFounder ? 'Investor Partner' : 'Founder Entrepreneur';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted': return 'text-emerald-400 bg-emerald-500/5';
      case 'Pending': return 'text-amber-400 bg-amber-500/5';
      case 'Rejected': return 'text-rose-400 bg-rose-500/5';
      default: return 'text-gray-400 bg-gray-500/5';
    }
  }

  accept(id: string) {
    this.connectionService.acceptRequest(id).subscribe(() => this.loadConnections());
  }

  reject(id: string) {
    this.connectionService.rejectRequest(id).subscribe(() => this.loadConnections());
  }
}
