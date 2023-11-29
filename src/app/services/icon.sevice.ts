import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { ChartService } from './chart.service';
import * as d3 from 'd3';

@Injectable({
    providedIn: 'root'
})
export class IconService {

    constructor(private dialogService: DialogService, private chartService: ChartService) { }

    createIcon(svg, className, x, y, icon, chartType, tileSerial, jobName, dataSource, parameter) {
        const self = this;
        const iconHandlers = {
            'pencil': function() {
                if (chartType === 'Bar Chart') {
                    self.dialogService.openBarChartEditor('Edit');
                } else if (chartType === 'Pie Chart') {
                    self.dialogService.openPieChartEditor('Edit');
                }
                self.chartService.chartType.next(chartType);
            },
            'download': function() {
                self.chartService.saveJsonFile(chartType, jobName, dataSource, parameter);
            },
            'heart': function() {
                const heart = d3.select(this).select('i');
                if (heart.style('color') === 'red') {
                    heart.style('color', '');
                    self.chartService.diagramFavorite.next({ type: chartType, serial: tileSerial, favorite: false });
                    self.dialogService.openSnackBar('You have removed this diagram from your favorites', 'close');
                } else {
                    heart.style('color', 'red');
                    self.chartService.diagramFavorite.next({ type: chartType, serial: tileSerial, favorite: true });
                    self.dialogService.openSnackBar('You have added this diagram into your favorites', 'close');
                }
            },
            'trash': function() {
                self.dialogService.openDeleteConfirmation(chartType, tileSerial);
            }
        };

        svg.append('foreignObject')
            .attr('class', className)
            .attr('x', x)
            .attr('y', y)
            .attr('width', 25)
            .attr('height', 25)
            .html(`<i class="fas fa-${icon}"></i>`)
            .on('click', iconHandlers[icon]);
    }

}