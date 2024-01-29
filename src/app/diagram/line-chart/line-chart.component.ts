import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from '../../services/chart.service';
import { TitleIconService } from "../../services/icon.sevice";
import { GridStackService } from "../../services/gridstack.service";

import * as d3 from 'd3';
import { SystemService } from "src/app/services/system.service";

@Component({
    selector: "app-line-chart",
})

export class LineChartComponent implements OnInit {
    constructor(
        private dialogService: DialogService,
        private chartService: ChartService,
        private titleIconService: TitleIconService,
        private gridService: GridStackService,
        private systemService: SystemService
    ) {}

    private svg: any;
    private g: any;
    private margin = 70;
    public barRemove = false;

    ngOnInit(): void {}

    public copeChartAction(action: string, tileSerial: string, title: string, dataSource: any[], heartColor: any, barColor: any): void {
        // console.log(dataSource);
        var lineEL = document.getElementById(tileSerial);

        if (action === "create" || action === "edit" || action === "load") {
            this.svg = d3
                .select("#" + tileSerial)
                .append("svg")
                .attr("width", lineEL.clientWidth)
                .attr("height", lineEL.clientHeight);
        } else if (action === "update") {
            this.svg = d3
                .select("#" + tileSerial)
                .select("svg")
                .attr("width", lineEL.clientWidth)
                .attr("height", lineEL.clientHeight);
        }

        if (tileSerial.includes("major")) {
            if (action === "create" || action === "edit" || action === "load") {
                this.addTitle(this.svg, lineEL, title);
                this.addPencil(this.svg, lineEL, tileSerial, title, heartColor, barColor);
                this.addDownload(this.svg, lineEL, title, dataSource, heartColor);
                this.addHeart(this.svg, lineEL, tileSerial, title, dataSource, heartColor, barColor);
                this.addTrash(this.svg, tileSerial, dataSource, lineEL.clientWidth - 36, 95);
            } else if (action === "update") {
                this.titleIconService.updateTitle(this.svg, lineEL, this.margin);
                this.titleIconService.updateIcons(this.svg, lineEL, heartColor);
            }
        } else {
            if (action === "create" || action === "load") {
                this.addTitle(this.svg, lineEL, title);
                this.addHeart(this.svg, lineEL, tileSerial, title, dataSource, heartColor, barColor);
            } else if (action === "update") {
                this.titleIconService.updateTitle(this.svg, lineEL, this.margin);
                this.titleIconService.updateHeart(this.svg, lineEL, "rgb(255, 0, 0)");
            }
        }

        this.titleIconService.hoverSVG(this.svg);

        const uniqueDates = [...new Set(dataSource.map((item) => new Date(item.date)))];
        var x = d3
            .scaleTime()
            .range([0, lineEL.clientWidth - this.margin * 2])
            .domain(d3.extent(uniqueDates));

        var y = d3
            .scaleLinear()
            .range([lineEL.clientHeight - this.margin * 2, 0])
            .domain([0, d3.max(dataSource, (d: any) => d.count)]);

        if (action === "create" || action === "edit" || action === "load") {
            this.g = this.svg.append("g").attr("transform", "translate(" + (this.margin + 10) + "," + this.margin + ")");
        }

        if (action === "create" || action === "edit" || action === "load") {
            this.g
                .append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (lineEL.clientHeight - this.margin * 2) + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("text-anchor", "middle");

            this.g.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

            this.g
                .selectAll("dot")
                .data(dataSource)
                .enter()
                .append("circle")
                .attr("cx", (d: any) => x(new Date(d.date)))
                .attr("cy", (d: any) => y(d.count))
                .attr("r", 3)
                .attr("class", "dot")
                .attr("fill", barColor)
                .on("mouseover", (d, i, nodes) => {
                    // Get the current dot element
                    var dot = d3.select(nodes[i]);

                    // Create the tooltip element
                    var tooltip = d3
                        .select("#" + tileSerial)
                        .append("div")
                        .attr("class", "tooltip")
                        .style("position", "absolute")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "1px")
                        .style("border-radius", "5px")
                        .style("padding", "10px")
                        .style("opacity", 0);

                    // Show the tooltip element
                    d3.select(".tooltip")
                        .html(`Date: ${new Date(d.date).toLocaleDateString()} <br> Count: ${d.count}`)
                        .transition()
                        .duration(200)
                        .style("opacity", 1);

                    // Change the color of the dot
                    dot.style("fill", "orange");

                    // Add a mousemove event listener to update the position of the tooltip element
                    d3.select("body").on("mousemove", () => {
                        var [x, y] = d3.mouse(nodes[i]);
                        // console.log(x, y);
                        tooltip.style("left", `${x + 30}px`).style("top", `${y}px`);
                    });
                })
                .on("mouseout", (d, i, nodes) => {
                    // Get the current dot element
                    var dot = d3.select(nodes[i]);

                    // Hide the tooltip element
                    d3.select(".tooltip").remove();

                    // Change the color of the dot back to the original color
                    dot.style("fill", barColor);
                });

            var valueline = d3
                .line()
                .x((d: any) => x(new Date(d.date)))
                .y((d: any) => y(d.count));
            this.g.append("path").data([dataSource]).attr("class", "line").attr("d", valueline).attr("fill", "none").attr("stroke", barColor);
    
        } else if (action === "update") {
            this.svg
                .select("g.x-axis")
                .attr("transform", "translate(0," + (lineEL.clientHeight - this.margin * 2) + ")")
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .selectAll("text")
                .style("text-anchor", "middle");

            this.svg.select("g.y-axis").call(d3.axisLeft(y));

            var dots = this.g.selectAll(".dot");
            dots.remove();

            this.g
                .selectAll("dot")
                .data(dataSource)
                .enter()
                .append("circle")
                .attr("cx", (d: any) => x(new Date(d.date)))
                .attr("cy", (d: any) => y(d.count))
                .attr("r", 3)
                .attr("class", "dot")
                .attr("fill", barColor);

            var valueline = d3
                .line()
                .x((d: any) => x(new Date(d.date)))
                .y((d: any) => y(d.count));

            // Remove the old line (comment out for a cool effect when resizing the tile)
            var line = this.g.selectAll(".line");
            line.remove();

            this.g.append("path").data([dataSource]).attr("class", "line").attr("d", valueline).attr("fill", "none").attr("stroke", barColor);
        }
    }

    // public createChart(): void {
    //     this.svg = d3.select("#dash-line").append("svg").attr("width", this.lineEL.clientWidth).attr("height", this.lineEL.clientHeight);

    //     var parseTime = d3.timeParse("%Y");

    //     data.forEach(function (d: any) {
    //         d.date = parseTime(d.date);
    //         d.value = +d.value;
    //     });


    //     var valueline = d3
    //         .line()
    //         .x((d: any) => this.x(d.date))
    //         .y((d: any) => this.y(d.value));

    //     g.append("path").data([data]).attr("class", "line").attr("d", valueline).attr("fill", "none").attr("stroke", "steelblue");
    // }

    // public updateChart(): void {
    //     // Update the SVG element size
    //     this.svg.attr("width", this.lineEL.clientWidth).attr("height", this.lineEL.clientHeight);

    //     this.svg
    //         .select("text.title")
    //         .attr("x", this.lineEL.clientWidth / 2)
    //         .attr("y", this.margin / 2 + 5);

    //     this.svg
    //         .select("foreignObject.pencil")
    //         .attr("x", this.lineEL.clientWidth - 38)
    //         .attr("y", 20);

    //     this.svg
    //         .select("foreignObject.download")
    //         .attr("x", this.lineEL.clientWidth - 38)
    //         .attr("y", 45);

    //     this.svg
    //         .select("foreignObject.heart")
    //         .attr("x", this.lineEL.clientWidth - 38)
    //         .attr("y", 70);

    //     this.svg
    //         .select("foreignObject.trash")
    //         .attr("x", this.lineEL.clientWidth - 36)
    //         .attr("y", 95);

    //     this.x.range([0, this.lineEL.clientWidth - this.margin * 2]);
    //     this.y.range([this.lineEL.clientHeight - this.margin * 2, 0]);

    //     this.svg
    //         .selectAll("g.x-axis")
    //         .attr("transform", "translate(0," + (this.lineEL.clientHeight - this.margin * 2) + ")")
    //         .call(d3.axisBottom(this.x))
    //         .selectAll("text")
    //         .style("text-anchor", "middle");

    //     this.svg.selectAll("g.y-axis").call(d3.axisLeft(this.y));

    //     this.svg
    //         .selectAll("circle")
    //         .attr("cx", (d: any) => this.x(d.date))
    //         .attr("cy", (d: any) => this.y(d.value));

    //     this.svg.selectAll(".line").attr(
    //         "d",
    //         d3
    //             .line()
    //             .x((d: any) => this.x(d.date))
    //             .y((d: any) => this.y(d.value))
    //     );
    // }

    private addTitle(svg, lineEL, title): void {
        this.titleIconService.createTitle(svg, lineEL.clientWidth / 2, this.margin / 2, title);
    }

    public addPencil(svg, lineEL, tileSerial, title, heartColor, barColor): void {
        this.titleIconService.createPencil(svg, lineEL.clientWidth - 38, 20, () => {
            this.dialogService.openLineChartEditor("edit", tileSerial, title, heartColor, barColor);
            this.chartService.chartType.next("line_chart");
        });
    }

    public addDownload(svg, lineEL, title, dataSource, heartColor): void {
        this.titleIconService.createDownload(svg, lineEL.clientWidth - 38, 45, () => {
            // this.chartService.saveJsonFile("line_chart", dataSource, title, undefined);
        });
    }

    public addHeart(svg, lineEL, tileSerial, title, dataSource, heartColor, barColor): void {
        const self = this;
        this.titleIconService.createHeart(svg, lineEL.clientWidth - 38, 70, heartColor, function () {
            var heart = d3.select(this).select("i");
            var tempTileSerial: string;
            if (heart.style("color") === "rgb(0, 0, 0)") {
                heart.style("color", "rgb(255, 0, 0)");
                console.log(tileSerial);
                self.gridService.tileSerialFavor.add(tileSerial);
                // self.chartService.removePersistence(tileSerial);
                // self.chartService.savePersistence('line_chart', tileSerial, dataSource, title, 'rgb(255, 0, 0)');
                tempTileSerial = self.gridService.getMinorTileSerial("line_chart", tileSerial);
                self.gridService.tileSerialMap.set(tileSerial, tempTileSerial);
                self.chartService.chartAction.next({ action: "favor", serial: tempTileSerial, title: title, barColor: barColor });
                self.chartService.chartType.next("line_chart");
                self.chartService.dataSource.next(dataSource);
                self.dialogService.openSnackBar("You have added this diagram into your favorites", "close");
            } else {
                heart.style("color", "rgb(0, 0, 0)");
                // self.chartService.removePersistence(tileSerial);
                // self.chartService.savePersistence('line_chart', tileSerial, dataSource, title, 'rgb(0, 0, 0)');
                self.chartService.chartAction.next({ action: "disfavor", serial: tileSerial, title: title, barColor: barColor });
                self.chartService.chartType.next("line_chart");
                self.chartService.dataSource.next(dataSource);
                self.dialogService.openSnackBar("You have removed this diagram from your favorites", "close");
            }
        });
    }

    public addTrash(svg, tileSerial, dataSource, x, y): void {
        this.titleIconService.createTrash(svg, x, y, () => {
            this.dialogService.openDeleteConfirmation("remove", tileSerial, dataSource, "Are you sure to delete this widget?");
        });
    }
}