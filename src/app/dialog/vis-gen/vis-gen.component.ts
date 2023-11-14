import { Component, OnInit, ViewChild } from '@angular/core';
import { GridStackComponent } from '../../gridstack/gridstack.component';

import { ChartService } from '../../services/chart.service';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-vis-gen',
    templateUrl: './vis-gen.component.html',
    styleUrls: ['./vis-gen.component.css']
})
export class VisGenComponent implements OnInit {

    constructor(private chartService: ChartService, private dialogService: DialogService) { }

    public chartType: string;
    public gridStack: GridStackComponent;

    ngOnInit(): void {

    }

    public genVis() {
        // console.log(this.chartType);
        this.chartService.chartType.next(this.chartType);
        switch (this.chartType) {
            case 'Bar Chart':
                this.dialogService.openBarChartEditor();
                break;
            case 'Stacked Bar Chart':
                this.dialogService.openStackedBarChartEditor();
                break;
            case 'Pie Chart':
                this.dialogService.openPieChartEditor();
                break;
            default:
                console.log('Invalid Chart Type');
        }
    }

}
