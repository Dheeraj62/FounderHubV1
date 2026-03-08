import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SubmitFeedbackRequest {
    ideaId: string;
    overallRating: number;
    marketPotentialScore: number;
    teamScore: number;
    tractionScore: number;
    uniqueValueScore: number;
    comments?: string;
    strengths?: string;
    improvements?: string;
}

export interface FeedbackDto {
    id: string;
    ideaId: string;
    investorId: string;
    investorName: string;
    overallRating: number;
    marketPotentialScore: number;
    teamScore: number;
    tractionScore: number;
    uniqueValueScore: number;
    comments?: string;
    strengths?: string;
    improvements?: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private apiUrl = `${environment.apiUrl}/Feedback`;

    constructor(private http: HttpClient) { }

    submitFeedback(request: SubmitFeedbackRequest): Observable<any> {
        return this.http.post(this.apiUrl, request);
    }

    getFeedbackForIdea(ideaId: string): Observable<FeedbackDto[]> {
        return this.http.get<FeedbackDto[]>(`${this.apiUrl}/${ideaId}`);
    }
}
