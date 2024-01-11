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
    //important object
    public queryParameters: any = {};

    constructor(private chartService: ChartService, private dialogService: DialogService, 
        private rdfDataService: RdfDataService, private systemService: SystemService) { }

    public chartType: string;
    public gridStack: GridStackComponent;
    public barResults: any;
    public jobName: string;
    public searchTerm: any;

    //checkboxes
    public jobNameCheckbox: boolean = false;
    public jobNameInput: string = '';
    public createdBeforeCheckbox: boolean = false;
    public createdBeforeDate: string = '';
    public createdAfterCheckbox: boolean = false;
    public createdAfterDate: string = '';
    public applicantNumberCheckbox: boolean = false;
    public applicantNumber: number = 1;
    public fulltimeJob: boolean = false;
    public limitedJob: boolean = false;
    public listsSkillCheckbox: boolean = false;
    public skill: string = '';

    public barQuery = this.rdfDataService.prefixes + `
        select ?title where { 
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.
        }
    `;

    ngOnInit(): void {
        this.barResults = [];
        this.onSearch("")
    }

    updateQueryParameters() {
    if (this.jobNameCheckbox && this.jobNameInput != undefined) {
        if(this.jobNameInput.trim() !== '') {
            this.queryParameters['jobName'] = this.jobNameInput.trim();
        }
        else {
            delete this.queryParameters['jobName'];
        }
    } else {
      // If checkbox is unchecked or input is empty, remove the key from queryParameters
        delete this.queryParameters['jobName'];
    }
    
    // Update queryParameters for createdBefore
    if (this.createdBeforeCheckbox && this.createdBeforeDate) {
        this.queryParameters['createdBefore'] = this.createdBeforeDate;
    } else {
        delete this.queryParameters['createdBefore'];
    }

    // Update queryParameters for createdAfter
    if (this.createdAfterCheckbox && this.createdAfterDate) {
        this.queryParameters['createdAfter'] = this.createdAfterDate;
    } else {
        delete this.queryParameters['createdAfter'];
    }
    
    // Update queryParameters for applicantNumber
    if (this.applicantNumberCheckbox && this.applicantNumber !== undefined) {
        this.queryParameters['applicantNumber'] = this.applicantNumber;
    } else {
        delete this.queryParameters['applicantNumber'];
    }
    
    // fulltimeJob and limitedJob
    if (this.fulltimeJob) {
        this.queryParameters['fulltimeJob'] = true;
    } else {
        delete this.queryParameters['fulltimeJob'];
    }
    if (this.limitedJob) {
        this.queryParameters['limitedJob'] = true;
    } else {
        delete this.queryParameters['limitedJob'];
    }

    // Update queryParameters for skill
    if (this.listsSkillCheckbox  && this.skill != undefined) {
        if(this.skill.trim() !== '') {
            this.queryParameters['skill'] = this.skill.trim();
        }
        else {
            delete this.queryParameters['skill'];
        }
    } else {
        delete this.queryParameters['skill'];
    }

    console.log('Updated queryParameters:', this.queryParameters);
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
        if (this.barResults.length > 0) {
            if (this.systemService.jobNames.includes(this.jobName)) {
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
            } else {
                this.dialogService.openSnackBar('Please enter the complete job name (case-sensitive)', 'close');
            }
        }
    }

}
