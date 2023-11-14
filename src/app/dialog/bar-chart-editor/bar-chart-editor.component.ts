import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from 'src/app/services/chart.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-bar-chart-editor',
    templateUrl: './bar-chart-editor.component.html',
    styleUrls: ['./bar-chart-editor.component.css']
})
export class BarChartEditorComponent implements OnInit {

    constructor(private rdfDataService: RdfDataService, private chartService: ChartService, private dialog: MatDialog) { }

    public query: string;
    public skills: any;
    public results: any;
    public list: any;
    public checkedSkills: any;
    public dataSource: any;

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
            this.chartService.dataSourceSubject.next(this.dataSource);
        });
        this.dialog.closeAll();
    }
}
