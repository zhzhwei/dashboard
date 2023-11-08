import { Component } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';

@Component({
    selector: 'app-stacked-bareditor',
    templateUrl: './stackedbareditor.component.html',
    styleUrls: ['./stackedbareditor.component.css']
})
export class StackedBarEditorComponent {

    constructor(private rdfDataService: RdfDataService) { }

    public triples: any[];
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
            .then(data => {
                this.triples = data.results.bindings;
                this.results = this.triples;
            })
            .catch(error => console.error(error));
    }
    
    public applyChanges(): void {
        console.log(this.results);
        this.dataSource = this.results;
    }
}