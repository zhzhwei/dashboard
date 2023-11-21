import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    public chartType = new BehaviorSubject<string>('');
    currentChartType = this.chartType.asObservable();
    
    public titleCount = new BehaviorSubject<number>(0);
    currentTitleCount = this.titleCount.asObservable();
    
    public dataSource = new BehaviorSubject<any[]>([]);
    currentDataSource = this.dataSource.asObservable();

    constructor() { }
}
