import { Component, OnInit, ViewChild } from "@angular/core";
import { RdfDataService } from "../../services/rdf-data.service";
import { ChartService } from "../../services/chart.service";
import { SystemService } from "../../services/system.service";
import { SharedService } from "../../services/shared.service";
import { DialogService } from "src/app/services/dialog.service";
import { MatDialog } from "@angular/material/dialog";
import * as d3 from "d3";

@Component({
    selector: "app-bar-chart-editor",
    templateUrl: "./bar-chart-editor.component.html",
    styleUrls: ["./bar-chart-editor.component.css"],
})
export class BarChartEditorComponent implements OnInit {
    public title: string;
    public tileSerial: string;
    public query: string;
    public skills: any;
    public results: any;
    public list: any;
    public checkedItems: any;
    public dataSource: any;
    public allChecked = false;
    public titleQuery: string;
    public skillQuery: string;
    public skillQueries: string[];
    public mainResult: any[];
    public initialMainResult: any[];

    private svg: any;
    private margin = 60;
    private barEL: any;
    private x: any;
    private y: any;

    constructor(private dialogService: DialogService, private chartService: ChartService, private dialog: MatDialog, private systemService: SystemService, private sharedService: SharedService) {
        this.chartService.currentChartAction.subscribe((chartAction) => {
            this.title = chartAction.title;
            this.tileSerial = chartAction.serial;
        });
    }

    ngOnInit(): void {
        if (this.tileSerial === "") {
            this.sharedService.results$.subscribe((results) => {
                this.mainResult = results;
                this.initialMainResult = [...results];
                // localStorage.setItem(this.tileSerial, JSON.stringify({ dataSource: this.initialMainResult }));
                console.log("Received updated results:", this.mainResult);

                this.list = this.mainResult.map((item, index) => {
                    return {
                        id: index,
                        title: item.name,
                        checked: false,
                    };
                });
            });
        } else {
            const storageItem = JSON.parse(localStorage.getItem(this.tileSerial));
            this.mainResult = storageItem.dataSource;
            this.initialMainResult = [...this.mainResult];
            console.log("Received updated results:", this.mainResult);
            this.list = this.mainResult.map((item, index) => {
                return {
                    id: index,
                    title: item.name,
                    checked: false,
                };
            });
            this.createChart(this.title, this.mainResult);
        }
    }

    backToVisGen(): void {
        this.dialog.closeAll();
        this.dialogService.openVisGenDialog();
    }

    backToDashboard(): void {
        this.dialog.closeAll();
    }

    selectAll() {
        for (let item of this.list) {
            item.checked = this.allChecked;
        }
    }

    public applyChanges(): void {
        this.checkedItems = this.list.filter((item) => item.checked === true);
        this.mainResult = this.initialMainResult.filter((item) => {
            return this.checkedItems.some((checkedItem) => {
                return checkedItem.title === item.name;
            });
        });
        // this.skillQuery =
        //     this.rdfDataService.prefixes +
        //     `
        //     select (count(?s) as ?skillCount) where {
        //         ?s rdf:type edm:JobPosting.
        //         ?s edm:title ?title.
        //         filter contains(?title, "${this.jobName}").
        //         ?s edm:hasSkill ?skill.
        //         ?skill edm:textField ?skillName.
        //         filter (lang(?skillName) = "de").
        //         filter (?skillName = "skillName"@de).
        //     }
        // `;
        // this.skillQueries = this.checkedItems.map((item) => {
        //     return this.skillQuery.replace('"skillName"@de', `"${item.title}"@de`);
        // });
        // this.dataSource = this.checkedItems.map((item) => {
        //     return {
        //         skill: item.title,
        //     };
        // });
        // let promises = this.skillQueries.map((query, index) => {
        //     return this.rdfDataService
        //         .getQueryResults(query)
        //         .then((data) => {
        //             this.results = data.results.bindings;
        //             this.dataSource[index].skillCount = Number(this.results[0].skillCount.value);
        //         })
        //         .catch((error) => console.error(error));
        // });

        // Promise.all(promises).then(() => {
        //     // this.dataSource.forEach(item => {
        //     //     console.log(item.skill, item.skillCount);
        //     // });
        // this.mainResult.forEach((item) => {
        //     item.name = this.systemService.skillAbbr[item.name];
        // });
        this.chartService.dataSource.next(this.mainResult); //?
        this.chartService.updateTitle(this.title);
        this.createChart(this.title, this.mainResult);
        // });
    }

    private createChart(title: string, dataSource: any[]): void {
        if (title && dataSource.length > 0) {
            this.barEL = document.getElementById("editor-bar");
            console.log("clientHeight", this.barEL.clientHeight)
            console.log("clientWidth", this.barEL.clientWidth)

            while (this.barEL.children.length > 2) {
                this.barEL.removeChild(this.barEL.lastChild);
            }
            if (dataSource.length < 15) {
                this.barEL.style.height = "420px";
            } else {
                this.barEL.style.height = dataSource.length * 24 + 90 + "px";
            }
            this.svg = d3.select("#editor-bar").append("svg").attr("width", this.barEL.clientWidth).attr("height", this.barEL.clientHeight);

            var g = this.svg.append("g").attr("transform", "translate(" + (this.margin + 10) + "," + (this.margin - 20) + ")");

            // this.svg
            //     .append("text")
            //     .attr("class", "title")
            //     .attr("x", this.barEL.clientWidth / 2)
            //     .attr("y", this.margin / 2 + 15)
            //     .attr("text-anchor", "middle")
            //     .style("font-size", "16px")
            //     .text(title);

            // Create the X-axis band scale
            this.x = d3
                .scaleBand()
                .range([0, this.barEL.clientWidth - this.margin * 2])
                .domain(dataSource.map((d) => d.name))
                .padding(0.2);

            // Draw the X-axis on the DOM
            g.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (this.barEL.clientHeight - this.margin * 2) + ")")
                .call(d3.axisBottom(this.x).tickSizeOuter(0))
                .selectAll("text")
                // .attr('transform', 'translate(-10,0)rotate(-45)')
                .style("text-anchor", "middle");

            // Create the Y-axis band scale
            var maxCount: number = d3.max(dataSource, (d: any) => Number(d.count));
            console.log("maxCount", maxCount);
            this.y = d3
                .scaleLinear()
                .domain([0, maxCount + 1])
                .range([this.barEL.clientHeight - this.margin * 2, 0]);

            // Draw the Y-axis on the DOM
            g.append("g").attr("class", "y-axis").call(d3.axisLeft(this.y));

            // Create and fill the bars
            g.selectAll("bars")
                .data(dataSource)
                .enter()
                .append("rect")
                .attr("x", (d: any) => this.x(d.name))
                .attr("y", (d: any) => this.y(d.count))
                .attr("width", this.x.bandwidth())
                .attr("height", (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.count))
                .attr("fill", "steelblue");
        } else {
            this.dialogService.openSnackBar("Please enter the title and select at least one item.", "close");
        }
    }
}
