import { Component, OnInit } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';

@Component({
    selector: 'app-bar-chart-editor',
    templateUrl: './bar-chart-editor.component.html',
    styleUrls: ['./bar-chart-editor.component.css']
})
export class BarChartEditorComponent implements OnInit {

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

        // this.query = `
        //     PREFIX rdf:	<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        //     PREFIX edm: <http://ai4bd.com/resource/edm/>
            
        //     select ?jobposting ?p ?o where {
        //         ?jobposting rdf:type edm:JobPosting .
        //         ?jobposting ?p ?o .
        //     } limit 10
        // `;
        
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
