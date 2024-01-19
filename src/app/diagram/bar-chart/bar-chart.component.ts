import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from '../../services/chart.service';
import { TitleIconService } from '../../services/icon.sevice';
import { GridStackService } from '../../services/gridstack.service';

import * as d3 from 'd3';

@Component({
    selector: 'app-bar-chart',
})

export class BarChartComponent implements OnInit {

    constructor(private dialogService: DialogService, private chartService: ChartService,
        private titleIconService: TitleIconService, private gridService: GridStackService) { }

    private svg: any;
    private g: any;
    private margin = 70;
    public barRemove = false;

    ngOnInit(): void { }

    public copeChartAction(action: string, tileSerial: string, jobName: string, dataSource: any[], titleCount: any, color: any): void {
        var barEL = document.getElementById(tileSerial);

        if (action === 'create' || action === 'edit' || action === 'load') {
            this.svg = d3.select('#' + tileSerial)
                .append('svg')
                .attr('width', barEL.clientWidth)
                .attr('height', barEL.clientHeight)
        } else if (action === 'update') {
            this.svg = d3.select('#' + tileSerial).select('svg')
                .attr('width', barEL.clientWidth)
                .attr('height', barEL.clientHeight)
        }

        if (tileSerial.includes('major')) {
            if (action === 'create' || action === 'edit' || action === 'load') {
                this.addTitle(this.svg, barEL, jobName, titleCount);
                this.addPencil(this.svg, barEL, tileSerial, jobName, titleCount, color);
                this.addDownload(this.svg, barEL, jobName, dataSource, titleCount, color);
                this.addHeart(this.svg, barEL, tileSerial, jobName, dataSource, titleCount, color);
                this.addTrash(this.svg, tileSerial, dataSource, barEL.clientWidth - 36, 95);
            } else if (action === 'update') {
                this.titleIconService.updateTitle(this.svg, barEL, this.margin);
                this.titleIconService.updateIcons(this.svg, barEL, color);
            }
        } else {
            if (action === 'create' || action === 'load') {
                this.addTitle(this.svg, barEL, jobName, titleCount);
                this.addHeart(this.svg, barEL, tileSerial, jobName, dataSource, titleCount, color);
            } else if (action === 'update') {
                this.titleIconService.updateTitle(this.svg, barEL, this.margin);
                this.titleIconService.updateHeart(this.svg, barEL, 'rgb(255, 0, 0)');
            }
        }

        this.titleIconService.hoverSVG(this.svg);

        var x = d3.scaleBand()
            .range([0, barEL.clientWidth - this.margin * 2])
            .domain(dataSource.map(d => d.skill))
            .padding(0.2);

        var maxSkillCount = d3.max(dataSource, (d: any) => d.skillCount);
        var y = d3.scaleLinear()
            .domain([0, maxSkillCount + 1])
            .range([barEL.clientHeight - this.margin * 2, 0]);

        if (action === 'create' || action === 'edit' || action === 'load') {
            this.g = this.svg.append('g')
                .attr('transform', 'translate(' + (this.margin + 10) + ',' + this.margin + ')');
        }

        if (action === 'create' || action === 'edit' || action === 'load') {
            this.g.append('g')
                .attr('class', 'x-axis')
                .attr('transform', 'translate(0,' + (barEL.clientHeight - this.margin * 2) + ')')
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .selectAll('text')
                .style('text-anchor', 'middle');

            this.g.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y))

