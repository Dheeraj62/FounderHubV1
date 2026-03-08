import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RequestMeetingDto {
    founderId: string;
    ideaId?: string;
    scheduledAt: string; // ISO date string
    platform: string;
    meetingLink?: string;
    notes?: string;
}

export interface UpdateMeetingStatusDto {
    status: 'Confirmed' | 'Declined' | 'Completed';
}

export interface MeetingDto {
    id: string;
    requestedByInvestorId: string;
    investorName: string;
    founderId: string;
    founderName: string;
    ideaId?: string;
    ideaTitle?: string;
    scheduledAt: string;
    platform: string;
    meetingLink?: string;
    notes?: string;
    status: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class MeetingService {
    private apiUrl = `${environment.apiUrl}/Meetings`;

    constructor(private http: HttpClient) { }

    getMyMeetings(): Observable<MeetingDto[]> {
        return this.http.get<MeetingDto[]>(`${this.apiUrl}/my`);
    }

    requestMeeting(dto: RequestMeetingDto): Observable<MeetingDto> {
        return this.http.post<MeetingDto>(this.apiUrl, dto);
    }

    updateStatus(meetingId: string, dto: UpdateMeetingStatusDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/${meetingId}/status`, dto);
    }
}
