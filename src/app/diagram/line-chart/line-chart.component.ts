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
    ) { }

    private svg: any;
    private g: any;
    private margin = 70;
    public barRemove = false;

    ngOnInit(): void { }

    public copeChartAction(action: string, tileSerial: string, title: string, dataSource: any[], heartColor: any, barColor: any): void {
        // console.log(dataSource);
        var lineEL = document.getElementById(tileSerial);
        if (action === "create" || action === "edit" || action === "load") {
            this.svg = d3.select("#" + tileSerial).append("svg")
                .attr("width", lineEL.clientWidth)
                .attr("height", lineEL.clientHeight);
        } else if (action === "update") {
            this.svg = d3.select("#" + tileSerial).select("svg")
                .attr("width", lineEL.clientWidth)
                .attr("height", lineEL.clientHeight);
        }

        if (tileSerial.includes("major")) {
            if (action === "create" || action === "edit" || action === "load") {
                this.addTitle(this.svg, lineEL, title);
                this.addPencil(this.svg, lineEL, tileSerial, title, heartColor, barColor);
                this.addDownload(this.svg, lineEL, tileSerial, title, dataSource, barColor);
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
        var x = d3.scaleTime()
            .range([0, lineEL.clientWidth - this.margin * 2])
            .domain(d3.extent(uniqueDates));

        var y = d3.scaleLinear()
            .range([lineEL.clientHeight - this.margin * 2, 0])
            .domain([0, d3.max(dataSource, (d: any) => d.count)]);

        if (action === "create" || action === "edit" || action === "load") {
            this.g = this.svg.append("g").attr("transform", "translate(" + (this.margin + 10) + "," + this.margin + ")");
        }

        if (action === "create" || action === "edit" || action === "load") {
            this.g.append("g")
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
                .attr("r", 5)
                .attr("class", "dot")
                .attr("fill", barColor);

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
            this.svg
                .selectAll("circle")
                .data(dataSource)
                .attr("cx", (d: any) => x(new Date(d.date)))
                .attr("cy", (d: any) => y(d.count))
                .attr("fill", barColor)
                .on("mouseover", function(d, i, nodes) {
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

                    d3.select(".tooltip")
                        .html(`Date: ${new Date(d.date).toLocaleDateString()} <br> Count: ${d.count}`)
                        .transition()
                        .duration(200)
                        .style("opacity", 1);
                    
                    d3.select("body").on("mousemove", () => {
                        var [x, y] = d3.mouse(nodes[i]);
                        tooltip.style("left", `${x + 30}px`).style("top", `${y}px`);
                    });

                    d3.select(this).attr("fill", "orange").attr("r", 10);
                })
                .on("mouseout", function(d) {
                    d3.select(this).attr("fill", barColor).attr("r", 4);
                    d3.select(".tooltip").remove();
                });

            var valueline = d3
                .line()
                .x((d: any) => x(new Date(d.date)))
                .y((d: any) => y(d.count));
            this.svg.select("path.line").data([dataSource]).attr("d", valueline).attr("fill", "none").attr("stroke", barColor);
        }
    }

    private addTitle(svg, lineEL, title): void {
        this.titleIconService.createTitle(svg, lineEL.clientWidth / 2, this.margin / 2, title);
    }

    public addPencil(svg, lineEL, tileSerial, title, heartColor, barColor): void {
        this.titleIconService.createPencil(svg, lineEL.clientWidth - 38, 20, () => {
            this.dialogService.openLineChartEditor("edit", tileSerial, title, heartColor, barColor);
            this.chartService.chartType.next("line_chart");
        });
    }

    public addDownload(svg, lineEL, tileSerial, title, dataSource, barColor): void {
        this.titleIconService.createDownload(svg, lineEL.clientWidth - 38, 45, () => {
            this.chartService.saveJsonFile("line_chart", dataSource, null, title, barColor);
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
                self.chartService.dataSource.next(JSON.parse(localStorage.getItem(tileSerial)).dataSource);
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