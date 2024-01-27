import { Component, OnInit, Input } from "@angular/core";

import { DialogService } from "../../../services/dialog.service";
import { RdfDataService } from "../../../services/rdf-data.service";
import { SharedService } from "../../../services/shared.service";
import * as d3 from "d3";

@Component({
    selector: "app-line-chart-preview",
    templateUrl: "./line-chart-preview.component.html",
    styleUrls: ["./line-chart-preview.component.css"],
})
export class LineChartPreviewComponent implements OnInit {
    @Input() queryParameters: Object;
    @Input() selectProperties: string[];

    public mainResult: any[];

    public queryMappings: { [key: string]: string } = {
        jobName: `FILTER contains(?title, "$value$").`,
        createdBefore: `?s edm:dateCreated ?created. FILTER (xsd:dateTime("$value$T00:00:00Z") > xsd:dateTime(?created)).`,
        createdAfter: `?s edm:dateCreated ?created. FILTER (xsd:dateTime(?created) > xsd:dateTime("$value$T00:00:00Z")).`,
        fulltimeJob: `?s mp:isFulltimeJob "$value$"^^xsd:boolean.`,
        limitedJob: `?s mp:isLimitedJob "$value$"^^xsd:boolean.`,
        skill: `?s edm:hasSkill ?skill. ?skill edm:textField "$value$"@de`,
    };

    constructor(private rdfDataService: RdfDataService, private dialogService: DialogService, private sharedService: SharedService) {}
    ngOnInit(): void {}

    addFilters(query: string) {
        for (const key in this.queryParameters) {
            if (this.queryParameters.hasOwnProperty(key) && this.queryMappings[key]) {
                const filterString = this.queryMappings[key].replace("$value$", this.queryParameters[key]);
                query += filterString;
            }
        }
        return query;
    }

    generateQuery() {
        let query =
            this.rdfDataService.prefixes +
            `SELECT ?created (COUNT(DISTINCT ?s) AS ?occurrences) WHERE {
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.`;

        query = this.addFilters(query);
        query += `?s edm:dateCreated ?createdTime.
                BIND(xsd:dateTime(concat(SUBSTR(str(?createdTime), 1, 10),"T00:00:00Z")) AS ?created)
                } GROUP BY ?created`;

        console.log(query);

        
        const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
        this.rdfDataService.getQueryResults(query).then((data) => {
            console.log(data);
            //filter out empty creation date here
            this.mainResult = data.results.bindings
                .map((item) => {
                    if (item.hasOwnProperty("created")) {
                        return { date: parseDate(item.created.value), count: +item.occurrences.value };
                    } else {
                        return null;
                    }
                })
                //filter out null items
                .filter((item) => item !== null);
            console.log("this.mainResult");
            console.log(this.mainResult);
            this.sharedService.updateResults(this.mainResult);
        });

        return query;
    }
}
