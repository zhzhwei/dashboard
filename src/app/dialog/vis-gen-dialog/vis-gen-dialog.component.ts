import { Component, OnInit, ViewChildren, QueryList, ElementRef, ComponentFactoryResolver, Injector } from "@angular/core";
import { BarChartPreviewComponent } from "./bar-chart-preview/bar-chart-preview.component";
import { LineChartPreviewComponent } from "./line-chart-preview/line-chart-preview.component";
import { HttpClient } from "@angular/common/http";
import { GridStackComponent } from "../../gridstack/gridstack.component";

import { ChartService } from "../../services/chart.service";
import { DialogService } from "../../services/dialog.service";
import { RdfDataService } from "../../services/rdf-data.service";

import * as d3 from "d3";
import { SystemService } from "src/app/services/system.service";

@Component({
    selector: "app-vis-gen-dialog",
    templateUrl: "./vis-gen-dialog.component.html",
    styleUrls: ["./vis-gen-dialog.component.css"],
})
export class VisGenDialogComponent implements OnInit {
    //important object
    public queryParameters: any = {};
    currentPreviewContent: any = undefined;
    currentPreviewContentRef: any = undefined;

    constructor(
        private chartService: ChartService,
        private dialogService: DialogService,
        private rdfDataService: RdfDataService,
        private systemService: SystemService,
        private http: HttpClient,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector
    ) {}

    public chartType: string;
    public gridStack: GridStackComponent;
    public previewResults: any;
    public jobName: string;
    public searchTerm: any;

    //checkboxes
    public jobNameCheckbox: boolean = false;
    public jobNameInput: string = "";
    public createdBeforeCheckbox: boolean = false;
    public createdBeforeDate: string = "";
    public createdAfterCheckbox: boolean = false;
    public createdAfterDate: string = "";
    public applicantNumberCheckbox: boolean = false;
    public applicantNumber: number = 1;
    public fulltimeJobCheckbox = false;
    public fulltimeJob: boolean = true;
    public limitedJobCheckbox = false;
    public limitedJob: boolean = true;
    public listsSkillCheckbox: boolean = false;
    public skill: string = "";

    public allSuggestions: string[] = [];
    public selectProperties: string[] = ["s"];

    @ViewChildren("propertyCheckbox") propertyCheckboxes!: QueryList<ElementRef<HTMLInputElement>>;

    public barQuery =
        this.rdfDataService.prefixes +
        `
        select ?title where { 
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.
        }
    `;

    ngOnInit(): void {
        this.previewResults = [];
        this.onSearch();
        this.http.get("assets/job_name_suggestions.txt", { responseType: "text" }).subscribe((data) => {
            // Split the content into an array of suggestions (assuming one suggestion per line)
            this.allSuggestions = data.split("\n").map((suggestion) => suggestion.trim());
        });
    }

    ngAfterViewInit(): void {
        this.updateProperties();
    }

    updateQueryParameters() {
        if (this.jobNameCheckbox && this.jobNameInput != undefined) {
            if (this.jobNameInput.trim() !== "") {
                this.queryParameters["jobName"] = this.jobNameInput.trim();
            } else {
                delete this.queryParameters["jobName"];
            }
        } else {
            // If checkbox is unchecked or input is empty, remove the key from queryParameters
            delete this.queryParameters["jobName"];
        }

        // Update queryParameters for createdBefore
        if (this.createdBeforeCheckbox && this.createdBeforeDate) {
            this.queryParameters["createdBefore"] = this.createdBeforeDate;
        } else {
            delete this.queryParameters["createdBefore"];
        }

        // Update queryParameters for createdAfter
        if (this.createdAfterCheckbox && this.createdAfterDate) {
            this.queryParameters["createdAfter"] = this.createdAfterDate;
        } else {
            delete this.queryParameters["createdAfter"];
        }

        // Update queryParameters for applicantNumber
        if (this.applicantNumberCheckbox && this.applicantNumber !== undefined) {
            this.queryParameters["applicantNumber"] = this.applicantNumber;
        } else {
            delete this.queryParameters["applicantNumber"];
        }

        // fulltimeJob and limitedJob
        if (this.fulltimeJobCheckbox && this.fulltimeJob !== undefined) {
            this.queryParameters["fulltimeJob"] = JSON.parse(this.fulltimeJob.toString());
        } else {
            delete this.queryParameters["fulltimeJob"];
        }

        if (this.limitedJobCheckbox && this.limitedJob !== undefined) {
            this.queryParameters["limitedJob"] = JSON.parse(this.limitedJob.toString());
        } else {
            delete this.queryParameters["limitedJob"];
        }

        // Update queryParameters for skill
        if (this.listsSkillCheckbox && this.skill != undefined) {
            if (this.skill.trim() !== "") {
                this.queryParameters["skill"] = this.skill.trim();
            } else {
                delete this.queryParameters["skill"];
            }
        } else {
            delete this.queryParameters["skill"];
        }

        console.log("Updated queryParameters:", this.queryParameters);
    }

