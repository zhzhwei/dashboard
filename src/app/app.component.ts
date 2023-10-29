import { Component } from '@angular/core';
import { RdfDataService } from './services/rdf-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
    public triples: any[];

    constructor(private rdfDataService: RdfDataService) {}

    ngOnInit() {
        var results = this.rdfDataService.queryData()
            .then(data => this.triples = data.results.bindings)
            .catch(error => console.error(error));
        console.log(results);
    }
}
