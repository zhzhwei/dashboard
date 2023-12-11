import { Component, OnInit, ViewChild } from '@angular/core';
import { GridStackComponent } from '../../gridstack/gridstack.component';

import { ChartService } from '../../services/chart.service';
import { DialogService } from '../../services/dialog.service';
import { RdfDataService } from '../../services/rdf-data.service';

import * as d3 from 'd3';
import { SystemService } from 'src/app/services/system.service';

@Component({
    selector: 'app-vis-gen-dialog',
    templateUrl: './vis-gen-dialog.component.html',
    styleUrls: ['./vis-gen-dialog.component.css']
})
export class VisGenDialogComponent implements OnInit {

    constructor(private chartService: ChartService, private dialogService: DialogService, 
        private rdfDataService: RdfDataService, private systemService: SystemService) { }

    public chartType: string;
    public gridStack: GridStackComponent;
    public barResults: any;
    public jobName: string;

    public barQuery = this.rdfDataService.prefixes + `
        select ?title where { 
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.
        }
    `;

    ngOnInit(): void {
        this.barResults = [];
    }

    onSearch(jobName: string) {
        if (jobName === '') {
            this.rdfDataService.getQueryResults(this.barQuery).then(data => {
                this.barResults = data.results.bindings.map((item) => {
                    return item.title.value;
                });
            });
        } else {
            this.rdfDataService.getQueryResults(this.barQuery).then(data => {
                this.barResults = data.results.bindings.map((item) => {
                    return item.title.value;
                }).filter((item) => {
                    return item.toLowerCase().includes(jobName.toLowerCase());
                });
            });
        }
        if (this.chartType === 'Bar Chart' || this.chartType === 'Pie Chart') {
            this.jobName = jobName;
        }
    }

    chartTypeSelect(event: any) {
        // console.log(event.target);
        d3.select(event.target)
            .style('border', '3px solid gray');
        d3.selectAll('.img-button')
            .filter(function () {
                return this !== event.target;
            })
            .style('border', 'none');
        this.rdfDataService.getQueryResults(this.barQuery).then(data => {
            this.barResults = data.results.bindings.map((item) => {
                return item.title.value;
            });
            // console.log(this.barResults);
        });
    }

    public forwardToEditor() {
        // console.log(this.chartType);
        this.chartService.chartType.next(this.chartType);
        if (this.barResults.length > 0 && this.systemService.jobNames.includes(this.jobName)) {
            switch (this.chartType) {
                case 'Bar Chart':
                    this.dialogService.openBarChartEditor('create', '', this.jobName, this.barResults.length, '');
                    break;
                case 'Stacked Bar Chart':
                    this.dialogService.openStackedBarChartEditor();
                    break;
                case 'Pie Chart':
                    this.dialogService.openPieChartEditor('create', '', this.jobName);
                    break;
                case 'Doughnut Chart':
                    this.dialogService.openDoughnutChartEditor();
                    break;
                case 'Star Plot':
                    this.dialogService.openStarPlotEditor();
                    break;
                case 'Line Chart':
                    this.dialogService.openLineChartEditor();
                    break;
                default:
                    console.log('Invalid Chart Type');
            }
        }
    }

}
