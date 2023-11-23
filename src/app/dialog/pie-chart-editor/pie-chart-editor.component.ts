import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RdfDataService } from '../../services/rdf-data.service';
import { MatRadioChange } from '@angular/material/radio';
import { ChartService } from 'src/app/services/chart.service';
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
        private dialog: MatDialog) {}

    ngOnInit(): void {

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
                            return { label: 'fulltimeTrueCount', value: this.fulltimeTrueCount }
                        } else if (item.results.bindings[0].fulltimeFalseCount) {
                            this.fulltimeFalseCount = Number(item.results.bindings[0].fulltimeFalseCount.value)
                            return { label: 'fulltimeFalseCount', value: this.fulltimeFalseCount }
                        } else if (item.results.bindings[0].jobCount) {
                            this.jobCount = Number(item.results.bindings[0].jobCount.value)
                            return { label: 'noInfomation', value: this.jobCount - this.fulltimeTrueCount - this.fulltimeFalseCount }
                        } 
                    }
                }));
                this.createChart(this.dataSource);
                this.chartService.dataSource.next(this.dataSource);
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
                            return { label: 'parttimeTrueCount', value: this.parttimeTrueCount }
                        } else if (item.results.bindings[0].parttimeFalseCount) {
                            this.parttimeFalseCount = Number(item.results.bindings[0].parttimeFalseCount.value)
                            return { label: 'parttimeFalseCount', value: this.parttimeFalseCount }
                        } else if (item.results.bindings[0].jobCount) {
                            this.jobCount = Number(item.results.bindings[0].jobCount.value)
                            return { label: 'noInfomation', value: this.jobCount - this.parttimeTrueCount - this.parttimeFalseCount }
                        } 
                    }
                }));
                this.createChart(this.dataSource);
                this.chartService.dataSource.next(this.dataSource);
            });
        }

    }

    public createChart(data: any): void {
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
            .attr("y", this.margin / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("JobPosting");

        this.radius = Math.min(this.pieEl.clientWidth, this.pieEl.clientHeight) / 2 - this.margin;
        // Define the color scale
        this.color = d3.scaleOrdinal()
            .domain(data.map(d => d.label))
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
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', this.arc)
            .attr('fill', (d) => this.color(d.data.label));
    }
}
