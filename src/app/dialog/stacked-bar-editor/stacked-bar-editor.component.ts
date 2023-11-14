import { Component } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';

@Component({
    selector: 'app-stacked-bar-editor',
    templateUrl: './stacked-bar-editor.component.html',
    styleUrls: ['./stacked-bar-editor.component.css']
})
export class StackedBarEditorComponent {

    constructor(private rdfDataService: RdfDataService) { }

    public results: any;
    public dataSource = Array(10).fill({});
    public query: string;

    displayColumns: string[] = ['subject', 'predicate', 'object'];
    
    ngOnInit(): void {
        this.query = `
            SELECT ?s ?p ?o
            WHERE {
                ?s ?p ?o .
            } limit 10
        `;
        this.rdfDataService.queryData(this.query)
            .then(data => this.results = data.results.bindings)
            .catch(error => console.error(error));
    }
    
    public applyChanges(): void {
        console.log(this.results);
        this.dataSource = this.results;
    }
}