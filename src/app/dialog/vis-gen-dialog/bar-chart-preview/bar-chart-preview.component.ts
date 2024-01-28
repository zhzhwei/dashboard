import { Component, OnInit, Input } from "@angular/core";

import { DialogService } from "../../../services/dialog.service";
import { RdfDataService } from "../../../services/rdf-data.service";
import { SharedService } from "../../../services/shared.service";

@Component({
    selector: "app-bar-chart-preview",
    templateUrl: "./bar-chart-preview.component.html",
    styleUrls: ["./bar-chart-preview.component.css"],
})
export class BarChartPreviewComponent implements OnInit {
    @Input() queryParameters: Object;
    @Input() selectProperties: string[];

    public xProperty;
    public mainResult: any[];

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

    constructor(private rdfDataService: RdfDataService, private dialogService: DialogService, private sharedService: SharedService) {}
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
        if (this.xProperty == "skill") {
            let skillList = [];
            let skillQuery = this.rdfDataService.prefixes + this.skillQueryStart;
            skillQuery = this.addFilters(skillQuery);
            skillQuery += this.skillQueryEnd;

            this.rdfDataService.getQueryResults(skillQuery).then((data) => {
                for (const item of data.results.bindings) {
                    skillList.push(`"${item.skillName.value}"@de`);
                }
                // console.log(skillList);
                if (skillList.length > 40) {
                    this.dialogService.openSnackBar("Too many different values to visualize in a bar chart.", "close");
                } else {
                    let skillListString = skillList.join(", ");
                    // console.log(skillListString);
                    let actualCountQuery =
                        this.rdfDataService.prefixes +
                        `SELECT ?skillName (COUNT(DISTINCT ?s) AS ?occurrences) WHERE {
                            ?s rdf:type edm:JobPosting.
                            ?s edm:title ?title.`;
                    actualCountQuery = this.addFilters(actualCountQuery);
                    actualCountQuery += `?s edm:hasSkill ?skill.
                        ?skill edm:textField ?skillName.
                        FILTER (lang(?skillName) = "de").
                        FILTER (?skillName IN (${skillListString})).
                    }
                    GROUP BY ?skillName`;
                    // console.log(actualCountQuery);
                    this.rdfDataService.getQueryResults(actualCountQuery).then((data) => {
                        this.mainResult =  data.results.bindings.map((item) => {
                            return { name: item.skillName.value, count: item.occurrences.value };
                        });
                        // console.log("this.mainResult")
                        // console.log(this.mainResult)
                        this.sharedService.updateResults(this.mainResult);
                    })
                }
            });
            return
        }

        if (this.xProperty == "title") {
            this.xProperty = "justJobName";
        }
        let query =
            this.rdfDataService.prefixes +
            `SELECT ?${this.xProperty} (COUNT(DISTINCT ?s) AS ?occurrences) WHERE {
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.`;

        query = this.addFilters(query);
        if (this.xProperty == "justJobName") {
            query += `BIND("${this.queryParameters["jobName"]}" AS ?justJobName).`;
        } else if (this.xProperty == "fulltimeJob") {
            query += `?s mp:isFulltimeJob ?fulltimeJobRaw.
            BIND(str(?fulltimeJobRaw) AS ?fulltimeJob).`;
        } else if (this.xProperty == "limitedJob") {
            query += `?s mp:isLimitedJob ?limitedJobRaw.
            BIND(str(?limitedJobRaw) AS ?limitedJob).`;
        }

        query += `} GROUP BY ?${this.xProperty}`;
        // console.log(query);
        this.rdfDataService.getQueryResults(query).then((data) => {
            this.mainResult =  data.results.bindings.map((item) => {
                return { name: item[this.xProperty].value, count: item.occurrences.value };
            });
            // console.log("this.mainResult")
            // console.log(this.mainResult)
            this.sharedService.updateResults(this.mainResult);
        })

        return query;
    }
}
