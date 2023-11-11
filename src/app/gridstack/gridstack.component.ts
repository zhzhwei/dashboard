import { Component, OnInit, ViewChild } from '@angular/core';
import { GridStack } from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import { BarChartComponent } from '../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../diagram/star-plot/star-plot.component';
import { PieChartComponent } from '../diagram/pie-chart/pie-chart.component';

import { ChartService } from '../services/chart.service';
declare var ResizeObserver: any;

@Component({
    selector: 'app-gridstack',
    templateUrl: './gridstack.component.html',
    styleUrls: ['./gridstack.component.css']
})

export class GridStackComponent implements OnInit {
    @ViewChild(BarChartComponent) barChart: BarChartComponent;
    @ViewChild(StackedBarChartComponent) stackedChart: StackedBarChartComponent;
    @ViewChild(StarPlotComponent) starPlot: StarPlotComponent;
    @ViewChild(PieChartComponent) pieChart: PieChartComponent;

    private grid: GridStack;
    private serializedData: any[] = []
    private itemEl: any;

    public barContEl: any;
    public stackedBarContEl: any;
    public starContEl: any;
    public pieContEl: any;

    private chartType: string;

    constructor(private chartService: ChartService) {
        this.chartService.currentChartType.subscribe(chartType => {
            // console.log(chartType);
            this.chartType = chartType;
            this.genVis();
        });
    }

    ngOnInit(): void {
        const options = {
            margin: 5,
            column: 12,
            disableOneColumnMode: true,
            acceptWidgets: true,
            removable: '#trash',
            removeTimeout: 100
        };

        GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });

        this.grid = GridStack.init(options);

        this.serializedData = [
            { x: 0, y: 0, w: 4, h: 3, minW: 4, minH: 3, content: 'Bar Chart', name: 'bar chart' },
            { x: 4, y: 0, w: 4, h: 6, minW: 4, minH: 4, content: 'Stacked Bar Chart', name: 'stacked bar chart' },
            { x: 8, y: 0, w: 4, h: 6, content: 'Star Plot', name: 'star plot' },
            { x: 0, y: 2, w: 4, h: 3, content: 'Pie Chart', name: 'pie chart' }
        ];

        this.grid.load(this.serializedData);

        // Load the serialized data into the grid
        this.serializedData.forEach(item => {
            // check item.name and set id accordingly
            switch (item.name) {
                case 'bar chart':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'bar chart');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.barContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.barContEl.setAttribute('id', 'bar');
                    break;
                case 'stacked bar chart':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'stacked bar chart');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.stackedBarContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.stackedBarContEl.setAttribute('id', 'stacked-bar');
                    break;
                case 'star plot':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'star plot');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.starContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.starContEl.setAttribute('id', 'star');
                    break;
                case 'pie chart':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'pie chart');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.pieContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.pieContEl.setAttribute('id', 'pie');
                    break;
            }
        });

        let prevSize = [
            { width: this.barContEl.offsetWidth, height: this.barContEl.offsetHeight },
            { width: this.stackedBarContEl.offsetWidth, height: this.stackedBarContEl.offsetHeight },
            { width: this.starContEl.offsetWidth, height: this.starContEl.offsetHeight },
            { width: this.pieContEl.offsetWidth, height: this.pieContEl.offsetHeight }
        ];

        // Create a new ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                switch (entry.target.id) {
                    case 'bar':
                        if (Math.abs(width - prevSize[0].width) > 10 || Math.abs(height - prevSize[0].height) > 10) {
                            console.log('gridstack item content was resized');
                            this.barChart.updateChart();
                        }
                        break;
                    case 'stacked-bar':
                        if (Math.abs(width - prevSize[1].width) > 10 || Math.abs(height - prevSize[1].height) > 10) {
                            console.log('gridstack item content was resized');
                            this.stackedChart.updateChart();
                        }
                        break;
                    case 'star':
                        if (Math.abs(width - prevSize[2].width) > 10 || Math.abs(height - prevSize[2].height) > 10) {
                            console.log('gridstack item content was resized');
                            this.starPlot.updateChart();
                        }
                        break;
                    case 'pie':
                        if (Math.abs(width - prevSize[3].width) > 10 || Math.abs(height - prevSize[3].height) > 10) {
                            console.log('gridstack item content was resized');
                            this.pieChart.updateChart();
                        }
                        break;
                }
            }
        });

        // Observe the element for size changes
        resizeObserver.observe(this.barContEl);
        resizeObserver.observe(this.stackedBarContEl);
        resizeObserver.observe(this.starContEl);
        resizeObserver.observe(this.pieContEl);
    }

    public genVis() {
        switch (this.chartType) {
            case 'Bar Chart':
                this.barChart.createChart(this.barChart.werkzeugData);
                break;
            case 'Stacked Bar Chart':
                this.stackedChart.createChart(this.stackedChart.data);
                break;
            case 'Star Plot':
                this.starPlot.createChart();
                break;
            case 'Pie Chart':
                this.pieChart.createChart(this.pieChart.data);
                break;
            default:
                console.log('Invalid Chart Type');
        }
    }

}