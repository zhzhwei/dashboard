import { Component, OnInit, ViewChild } from '@angular/core';
import { GridStackComponent } from '../../gridstack/gridstack.component';

import { ChartService } from '../../services/chart.service';

@Component({
    selector: 'app-vis-gen',
    templateUrl: './vis-gen.component.html',
    styleUrls: ['./vis-gen.component.css']
})
export class VisGenComponent implements OnInit {

    constructor(private chartService: ChartService) { }

    public chartType: string;
    public gridStack: GridStackComponent;

    ngOnInit(): void {

    }

    getChartType() {
        console.log(this.chartType);
        this.chartService.sourceChartType.next(this.chartType);
    }

}