            this.g.selectAll('bars')
                .data(dataSource)
                .enter()
                .append('rect')
                .attr('x', (d: any) => x(d.skill))
                .attr('y', (d: any) => y(d.skillCount))
                .attr('width', x.bandwidth())
                .attr('height', (d: any) => barEL.clientHeight - this.margin * 2 - y(d.skillCount))
                .attr('fill', 'steelblue')
                .on('mouseover', (d, i, nodes) => {
                    // Get the current bar element
                    var bar = d3.select(nodes[i]);

                    // Create the tooltip element
                    var tooltip = d3.select('#' + tileSerial)
                        .append('div')
                        .attr('class', 'tooltip')
                        .style('position', 'absolute')
                        .style('background-color', 'white')
                        .style('border', 'solid')
                        .style('border-width', '1px')
                        .style('border-radius', '5px')
                        .style('padding', '10px')
                        .style('opacity', 0);

                    // Show the tooltip element
                    d3.select('.tooltip')
                        // .text(`${d.skill}: ${d.skillCount}`)
                        .html(`Fertigkeit: ${d.skill} <br> Häufigkeit: ${d.skillCount}`)
                        .transition()
                        .duration(200)
                        .style('opacity', 1);

                    // Change the color of the bar
                    bar.style('fill', 'orange');

                    // Add a mousemove event listener to update the position of the tooltip element
                    d3.select('body')
                        .on('mousemove', () => {
                            var [x, y] = d3.mouse(nodes[i]);
                            // console.log(x, y);
                            tooltip.style('left', `${x + 30}px`)
                                .style('top', `${y}px`);
                        });
                })
                .on('mouseout', (d, i, nodes) => {
                    // Get the current bar element
                    var bar = d3.select(nodes[i]);

                    // Hide the tooltip element
                    d3.select('.tooltip').remove();

                    // Change the color of the bar back to the original color
                    bar.style('fill', 'steelblue');
                });
        } else if (action === 'update') {
            this.svg.select('g.x-axis')
                .attr('transform', 'translate(0,' + (barEL.clientHeight - this.margin * 2) + ')')
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .selectAll('text')
                .style('text-anchor', 'middle');

            this.svg.select('g.y-axis')
                .call(d3.axisLeft(y));

            this.svg.selectAll('rect')
                .attr('x', (d: any) => x(d.skill))
                .attr('y', (d: any) => y(d.skillCount))
                .attr('width', x.bandwidth())
                .attr('height', (d: any) => barEL.clientHeight - this.margin * 2 - y(d.skillCount));
        }

    }

    private addTitle(svg, barEL, jobName, titleCount): void {
        this.titleIconService.createTitle(svg, barEL.clientWidth / 2, this.margin / 2,
            `${jobName}` + " " + `${titleCount}` + " Stellenangebote");
    }

    public addPencil(svg, barEL, tileSerial, jobName, titleCount, color): void {
        this.titleIconService.createPencil(svg, barEL.clientWidth - 38, 20, () => {
            this.dialogService.openBarChartEditor('edit', tileSerial, jobName, titleCount, color);
            this.chartService.chartType.next('Bar Chart');
        });
    }

    public addDownload(svg, barEL, jobName, dataSource, titleCount, color): void {
        this.titleIconService.createDownload(svg, barEL.clientWidth - 38, 45, () => {
            this.chartService.saveJsonFile('Bar Chart', dataSource, jobName, titleCount);
        });
    }

    public addHeart(svg, barEL, tileSerial, jobName, dataSource, titleCount, color): void {
        const self = this;
        this.titleIconService.createHeart(svg, barEL.clientWidth - 38, 70, color, function () {
            var heart = d3.select(this).select('i');
            var tempTileSerial: string;
            if (heart.style('color') === 'rgb(0, 0, 0)') {
                heart.style('color', 'rgb(255, 0, 0)');
                console.log(tileSerial);  
                self.gridService.tileSerialFavor.add(tileSerial);
                // self.chartService.removePersistence(tileSerial);
                // self.chartService.savePersistence('Bar Chart', tileSerial, dataSource, jobName, titleCount, 'rgb(255, 0, 0)');  
                tempTileSerial = self.gridService.getMinorTileSerial('Bar Chart', tileSerial);
                self.gridService.tileSerialMap.set(tileSerial, tempTileSerial);
                self.chartService.chartAction.next({ action: 'favor', serial: tempTileSerial, jobName: jobName, titleCount: titleCount });
                self.chartService.chartType.next('Bar Chart');
                self.chartService.dataSource.next(dataSource);  
                self.dialogService.openSnackBar('You have added this diagram into your favorites', 'close');
            } else {
                heart.style('color', 'rgb(0, 0, 0)');
                // self.chartService.removePersistence(tileSerial);
                // self.chartService.savePersistence('Bar Chart', tileSerial, dataSource, jobName, titleCount, 'rgb(0, 0, 0)');
                self.chartService.chartAction.next({ action: 'disfavor', serial: tileSerial, jobName: jobName, titleCount: titleCount });
                self.chartService.chartType.next('Bar Chart');
                self.chartService.dataSource.next(dataSource); 
                self.dialogService.openSnackBar('You have removed this diagram from your favorites', 'close');
            }
        });
    }

    public addTrash(svg, tileSerial, dataSource, x, y): void {
        this.titleIconService.createTrash(svg, x, y, () => {
            this.dialogService.openDeleteConfirmation('remove', tileSerial, dataSource, 'Are you sure to delete this widget?');
        });
    }

}