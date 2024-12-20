import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RdfDataService } from '../../services/rdf-data.service';
import { MatRadioChange } from '@angular/material/radio';
import { ChartService } from '../../services/chart.service';
import * as d3 from 'd3';

interface Datum {
    label: string;
    value: number;
}

@Component({
    selector: 'app-pie-chart-editor',
    templateUrl: './pie-chart-editor.component.html',
})
export class PieChartEditorComponent implements OnInit {

    private dataSource: any[];
    private fulltimeTrueCount: number;
    private fulltimeFalseCount: number;
    private parttimeTrueCount: number;
    private parttimeFalseCount: number;
    private jobCount: number;

    private svg: any;
    private margin = 80;
    private pieEl: any;
    private radius: number;
    private color: any;
    private arc: any;
    private g: any;
    public jobName: string;

    public jobCountQuery = this.rdfDataService.prefixes + `
        select (count(?s) as ?jobCount) where { 
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.
        }
    `;

    public fulltimeTrueCountQuery = this.jobCountQuery.replace('?jobCount', '?fulltimeTrueCount').
        replace('?title.', '?title. ?s mp:isFulltimeJob "true"^^xsd:boolean.');
    
    public fulltimeFalseCountQuery = this.jobCountQuery.replace('?jobCount', '?fulltimeFalseCount').
        replace('?title.', '?title. ?s mp:isFulltimeJob "false"^^xsd:boolean.');

    public parttimeTrueCountQuery = this.jobCountQuery.replace('?jobCount', '?parttimeTrueCount').
        replace('?title.', '?title. ?s mp:isLimitedJob "true"^^xsd:boolean.');

    public parttimeFalseCountQuery = this.jobCountQuery.replace('?jobCount', '?parttimeFalseCount').
        replace('?title.', '?title. ?s mp:isLimitedJob "false"^^xsd:boolean.');

    constructor(private rdfDataService: RdfDataService, private chartService: ChartService,
        private dialog: MatDialog) {
        this.chartService.currentChartAction.subscribe(chartAction => {
            this.jobName = chartAction.jobName;
        });
    }

    ngOnInit(): void {
        if (this.jobName) {
            this.jobCountQuery = this.jobCountQuery.replace('}', ` filter contains(?title, "${this.jobName}"). }`);
            this.fulltimeTrueCountQuery = this.fulltimeTrueCountQuery.replace('}', ` filter contains(?title, "${this.jobName}"). }`);
            this.fulltimeFalseCountQuery = this.fulltimeFalseCountQuery.replace('}', ` filter contains(?title, "${this.jobName}"). }`);
            this.parttimeTrueCountQuery = this.parttimeTrueCountQuery.replace('}', ` filter contains(?title, "${this.jobName}"). }`);
            this.parttimeFalseCountQuery = this.parttimeFalseCountQuery.replace('}', ` filter contains(?title, "${this.jobName}"). }`);
        }
    }
    
    backToDashboard(): void {
        this.dialog.closeAll();
    }

