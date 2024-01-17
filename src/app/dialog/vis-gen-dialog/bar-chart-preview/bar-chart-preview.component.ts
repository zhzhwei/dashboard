import { Component, OnInit, Input } from "@angular/core";

import { RdfDataService } from "../../../services/rdf-data.service";

@Component({
    selector: "app-bar-chart-preview",
    templateUrl: "./bar-chart-preview.component.html",
    styleUrls: ["./bar-chart-preview.component.css"],
})
export class BarChartPreviewComponent implements OnInit {
    @Input() queryParameters: Object;
    @Input() selectProperties: string[];

    public xProperty;

    public queryMappings: { [key: string]: string } = {
        jobName: `FILTER contains(?title, "$value$").`,
        createdBefore: `?s edm:dateCreated ?created. FILTER (xsd:dateTime("$value$T00:00:00Z") > xsd:dateTime(?created)).`,
        createdAfter: `?s edm:dateCreated ?created. FILTER (xsd:dateTime(?created) > xsd:dateTime("$value$T00:00:00Z")).`,
        fulltimeJob: `?s mp:isFulltimeJob "$value$"^^xsd:boolean.`,
        limitedJob: `?s mp:isLimitedJob "$value$"^^xsd:boolean.`,
        skill: `?s edm:hasSkill ?skill. ?skill edm:textField "$value$"@de`,
    };

    constructor(private rdfDataService: RdfDataService) {}
    ngOnInit(): void {}

    logQueryParameters() {
        console.log("Query Parameters:", this.queryParameters);
        console.log("select properties (probably the more important ones):", this.selectProperties);
    }
    updateXProperty() {
        // Access the selected value using document.getElementById
        const xPropertyElement = document.getElementById("x_property");
        if (xPropertyElement instanceof HTMLSelectElement) {
            // Ensure the element is a select element
            this.xProperty = xPropertyElement.value;
        }
    }

    generateQuery() {
        this.updateXProperty();

        let query =
            this.rdfDataService.prefixes +
            `SELECT ?${this.xProperty} (COUNT(DISTINCT ?s) AS ?occurrences) WHERE {
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.`;

        // Add statements based on queryParameters
        for (const key in this.queryParameters) {
            if (this.queryParameters.hasOwnProperty(key) && this.queryMappings[key]) {
                const filterString = this.queryMappings[key].replace("$value$", this.queryParameters[key]);
                query += filterString;
            }
        }
        console.log(query);

        return query + "}";
    }
}
