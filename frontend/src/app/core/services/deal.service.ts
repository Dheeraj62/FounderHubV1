import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Deal, CreateDealRequest, UpdateDealRequest } from '../models/deal.models';

@Injectable({
    providedIn: 'root'
})
export class DealService {
    private apiUrl = `${environment.apiUrl}/Deals`;

    constructor(private http: HttpClient) { }

    getDeals(): Observable<Deal[]> {
        return this.http.get<Deal[]>(this.apiUrl);
    }

    createDeal(request: CreateDealRequest): Observable<Deal> {
        return this.http.post<Deal>(this.apiUrl, request);
    }

    updateDeal(id: string, request: UpdateDealRequest): Observable<Deal> {
        return this.http.put<Deal>(`${this.apiUrl}/${id}`, request);
    }

    deleteDeal(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
