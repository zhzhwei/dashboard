import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public sourceChartType = new BehaviorSubject<string>('');

    currentChartType = this.sourceChartType.asObservable();
    
    constructor() { }
}
