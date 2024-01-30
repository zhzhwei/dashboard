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
    public previewImage: boolean = true;
    public visibilityMapping: boolean[] = [];
    public barColor: string = "#4682B4";

    private svg: any;
    private margin = 60;
    private barEL: any;
    private x: any;
    private y: any;

    constructor(private dialogService: DialogService, private chartService: ChartService, private dialog: MatDialog, private systemService: SystemService, private sharedService: SharedService) {
        this.chartService.currentChartAction.subscribe((chartAction) => {
            this.title = chartAction.title;
            this.tileSerial = chartAction.serial;
            this.barColor = chartAction.barColor;
        });
    }

    ngOnInit(): void {
        if (this.tileSerial === "") {
            this.sharedService.results$.subscribe((results) => {
                this.mainResult = results;
                this.initialMainResult = [...results];
                // console.log("Received updated results:", this.mainResult);

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
            this.visibilityMapping = JSON.parse(localStorage.getItem(this.tileSerial + "-config"));
            this.mainResult = storageItem.dataSource;
            this.initialMainResult = [...this.mainResult];
            // console.log("Received updated results:", this.mainResult);
            this.list = this.mainResult.map((item, index) => {
                return {
                    id: index,
                    title: item.name,
                    checked: this.visibilityMapping[index],
                };
            });
            this.allChecked = this.list.every((item) => item.checked);
            this.createChart(this.initialMainResult);
        }
    }

    selectAll() {
        for (let item of this.list) {
            item.checked = this.allChecked;
        }
        this.updateCheckedItems();
        this.createChart(this.initialMainResult);
    }

    onColorChange(barColor: string): void {
        this.barColor = barColor;
        this.updateCheckedItems();
        if (this.mainResult.length > 0) {
            this.createChart(this.initialMainResult);
        }
    }

    onTitleChange(title: string): void {
        this.title = title;
        this.updateCheckedItems();
        if (this.mainResult.length > 0) {
            this.createChart(this.initialMainResult);
        }
    }

    onItemCheckedChange(item: any, isChecked: boolean): void {
        item.checked = isChecked;
        this.updateCheckedItems();
        this.createChart(this.initialMainResult);
        this.allChecked = this.list.every((item) => item.checked);
    }

    private updateCheckedItems(): void {
        this.checkedItems = this.list.filter((item) => item.checked === true);
        this.mainResult = this.initialMainResult.filter((item) => {
            return this.checkedItems.some((checkedItem) => {
                return checkedItem.title === item.name;
            });
        });
        this.visibilityMapping = [];
        for (let item of this.list) {
            this.visibilityMapping.push(item.checked);
        }
        localStorage.setItem("temp", JSON.stringify(this.visibilityMapping));
        // this.createChart(this.initialMainResult);
    }

    public addToDashboard(): void {
        this.chartService.chartAction.value.title = this.title;
        this.chartService.chartAction.value.barColor = this.barColor;
        if (this.chartService.chartAction.value.title && this.mainResult.length > 0) {
            this.updateCheckedItems();
            this.chartService.dataSource.next(this.initialMainResult);
            var currentValue = this.chartService.chartAction.getValue();
            var updatedValue = Object.assign({}, currentValue, { title: this.title, barColor: this.barColor});
            this.chartService.chartAction.next(updatedValue);
            this.dialog.closeAll();
        } else if (!this.chartService.chartAction.value.title && this.mainResult.length === 0) {
            // this.previewImage = false;
            this.dialogService.openSnackBar("Please enter the title and select at least one item", "close");
        } else if (!this.chartService.chartAction.value.title) {
            this.dialogService.openSnackBar("Please enter the title above", "close");
        } else if (this.mainResult.length === 0) {
            this.dialogService.openSnackBar("Please select at least one item", "close");
        }
    }

    public cancel(): void {
        this.dialog.closeAll();
    }

    private createChart(dataSource: any[]): void {

        let filteredDataSource = dataSource.filter((_, index) => this.visibilityMapping[index]);

        if (filteredDataSource.length > 0) {
            this.barEL = document.getElementById("editor-bar");
            // console.log("clientHeight", this.barEL.clientHeight)
            // console.log("clientWidth", this.barEL.clientWidth)

            while (this.barEL.children.length > 3) {
                this.barEL.removeChild(this.barEL.lastChild);
            }
            if (filteredDataSource.length < 15) {
                this.barEL.style.height = "420px";
            } else {
                this.barEL.style.height = filteredDataSource.length * 24 + 90 + "px";
            }
            this.svg = d3.select("#editor-bar").append("svg").attr("width", this.barEL.clientWidth).attr("height", this.barEL.clientHeight);

            var g = this.svg.append("g").attr("transform", "translate(" + (this.margin + 10) + "," + (this.margin) + ")");

            // Create the X-axis band scale
            this.x = d3
                .scaleBand()
                .range([0, this.barEL.clientWidth - this.margin * 2])
                .domain(filteredDataSource.map((d) => (this.systemService.skillAbbr[d.name] ? this.systemService.skillAbbr[d.name] : d.name)))
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
            var maxCount: number = d3.max(filteredDataSource, (d: any) => Number(d.count));
            // console.log("maxCount", maxCount);
            this.y = d3
                .scaleLinear()
                .domain([0, maxCount + 1])
                .range([this.barEL.clientHeight - this.margin * 2, 0]);

            // Draw the Y-axis on the DOM
            g.append("g").attr("class", "y-axis").call(d3.axisLeft(this.y));

            // Create and fill the bars
            g.selectAll("bars")
                .data(filteredDataSource)
                .enter()
                .append("rect")
                .attr("x", (d: any) => this.x(this.systemService.skillAbbr[d.name] ? this.systemService.skillAbbr[d.name] : d.name))
                .attr("y", (d: any) => this.y(d.count))
                .attr("width", this.x.bandwidth())
                .attr("height", (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.count))
                .attr("fill", this.barColor);
        } else {
            while (this.barEL.children.length > 3) {
                this.barEL.removeChild(this.barEL.lastChild);
            }
            // this.dialogService.openSnackBar("Please enter the title and select at least one item.", "close");
        }
    }
}
