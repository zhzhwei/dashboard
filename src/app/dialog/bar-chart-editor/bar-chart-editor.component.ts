import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';
import { BarChartComponent } from 'src/app/diagram/bar-chart/bar-chart.component';
import { ChartService } from 'src/app/services/chart.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import * as d3 from 'd3';

@Component({
    selector: 'app-bar-chart-editor',
    templateUrl: './bar-chart-editor.component.html',
    styleUrls: ['./bar-chart-editor.component.css']
})
export class BarChartEditorComponent implements OnInit {

    constructor(private rdfDataService: RdfDataService, private chartService: 
        ChartService, private dialog: MatDialog, private dialogService: DialogService) {

    }

    public query: string;
    public skills: any;
    public results: any;
    public list: any;
    public checkedSkills: any;
    public dataSource: any;
    public allChecked = false;

    private svg: any;
    private margin = 80;
    private barEL: any;
    private x: any;
    private y: any;

    public skillQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX edm: <http://ai4bd.com/resource/edm/>
            select (count(?s) as ?skillCount) where { 
                ?s rdf:type edm:JobPosting.
                ?s edm:title ?title.
                filter contains(?title, "Polymechaniker").
                ?s edm:hasSkill ?skill.
                ?skill edm:textField ?skillName.
                filter (lang(?skillName) = "de").
                filter (?skillName = "skillName"@de).
            }
        `;
    public skillQueries: string[];

    displayColumns: string[] = ['subject', 'predicate', 'object'];

    ngOnInit(): void {
        this.query = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX edm: <http://ai4bd.com/resource/edm/>
            select distinct ?skillName where { 
                ?s rdf:type edm:JobPosting.
                ?s edm:title ?title.
                filter contains(?title, "Polymechaniker").
                ?s edm:hasSkill ?skill.
                ?skill edm:textField ?skillName.
                filter (lang(?skillName) = "de").
            }
        `;

        this.rdfDataService.queryData(this.query)
            .then(data => {
                this.results = data.results.bindings;
                this.skills = this.results.map(item => item.skillName.value);
                this.list = this.skills.map((item, index) => {
                    return {
                        id: index,
                        title: item,
                        checked: false,
                    }
                });
            })
            .catch(error => console.error(error));
    }

    selectAll() {
        for (let item of this.list) {
            item.checked = this.allChecked;
        }
    }

    public applyChanges(): void {
        this.checkedSkills = this.list.filter(item => item.checked === true);
        this.skillQueries = this.checkedSkills.map(item => {
            return this.skillQuery.replace('"skillName"@de', `"${item.title}"@de`);
        });
        this.dataSource = this.checkedSkills.map(item => {
            return {
                skill: item.title,
            }
        });

        let promises = this.skillQueries.map((query, index) => {
            return this.rdfDataService.queryData(query)
                .then(data => {
                    this.results = data.results.bindings;
                    this.dataSource[index].skillCount = parseInt(this.results[0].skillCount.value);
                })
                .catch(error => console.error(error));
        });
        Promise.all(promises).then(() => {
            // this.dataSource.forEach(item => {
            //     console.log(item.skill, item.skillCount);
            // });
            this.createChart(this.dataSource);
            this.chartService.dataSourceSubject.next(this.dataSource);
        });
    }

    private backToDashboard(): void {
        this.dialog.closeAll();
    }

    private createChart(data: any[]): void {
        this.barEL = document.getElementById('editor-bar');
        // console.log(this.barEL.clientWidth, this.barEL.clientHeight);
        
        while (this.barEL.firstChild) {
            this.barEL.removeChild(this.barEL.firstChild);
        }

        this.svg = d3.select('#editor-bar')
            .append('svg')
            .attr('width', this.barEL.clientWidth)
            .attr('height', this.barEL.clientHeight)

        var g = this.svg.append('g')
            .attr('transform', 'translate(' + (this.margin + 10) + ',' + this.margin + ')');

        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.barEL.clientWidth / 2))
            .attr("y", this.margin / 2 + 15)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Beruf - Polymechaniker");

        // Create the X-axis band scale
        this.x = d3.scaleBand()
            .range([0, this.barEL.clientWidth - this.margin * 2])
            .domain(data.map(d => d.skill))
            .padding(0.2);

        // Draw the X-axis on the DOM
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x).tickSizeOuter(0))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // Create the Y-axis band scale
        const maxSkillCount = d3.max(data, (d: any) => d.skillCount);
        this.y = d3.scaleLinear()
            .domain([0, maxSkillCount + 1]) 
            .range([this.barEL.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.y))

        // Create and fill the bars
        g.selectAll('bars')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d: any) => this.x(d.skill))
            .attr('y', (d: any) => this.y(d.skillCount))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.skillCount))
            .attr('fill', 'steelblue')
    }
}