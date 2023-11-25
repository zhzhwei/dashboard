import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RdfDataService } from '../../services/rdf-data.service';

@Component({
    selector: 'app-stacked-bar-editor',
    templateUrl: './stacked-bar-editor.component.html',
})
export class StackedBarEditorComponent {


    public results: any;
    public dataSource = Array(10).fill({});
    public query: string;

    constructor(private rdfDataService: RdfDataService, private dialog: MatDialog) { }
    
    ngOnInit(): void {
        this.query = `
            SELECT ?s ?p ?o
            WHERE {
                ?s ?p ?o .
            } limit 10
        `;
        this.rdfDataService.getQueryResults(this.query)
            .then(data => this.results = data.results.bindings)
            .catch(error => console.error(error));
    }

    backToDashboard(): void {
        this.dialog.closeAll();
    }
    
    public applyChanges(): void {
        console.log(this.results);
        this.dataSource = this.results;
    }
}