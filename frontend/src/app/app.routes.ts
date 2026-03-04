import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './founder/dashboard/dashboard.component';
import { CreateIdeaComponent } from './founder/create-idea/create-idea.component';
import { EditIdeaComponent } from './founder/edit-idea/edit-idea.component';
import { BrowseIdeasComponent } from './investor/browse-ideas/browse-ideas.component';
import { FounderProfileComponent } from './founder/profile/profile.component';
import { InvestorProfileComponent } from './investor/profile/profile.component';
import { IdeaDetailComponent } from './shared/components/idea-detail/idea-detail.component';
import { RecommendationsComponent } from './investor/recommendations/recommendations.component';
import { ConnectionsListComponent } from './shared/components/connections-list/connections-list.component';
import { MessageThreadComponent } from './shared/components/message-thread/message-thread.component';
import { NotificationsPanelComponent } from './shared/components/notifications-panel/notifications-panel.component';
import { SavedIdeasComponent } from './investor/saved-ideas/saved-ideas.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent, pathMatch: 'full' },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },

    // UNIVERSAL ROUTES (Both Roles)
    { path: 'idea/:id', component: IdeaDetailComponent, canActivate: [authGuard] },
    { path: 'connections', component: ConnectionsListComponent, canActivate: [authGuard] },
    { path: 'messages/:id', component: MessageThreadComponent, canActivate: [authGuard] },
    { path: 'notifications', component: NotificationsPanelComponent, canActivate: [authGuard] },

    // Founder Routes
    {
        path: 'founder/dashboard',
        component: DashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Founder' }
    },
    {
        path: 'founder/create-idea',
        component: CreateIdeaComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Founder' }
    },
    {
        path: 'founder/edit-idea/:id',
        component: EditIdeaComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Founder' }
    },
    {
        path: 'founder/profile',
        component: FounderProfileComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Founder' }
    },

    // Investor Routes
    {
        path: 'investor/browse',
        component: BrowseIdeasComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Investor' }
    },
    {
        path: 'investor/recommendations',
        component: RecommendationsComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Investor' }
    },
    {
        path: 'investor/saved-ideas',
        component: SavedIdeasComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Investor' }
    },
    {
        path: 'investor/profile',
        component: InvestorProfileComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'Investor' }
    },

    // Fallback
    { path: '**', redirectTo: '' }
];
