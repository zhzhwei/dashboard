import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from '../../services/chart.service';
import { TitleIconService } from '../../services/icon.sevice';

import * as d3 from 'd3';

@Component({
    selector: 'app-bar-chart',
})

export class BarChartComponent implements OnInit {

    constructor(private dialogService: DialogService, private chartService: ChartService,
        private titleIconService: TitleIconService) { }

    private svg: any;
    private g: any;
    private margin = 70;
    public barRemove = false;

    ngOnInit(): void { }

    public copeChartAction(tileSerial: string, jobName: string, dataSource: any[], titleCount: any, action: string): void {
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

        if (action === 'create' || action === 'edit' || action === 'load') {
            this.addTitleIcon(this.svg, barEL, tileSerial, jobName, dataSource, titleCount);
        } else if (action === 'update') {
            this.titleIconService.updateTitleIcon(this.svg, barEL, this.margin);
        }

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

    private addTitleIcon(svg, barEL, tileSerial, jobName, dataSource, titleCount): void {   
        this.titleIconService.createTitle(svg, barEL.clientWidth / 2, this.margin / 2, `${jobName}` + " --- " + `${titleCount}` + " Stellenangebote");
        
        this.titleIconService.createIcon(svg, barEL.clientWidth - 38, 20, 'pencil', () => {
            this.dialogService.openBarChartEditor('edit', tileSerial, jobName, titleCount);
            this.chartService.chartType.next('Bar Chart');
        });

        this.titleIconService.createIcon(svg, barEL.clientWidth - 38, 45, 'download', () => {
            this.chartService.saveJsonFile('Bar Chart', dataSource, jobName, titleCount);
        });

        const self = this;
        this.titleIconService.createIcon(svg, barEL.clientWidth - 38, 70, 'heart', function () {
            const heart = d3.select(this).select('i');
            if (heart.style('color') === 'red') {
                heart.style('color', '');
                self.chartService.chartFavorite.next({ type: 'Bar Chart', serial: tileSerial, favorite: false });
                self.dialogService.openSnackBar('You have removed this diagram from your favorites', 'close');
            } else {
                heart.style('color', 'red');
                self.chartService.chartFavorite.next({ type: 'Bar Chart', serial: tileSerial, favorite: true });
                self.dialogService.openSnackBar('You have added this diagram into your favorites', 'close');
            }
        });

        this.titleIconService.createIcon(svg, barEL.clientWidth - 36, 95, 'trash', () => {
            this.dialogService.openDeleteConfirmation('remove', tileSerial, dataSource);
            this.chartService.chartType.next('remove');
        });

        this.titleIconService.hoverSVG(svg);
    }

}