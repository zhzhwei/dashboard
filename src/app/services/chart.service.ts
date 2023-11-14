import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public chartType = new BehaviorSubject<string>('');
    currentChartType = this.chartType.asObservable();
    
    public dataSourceSubject = new BehaviorSubject<any[]>([]);
    currentDataSource = this.dataSourceSubject.asObservable();

    constructor() { }
}