    generateQuery(): string {
        const queryMappings: { [key: string]: string } = {
            jobName: `FILTER contains(?title, "$value$").`,
            createdBefore: `?s edm:dateCreated ?created. FILTER (xsd:dateTime("$value$T00:00:00Z") > xsd:dateTime(?created)).`,
            createdAfter: `?s edm:dateCreated ?created. FILTER (xsd:dateTime(?created) > xsd:dateTime("$value$T00:00:00Z")).`,
            fulltimeJob: `?s mp:isFulltimeJob "$value$"^^xsd:boolean.`,
            limitedJob: `?s mp:isLimitedJob "$value$"^^xsd:boolean.`,
            skill: `?s edm:hasSkill ?skill. ?skill edm:textField "$value$"@de`,
        };

        let query =
            this.rdfDataService.prefixes +
            `SELECT ?s ?title WHERE {
            ?s rdf:type edm:JobPosting.
            ?s edm:title ?title.`;

        // Add statements based on queryParameters
        for (const key in this.queryParameters) {
            if (this.queryParameters.hasOwnProperty(key) && queryMappings[key]) {
                const filterString = queryMappings[key].replace("$value$", this.queryParameters[key]);
                query += filterString;
            }
        }

        return query + "}";
    }

    onSearch() {
        let previewQuery = this.generateQuery();
        console.log(previewQuery);
        console.log("results go here lol");

        this.rdfDataService.getQueryResults(previewQuery).then(data => {
            this.previewResults = data.results.bindings.map((item) => {
                let linkParts = item.s.value.split("/")
                let link = "https://graphdb.elevait.io/resource?uri=http:%2F%2Fai4bd.com%2Fresource%2Fdata%2F" + linkParts[linkParts.length - 1]
                return {"title": item.title.value, "link": link};
            });
        });
    }

    chartTypeSelect(event: any) {
        console.log(event.target.id);
        this.chartType = event.target.id;
        const cardBody = document.querySelector(".preview-content");

        d3.select(event.target).style("border", "3px solid gray");
        d3.selectAll(".img-button")
            .filter(function () {
                return this !== event.target;
            })
            .style("border", "none");

        const creationDateCheckbox = this.propertyCheckboxes.find((checkbox) => checkbox.nativeElement.id === "creationDateProperty");
        if (creationDateCheckbox) {
            creationDateCheckbox.nativeElement.checked = this.chartType === "line_chart";
            creationDateCheckbox.nativeElement.disabled = this.chartType === "line_chart";
        }

        let component;
        switch (this.chartType) {
            case "bar_chart":
                component = BarChartPreviewComponent;
                break;
            case "line_chart":
                component = LineChartPreviewComponent;
                break;
            default:
                // Default content or error handling
                // TODO
                break;
        }
        // Clear the existing content
        cardBody.innerHTML = "";

        // Dynamically create the component and attach it to the DOM
        const factory = this.componentFactoryResolver.resolveComponentFactory(component);
        const contentComponentRef = factory.create(this.injector);
        this.currentPreviewContentRef = contentComponentRef;

        // Type the component instance as any to avoid TypeScript errors
        const contentComponent: any = contentComponentRef.instance;
        this.currentPreviewContent = contentComponent;

        contentComponent.queryParameters = this.queryParameters;
        contentComponent.selectProperties = this.selectProperties;
        contentComponentRef.changeDetectorRef.detectChanges();
        cardBody.appendChild(contentComponentRef.location.nativeElement);
    }

    updateProperties() {
        this.selectProperties = this.propertyCheckboxes.filter((checkbox) => checkbox.nativeElement.checked).map((checkbox) => checkbox.nativeElement.name);

        console.log("Selected Properties:", this.selectProperties);
        if (this.currentPreviewContent !== undefined) {
            this.currentPreviewContent.selectProperties = this.selectProperties;
            this.currentPreviewContentRef.changeDetectorRef.detectChanges();
        }
    }

    public forwardToEditor() {
        this.chartService.chartType.next(this.chartType);
        if (this.previewResults.length > 0) {
            switch (this.chartType) {
                case "bar_chart":
                    this.dialogService.openBarChartEditor("create", "", this.queryParameters, this.selectProperties, "");
                    break;
                case "Stacked Bar Chart":
                    this.dialogService.openStackedBarChartEditor();
                    break;
                case "pie_chart":
                    this.dialogService.openPieChartEditor("create", "", this.queryParameters, this.selectProperties);
                    break;
                case "Doughnut Chart":
                    this.dialogService.openDoughnutChartEditor();
                    break;
                case "star_plot":
                    this.dialogService.openStarPlotEditor();
                    break;
                case "line_chart":
                    this.dialogService.openLineChartEditor();
                    break;
                default:
                    console.log("Invalid Chart Type");
                    this.dialogService.openSnackBar("Please choose a Visualization Type", "close");
            }
        } else {
            this.dialogService.openSnackBar("No database entries to visualize", "close");
        }
    }
}
