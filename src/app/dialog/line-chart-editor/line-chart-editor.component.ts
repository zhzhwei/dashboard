import { Component, OnInit, ViewChild } from "@angular/core";
import { RdfDataService } from "../../services/rdf-data.service";
import { ChartService } from "../../services/chart.service";
import { SystemService } from "../../services/system.service";
import { SharedService } from "../../services/shared.service";
import { DialogService } from "src/app/services/dialog.service";
import { MatDialog } from "@angular/material/dialog";

import * as d3 from "d3";

@Component({
    selector: "app-line-chart-editor",
    templateUrl: "./line-chart-editor.component.html",
})
export class LineChartEditorComponent implements OnInit {
    public title: string;
    public tileSerial: string;
    public query: string;
    public dataSource: any;
    public mainResult: any[];
    public previewImage: boolean = true;
    public visibilityMapping: boolean[] = [];
    public barColor: string = "#4682B4";

    private svg: any;
    private margin = 60;
    private lineEL: any;
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
        console.log("tileSerial: ", this.tileSerial)
        if (this.tileSerial === "") {
            this.sharedService.results$.subscribe((results) => {
                this.mainResult = results;
                // localStorage.setItem(this.tileSerial, JSON.stringify({ dataSource: this.mainResult }));
                console.log("Received updated results:", this.mainResult);
            });
        } else {
            const storageItem = JSON.parse(localStorage.getItem(this.tileSerial));
            this.mainResult = storageItem.dataSource;
            console.log("Received updated results:", this.mainResult);
            this.createChart(this.mainResult);
        }
    }

    onColorChange(barColor: string): void {
        this.barColor = barColor;
        this.createChart(this.mainResult);
    }

    onTitleChange(title: string): void {
        console.log("title change")
        this.title = title;
        this.createChart(this.mainResult);
    }

    public addToDashboard(): void {
        this.chartService.chartAction.value.title = this.title;
        this.chartService.chartAction.value.barColor = this.barColor;
        if (this.chartService.chartAction.value.title && this.mainResult.length > 0) {
            this.chartService.dataSource.next(this.mainResult);
            var currentValue = this.chartService.chartAction.getValue();
            var updatedValue = Object.assign({}, currentValue, { title: this.title, barColor: this.barColor });
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
        if (dataSource.length > 0) {
            this.lineEL = document.getElementById("editor-line");

            while (this.lineEL.children.length > 3) {
                this.lineEL.removeChild(this.lineEL.lastChild);
            }
            if (dataSource.length < 15) {
                this.lineEL.style.height = "420px";
            } else {
                this.lineEL.style.height = dataSource.length * 24 + 90 + "px";
            }
            this.svg = d3.select("#editor-line").append("svg").attr("width", this.lineEL.clientWidth).attr("height", this.lineEL.clientHeight);

            var g = this.svg.append("g").attr("transform", "translate(" + (this.margin + 10) + "," + (this.margin - 20) + ")");

            // Create the X-axis band scale
            const uniqueDates = [...new Set(this.mainResult.map((item) => item.date))];
            this.x = d3
                .scaleTime()
                .range([0, this.lineEL.clientWidth - this.margin * 2])
                .domain(d3.extent(uniqueDates));

            // Draw the X-axis on the DOM
            g.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (this.lineEL.clientHeight - this.margin * 2) + ")")
                .call(d3.axisBottom(this.x))
                .selectAll("text")
                .style("text-anchor", "middle");

            // Create the Y-axis band scale
            this.y = d3
                .scaleLinear()
                .domain([0, d3.max(dataSource, (d: any) => d.count)])
                .range([this.lineEL.clientHeight - this.margin * 2, 0]);

            // Draw the Y-axis on the DOM
            g.append("g").attr("class", "y-axis").call(d3.axisLeft(this.y));

            // Create and fill the bars
            g.selectAll("dot")
                .data(dataSource)
                .enter()
                .append("circle")
                .attr("cx", (d: any) => this.x(d.date))
                .attr("cy", (d: any) => this.y(d.count))
                .attr("r", 3)
                .attr("fill", this.barColor);

            // Add line
            var valueline = d3
                .line()
                .x((d: any) => this.x(d.date))
                .y((d: any) => this.y(d.count));
            g.append("path").data([dataSource]).attr("class", "line").attr("d", valueline).attr("fill", "none").attr("stroke", this.barColor);

        } else {
            while (this.lineEL.children.length > 3) {
                this.lineEL.removeChild(this.lineEL.lastChild);
            }
            // this.dialogService.openSnackBar("Please enter the title and select at least one item.", "close");
        }
    }
}
