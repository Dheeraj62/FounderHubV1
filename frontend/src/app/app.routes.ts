import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
    // PUBLIC ROUTES
    { path: '', component: LandingComponent, pathMatch: 'full' },
    {
        path: 'auth/login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'auth/register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
    },

    // AUTHENTICATED DASHBOARD ROUTES
    {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'feed',
                loadComponent: () => import('./feed/feed-page/feed-page.component').then(m => m.FeedPageComponent)
            },
            {
                path: 'idea/:id',
                loadComponent: () => import('./shared/components/idea-detail/idea-detail.component').then(m => m.IdeaDetailComponent)
            },
            {
                path: 'connections',
                loadComponent: () => import('./shared/components/connections-list/connections-list.component').then(m => m.ConnectionsListComponent)
            },
            {
                path: 'messages/:id',
                loadComponent: () => import('./shared/components/message-thread/message-thread.component').then(m => m.MessageThreadComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./shared/components/notifications-panel/notifications-panel.component').then(m => m.NotificationsPanelComponent)
            },

            // Founder specific
            {
                path: 'founder/dashboard',
                loadComponent: () => import('./founder/dashboard/dashboard.component').then(m => m.DashboardComponent),
                canActivate: [roleGuard],
                data: { role: 'Founder' }
            },
            {
                path: 'founder/create-idea',
                loadComponent: () => import('./founder/create-idea/create-idea.component').then(m => m.CreateIdeaComponent),
                canActivate: [roleGuard],
                data: { role: 'Founder' }
            },
            {
                path: 'founder/edit-idea/:id',
                loadComponent: () => import('./founder/edit-idea/edit-idea.component').then(m => m.EditIdeaComponent),
                canActivate: [roleGuard],
                data: { role: 'Founder' }
            },
            {
                path: 'founder/profile',
                loadComponent: () => import('./founder/profile/profile.component').then(m => m.FounderProfileComponent),
                canActivate: [roleGuard],
                data: { role: 'Founder' }
            },
            {
                path: 'founder/analytics',
                loadComponent: () => import('./founder/analytics/analytics.component').then(m => m.AnalyticsComponent),
                canActivate: [roleGuard],
                data: { role: 'Founder' }
            },
            {
                path: 'founder/updates',
                loadComponent: () => import('./founder/updates/updates.component').then(m => m.UpdatesComponent),
                canActivate: [roleGuard],
                data: { role: 'Founder' }
            },
            {
                path: 'meetings',
                loadComponent: () => import('./shared/meetings/meetings.component').then(m => m.MeetingsComponent),
                canActivate: [authGuard]
            },

            // Investor specific
            {
                path: 'investor/browse',
                loadComponent: () => import('./investor/browse-ideas/browse-ideas.component').then(m => m.BrowseIdeasComponent),
                canActivate: [roleGuard],
                data: { role: 'Investor' }
            },
            {
                path: 'investor/watchlist',
                loadComponent: () => import('./investor/watchlist/watchlist.component').then(m => m.WatchlistComponent),
                canActivate: [roleGuard],
                data: { role: 'Investor' }
            },
            {
                path: 'investor/pipeline',
                loadComponent: () => import('./investor/deal-pipeline/deal-pipeline.component').then(m => m.DealPipelineComponent),
                canActivate: [roleGuard],
                data: { role: 'Investor' }
            },
            {
                path: 'investor/recommendations',
                loadComponent: () => import('./investor/recommendations/recommendations.component').then(m => m.RecommendationsComponent),
                canActivate: [roleGuard],
                data: { role: 'Investor' }
            },
            {
                path: 'investor/saved-ideas',
                loadComponent: () => import('./investor/saved-ideas/saved-ideas.component').then(m => m.SavedIdeasComponent),
                canActivate: [roleGuard],
                data: { role: 'Investor' }
            },
            {
                path: 'investor/profile',
                loadComponent: () => import('./investor/profile/profile.component').then(m => m.InvestorProfileComponent),
                canActivate: [roleGuard],
                data: { role: 'Investor' }
            }
        ]
    },

    // Fallback
    { path: '**', redirectTo: '' }
];