    onOptionChange(event: MatRadioChange) {
        this.dataSource = [];
        if (event.value === 'isFulltimeJob') {
            Promise.all([
                this.rdfDataService.getQueryResults(this.fulltimeTrueCountQuery),
                this.rdfDataService.getQueryResults(this.fulltimeFalseCountQuery),
                this.rdfDataService.getQueryResults(this.jobCountQuery)
            ]).then((data) => {
                this.dataSource = this.dataSource.concat(data.map((item: any) => {
                    if (item && item.results && item.results.bindings[0]) {
                        if (item.results.bindings[0].fulltimeTrueCount) {
                            this.fulltimeTrueCount = Number(item.results.bindings[0].fulltimeTrueCount.value)
                            return { label: 'Fulltime=True', value: this.fulltimeTrueCount }
                        } else if (item.results.bindings[0].fulltimeFalseCount) {
                            this.fulltimeFalseCount = Number(item.results.bindings[0].fulltimeFalseCount.value)
                            return { label: 'Fulltime=False', value: this.fulltimeFalseCount }
                        } else if (item.results.bindings[0].jobCount) {
                            this.jobCount = Number(item.results.bindings[0].jobCount.value)
                            return { label: 'No Infomation', value: this.jobCount - this.fulltimeTrueCount - this.fulltimeFalseCount }
                        } 
                    }
                }));
                this.chartService.chartAction.next({
                    ...this.chartService.chartAction.value,
                    pieLabel: 'isFulltimeJob'
                });
                this.chartService.chartType.next('Pie Chart');
                this.chartService.dataSource.next(this.dataSource);
                this.chartService.pieLabel.next('isFulltimeJob');
                this.createChart(this.jobName, this.dataSource, 'isFulltimeJob');
            });
        } else if (event.value === 'isLimitedJob') {
            Promise.all([
                this.rdfDataService.getQueryResults(this.parttimeTrueCountQuery),
                this.rdfDataService.getQueryResults(this.parttimeFalseCountQuery),
                this.rdfDataService.getQueryResults(this.jobCountQuery)
            ]).then((data) => {
                this.dataSource = this.dataSource.concat(data.map((item: any) => {
                    if (item && item.results && item.results.bindings[0]) {
                        if (item.results.bindings[0].parttimeTrueCount) {
                            this.parttimeTrueCount = Number(item.results.bindings[0].parttimeTrueCount.value)
                            return { label: 'Parttime=True', value: this.parttimeTrueCount }
                        } else if (item.results.bindings[0].parttimeFalseCount) {
                            this.parttimeFalseCount = Number(item.results.bindings[0].parttimeFalseCount.value)
                            return { label: 'Parttime=False', value: this.parttimeFalseCount }
                        } else if (item.results.bindings[0].jobCount) {
                            this.jobCount = Number(item.results.bindings[0].jobCount.value)
                            return { label: 'No Infomation', value: this.jobCount - this.parttimeTrueCount - this.parttimeFalseCount }
                        } 
                    }
                }));
                this.chartService.chartAction.next({
                    ...this.chartService.chartAction.value,
                    pieLabel: 'isLimitedJob'
                });
                this.chartService.chartType.next('Pie Chart');
                this.chartService.dataSource.next(this.dataSource);
                this.chartService.pieLabel.next('isLimitedJob');
                this.createChart(this.jobName, this.dataSource, 'isLimitedJob');
            });
        }
    }

    public createChart(jobName: string, dataSource: any, pieLabel: string): void {
        this.pieEl = document.getElementById('editor-pie');
        // console.log(this.pieEl.clientWidth, this.pieEl.clientHeight);

        while (this.pieEl.firstChild) {
            this.pieEl.removeChild(this.pieEl.firstChild);
        }

        this.svg = d3.select('#editor-pie')
            .append('svg')
            .attr('width', this.pieEl.clientWidth)
            .attr('height', 480)

        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.pieEl.clientWidth / 2))
            .attr("y", this.margin / 2 - 8)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text((jobName ? jobName : "JobPosting") + " --- " + pieLabel);
        
        this.radius = Math.min(this.pieEl.clientWidth, this.pieEl.clientHeight) / 2 - this.margin;
        // Define the color scale
        this.color = d3.scaleOrdinal()
            .domain(dataSource.map(d => d.label))
            .range(d3.schemeCategory10);

        // Define the pie function
        var pie = d3.pie<Datum>()
            .value((d: Datum) => d.value)
            .sort(null);

        // Define the arc function
        this.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius);

        // Bind the data to the pie chart and draw the arcs
        this.g = this.svg.append('g')
            .attr('transform', 'translate(' + this.pieEl.clientWidth / 2 + ',' + this.pieEl.clientHeight / 2 + ')');

        this.g.selectAll('path')
            .data(pie(dataSource))
            .enter()
            .append('path')
            .attr('d', this.arc)
            .attr('fill', (d) => this.color(d.data.label));
    }
}
