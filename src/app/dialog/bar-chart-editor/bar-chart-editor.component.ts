import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';
import { ChartService } from 'src/app/services/chart.service';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
    selector: 'app-bar-chart-editor',
    templateUrl: './bar-chart-editor.component.html',
    styleUrls: ['./bar-chart-editor.component.css']
})
export class BarChartEditorComponent implements OnInit {

    public query: string;
    public skills: any;
    public results: any;
    public list: any;
    public checkedSkills: any;
    public dataSource: any;
    public allChecked = false;
    public titleQuery: string;
    public skillQuery: string;
    public skillQueries: string[];
    public titleCount: number;
    public jobName: string;

    private svg: any;
    private margin = 60;
    private barEL: any;
    private x: any;
    private y: any;

    private skillAbbr = {
        'Analytische Fähigkeiten': 'AF',
        'Bewerbungsmanagement': 'BM',
        'CNC-Schleifen': 'CS',
        'Flexibilität': 'F',
        'Kommunikationsfähigkeit': 'KF',
        'Kundenorientierung': 'KO',
        'Leitungsbereitschaft': 'LB',
        'Organisationsfähigkeit': 'OF',
        'Polymechanik': 'P',
        'Problemlösungsfähigkeit': 'PLF',
        'Qualitätsbewusstsein': 'QB',
        'Selbstständigkeit': 'SS',
        'Steuerungskenntnisse': 'SK',
        'Teamfähigkeit': 'TF',
        'Unternehmerisches Denken': 'UD',
    };

    constructor(private rdfDataService: RdfDataService, private chartService:
        ChartService, private dialog: MatDialog) {
        this.chartService.currentJobName.subscribe(jobName => {
            this.jobName = jobName;
            // console.log(this.jobName);
        });
    }

    ngOnInit(): void {
        this.query = this.rdfDataService.prefixes + `
            select distinct ?skillName where { 
                ?s rdf:type edm:JobPosting.
                ?s edm:title ?title.
                filter contains(?title, "${this.jobName}").
                ?s edm:hasSkill ?skill.
                ?skill edm:textField ?skillName.
                filter (lang(?skillName) = "de").
            } Order By ASC (?skillName)
        `;

        this.rdfDataService.getQueryResults(this.query)
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

    backToDashboard(): void {
        this.dialog.closeAll();
    }

    selectAll() {
        for (let item of this.list) {
            item.checked = this.allChecked;
        }
    }

    public applyChanges(): void {
        // console.log(this.jobName);
        this.chartService.newItem.next(true);
        this.titleQuery = this.rdfDataService.prefixes + `
            select (count(?s) as ?skillCount) where { 
                ?s rdf:type edm:JobPosting.
                ?s edm:title ?title.
                filter contains(?title, "${this.jobName}").
            }
        `;
        this.rdfDataService.getQueryResults(this.titleQuery)
            .then(data => {
                this.results = data.results.bindings;
                this.titleCount = Number(this.results[0].skillCount.value);
            })
            .catch(error => console.error(error));

        this.checkedSkills = this.list.filter(item => item.checked === true);
        this.skillQuery = this.rdfDataService.prefixes + `
            select (count(?s) as ?skillCount) where { 
                ?s rdf:type edm:JobPosting.
                ?s edm:title ?title.
                filter contains(?title, "${this.jobName}").
                ?s edm:hasSkill ?skill.
                ?skill edm:textField ?skillName.
                filter (lang(?skillName) = "de").
                filter (?skillName = "skillName"@de).
            }
        `;
        this.skillQueries = this.checkedSkills.map(item => {
            return this.skillQuery.replace('"skillName"@de', `"${item.title}"@de`);
        });
        this.dataSource = this.checkedSkills.map(item => {
            return {
                skill: item.title,
            }
        });
        let promises = this.skillQueries.map((query, index) => {
            return this.rdfDataService.getQueryResults(query)
                .then(data => {
                    this.results = data.results.bindings;
                    this.dataSource[index].skillCount = Number(this.results[0].skillCount.value);
                })
                .catch(error => console.error(error));
        });

        Promise.all(promises).then(() => {
            // this.dataSource.forEach(item => {
            //     console.log(item.skill, item.skillCount);
            // });
            this.dataSource.forEach(item => {
                item.skill = this.skillAbbr[item.skill];
            });
            this.chartService.chartType.next('Bar Chart');
            this.chartService.titleCount.next(this.titleCount);
            this.chartService.dataSource.next(this.dataSource);
            this.createChart(this.jobName, this.dataSource, this.titleCount);
        });
    }

    private createChart(jobName: string, dataSource: any[], titleCount: any): void {
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
            .text(`${jobName}` + " --- " + `${titleCount}` + " Stellenangebote");

        // Create the X-axis band scale
        this.x = d3.scaleBand()
            .range([0, this.barEL.clientWidth - this.margin * 2])
            .domain(dataSource.map(d => d.skill))
            .padding(0.2);

        // Draw the X-axis on the DOM
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x).tickSizeOuter(0))
            .selectAll('text')
            // .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'middle');

        // Create the Y-axis band scale
        const maxSkillCount = d3.max(dataSource, (d: any) => d.skillCount);
        this.y = d3.scaleLinear()
            .domain([0, maxSkillCount + 1])
            .range([this.barEL.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.y))

        // Create and fill the bars
        g.selectAll('bars')
            .data(dataSource)
            .enter()
            .append('rect')
            .attr('x', (d: any) => this.x(d.skill))
            .attr('y', (d: any) => this.y(d.skillCount))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.skillCount))
            .attr('fill', 'steelblue')
    }
}
