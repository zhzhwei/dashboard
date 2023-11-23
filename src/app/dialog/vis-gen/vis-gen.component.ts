import { Component, OnInit, ViewChild } from '@angular/core';
import { GridStackComponent } from '../../gridstack/gridstack.component';

import { ChartService } from '../../services/chart.service';
import { DialogService } from '../../services/dialog.service';

import * as d3 from 'd3';
import { RdfDataService } from 'src/app/services/rdf-data.service';

@Component({
    selector: 'app-vis-gen',
    templateUrl: './vis-gen.component.html',
    styleUrls: ['./vis-gen.component.css']
})
export class VisGenComponent implements OnInit {

    constructor(private chartService: ChartService, private dialogService: DialogService, 
        private rdfDataService: RdfDataService) { }

    public chartType: string;
    public gridStack: GridStackComponent;
    public barResults: any;
    public jobName: string;

    public barQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX edm: <http://ai4bd.com/resource/edm/>
        PREFIX mp: <http://ai4bd.com/resource/ddm/mp/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        select ?title where { 
            ?s mp:isFulltimeJob "true"^^xsd:boolean.
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
                    return item.includes(jobName);
                });
            });
        }
        this.jobName = jobName;
        // console.log(this.jobName);
    }

    chartTypeSelect(event: any) {
        // console.log(event.target);
        d3.select(event.target)
            .style('border', '3px solid gray')
            .style('border-radius', '5px');
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

    public genVis() {
        // console.log(this.chartType);
        this.chartService.chartType.next(this.chartType);
        this.chartService.jobName.next(this.jobName);
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
            case 'Doughnut Chart':
                this.dialogService.openDoughnutChartEditor();
                break;
            case 'Star Plot':
                this.dialogService.openStarPlotEditor();
                break;
            default:
                console.log('Invalid Chart Type');
        }
    }

}
