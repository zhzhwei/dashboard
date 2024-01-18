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

    // skills require extra information to be counted
    public skillQueryStart = `SELECT DISTINCT ?skillName
                            WHERE {
                            ?s rdf:type edm:JobPosting.
                            ?s edm:title ?title.`;

    public skillQueryEnd = `?s edm:hasSkill ?skill.
                            ?skill edm:textField ?skillName.
                            FILTER (lang(?skillName) = "de").
                        }
                        ORDER BY ?skillName`;

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

    addFilters(query: string) {
        for (const key in this.queryParameters) {
            if (this.queryParameters.hasOwnProperty(key) && this.queryMappings[key]) {
                const filterString = this.queryMappings[key].replace("$value$", this.queryParameters[key]);
                query += filterString;
            }
        }
        return query;
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

        //special behavior for skills, yet again
        if (this.xProperty === "skill") {
            let skillListString = ""
            let skillQuery = this.rdfDataService.prefixes + this.skillQueryStart;
            skillQuery = this.addFilters(skillQuery);
            skillQuery += this.skillQueryEnd;
            console.log(skillQuery)
            console.log(this.rdfDataService.getQueryResults(skillQuery));
            //TODO get list of all skills using this query
            //make string out of skillList
        }

        let query =
            this.rdfDataService.prefixes +
            `SELECT ?${this.xProperty} (COUNT(DISTINCT ?s) AS ?occurrences) WHERE {
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.`;

        query = this.addFilters(query);
        //nothing to add for title, that's essentially the vanilla case
        if (this.xProperty == "fulltimeJob") {
            query += `?s mp:isFulltimeJob ?fulltimeJobRaw.
            BIND(str(?fulltimeJobRaw) AS ?fulltimeJob).`;
        }
        else if (this.xProperty == "limitedJob") {
            query += `?s mp:isLimitedJob ?limitedJobRaw.
            BIND(str(?limitedJobRaw) AS ?limitedJob).`;
        }

        query +=  `} GROUP BY ?${this.xProperty}`;
        console.log(query);
        console.log(this.rdfDataService.getQueryResults(query));

        return query;
    }
}
