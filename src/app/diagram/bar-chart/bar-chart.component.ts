import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from '../../services/chart.service';
import { IconService } from 'src/app/services/icon.sevice';

import * as d3 from 'd3';

@Component({
    selector: 'app-bar-chart',
})

export class BarChartComponent implements OnInit {

    constructor(private dialogService: DialogService, private chartService: ChartService,
        private iconService: IconService) { }

    // private svg: any;
    private margin = 70;
    // private barEL: any;
    // private x: any;
    // private y: any;
    public barRemoved = false;

    ngOnInit(): void { }

    public createChart(tileSerial: string, jobName: string, dataSource: any[], titleCount: any): void {
        var barEL = document.getElementById(tileSerial);
        // console.log(barEL.clientWidth, barEL.clientHeight);

        // Clear the item's content
        while (barEL.firstChild) {
            // console.log(barEL.firstChild);
            barEL.removeChild(barEL.firstChild);
        }

        var svg = d3.select('#' + tileSerial)
            .append('svg')
            .attr('width', barEL.clientWidth)
            .attr('height', barEL.clientHeight)

        var g = svg.append('g')
            .attr('transform', 'translate(' + (this.margin + 10) + ',' + this.margin + ')');

        this.iconService.createTitle(svg, barEL.clientWidth / 2, this.margin / 2, `${jobName}` + " --- " + `${titleCount}` + " Stellenangebote");
        
        this.iconService.createIcon(svg, barEL.clientWidth - 38, 20, 'pencil', () => {
            this.dialogService.openBarChartEditor('Edit', tileSerial, jobName, titleCount);
            this.chartService.chartType.next('Bar Chart');
        });

        this.iconService.createIcon(svg, barEL.clientWidth - 38, 45, 'download', () => {
            this.chartService.saveJsonFile('Bar Chart', dataSource, jobName, titleCount);
        });

        const self = this;
        this.iconService.createIcon(svg, barEL.clientWidth - 38, 70, 'heart', function () {
            const heart = d3.select(this).select('i');
            if (heart.style('color') === 'red') {
                heart.style('color', '');
                self.chartService.diagramFavorite.next({ type: 'Bar Chart', serial: tileSerial, favorite: false });
                self.dialogService.openSnackBar('You have removed this diagram from your favorites', 'close');
            } else {
                heart.style('color', 'red');
                self.chartService.diagramFavorite.next({ type: 'Bar Chart', serial: tileSerial, favorite: true });
                self.dialogService.openSnackBar('You have added this diagram into your favorites', 'close');
            }
        });

        this.iconService.createIcon(svg, barEL.clientWidth - 36, 95, 'trash', () => {
            this.dialogService.openDeleteConfirmation('Bar Chart', tileSerial);
        });

        this.iconService.hoverSVG(svg);

        // Create the X-axis band scale
        var x = d3.scaleBand()
            .range([0, barEL.clientWidth - this.margin * 2])
            .domain(dataSource.map(d => d.skill))
            .padding(0.2);

        // Draw the X-axis on the DOM
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + (barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll('text')
            // .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'middle');

        // Create the Y-axis band scale
        var maxSkillCount = d3.max(dataSource, (d: any) => d.skillCount);
        var y = d3.scaleLinear()
            .domain([0, maxSkillCount + 1])
            .range([barEL.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y))

        // Create and fill the bars
        g.selectAll('bars')
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

    }

    public updateChart(tileSerial: string, dataSource: any[]): void {
        var barEL = document.getElementById(tileSerial);

        var svg = d3.select('#' + tileSerial).select('svg')
            .attr('width', barEL.clientWidth)
            .attr('height', barEL.clientHeight)

        svg.select("text.title")
            .attr("x", (barEL.clientWidth / 2))
            .attr("y", this.margin / 2)

        svg.select('foreignObject.pencil')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 20)

        svg.select('foreignObject.download')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 45)

        svg.select('foreignObject.heart')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 70)

        svg.select('foreignObject.trash')
            .attr('x', barEL.clientWidth - 36)
            .attr('y', 95)

        // Update the X-axis scale range
        var x = d3.scaleBand()
            .range([0, barEL.clientWidth - this.margin * 2])
            .domain(dataSource.map(d => d.skill))
            .padding(0.2);

        // Redraw the X-axis on the DOM
        svg.select('g.x-axis')
            .attr('transform', 'translate(0,' + (barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll('text')
            // .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'middle');

        // Update the Y-axis scale range
        var maxSkillCount = d3.max(dataSource, (d: any) => d.skillCount);
        var y = d3.scaleLinear()
            .domain([0, maxSkillCount + 1])
            .range([barEL.clientHeight - this.margin * 2, 0]);
            
        // Redraw the Y-axis on the DOM
        svg.select('g.y-axis')
            .call(d3.axisLeft(y));

        // Redraw the bars on the DOM
        svg.selectAll('rect')
            .attr('x', (d: any) => x(d.skill))
            .attr('y', (d: any) => y(d.skillCount))
            .attr('width', x.bandwidth())
            .attr('height', (d: any) => barEL.clientHeight - this.margin * 2 - y(d.skillCount));
    }

}