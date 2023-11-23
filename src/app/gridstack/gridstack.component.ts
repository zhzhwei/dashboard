import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent } from '../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../diagram/star-plot/star-plot.component';
import { PieChartComponent } from '../diagram/pie-chart/pie-chart.component';
import { DoughnutComponent } from '../diagram/doughnut/doughnut.component';
import 'gridstack/dist/h5/gridstack-dd-native';
import { combineLatest } from 'rxjs';
import { GridStack, GridStackElement } from 'gridstack';

import { ChartService } from '../services/chart.service';
declare var ResizeObserver: any;

@Component({
    selector: 'app-gridstack',
    templateUrl: './gridstack.component.html',
})

export class GridStackComponent implements OnInit {
    @ViewChild(BarChartComponent) barChart: BarChartComponent;
    @ViewChild(StackedBarChartComponent) stackedChart: StackedBarChartComponent;
    @ViewChild(StarPlotComponent) starPlot: StarPlotComponent;
    @ViewChild(PieChartComponent) pieChart: PieChartComponent;
    @ViewChild(DoughnutComponent) donutChart: DoughnutComponent;

    private grid: GridStack;
    private serializedData: any[] = []
    private itemEl: any;
    public titleCount: number;

    public barContEl: any;
    public stackedBarContEl: any;
    public starContEl: any;
    public pieContEl: any;
    public donutContEl: any;

    constructor(private chartService: ChartService) {
        
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

        // GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });

        this.grid = GridStack.init(options);

        this.serializedData = [
            { x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 4, content: 'Bar Chart', name: 'bar chart' },
            { x: 4, y: 0, w: 4, h: 4, minW: 4, minH: 4, content: 'Stacked Bar Chart', name: 'stacked bar chart' },
            { x: 8, y: 0, w: 4, h: 5, minW: 4, minH: 5, content: 'Star Plot', name: 'star plot' },
            { x: 0, y: 3, w: 4, h: 3, minW: 3, minH: 3, content: 'Pie Chart', name: 'pie chart' },
            { x: 8, y: 5, w: 4, h: 6, minW: 4, minH: 6, content: 'Star Plots', name: 'star plots' },
            { x: 4, y: 4, w: 4, h: 2, minW: 4, minH: 3, content: 'Line Chart', name: 'line Chart' },
            { x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3, content: 'Doughnut', name: 'doughnut' },
            { x: 4, y: 6, w: 4, h: 4, minW: 4, minH: 4, content: 'Line Charts', name: 'line Charts' },
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
                    this.barContEl.setAttribute('id', 'dash-bar');
                    break;
                case 'stacked bar chart':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'stacked bar chart');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.stackedBarContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.stackedBarContEl.setAttribute('id', 'dash-stacked-bar');
                    break;
                case 'star plot':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'star plot');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.starContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.starContEl.setAttribute('id', 'dash-star');
                    break;
                case 'pie chart':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'pie chart');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.pieContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.pieContEl.setAttribute('id', 'dash-pie');
                    break;
                case 'doughnut':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'doughnut');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.donutContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.donutContEl.setAttribute('id', 'dash-doughnut');
                    break;
            }
        });

        let prevSize = [
            { width: this.barContEl.offsetWidth, height: this.barContEl.offsetHeight },
            { width: this.stackedBarContEl.offsetWidth, height: this.stackedBarContEl.offsetHeight },
            { width: this.starContEl.offsetWidth, height: this.starContEl.offsetHeight },
            { width: this.pieContEl.offsetWidth, height: this.pieContEl.offsetHeight },
            { width: this.donutContEl.offsetWidth, height: this.donutContEl.offsetHeight }
        ];

        // Create a new ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                switch (entry.target.id) {
                    case 'dash-bar':
                        if (Math.abs(width - prevSize[0].width) > 10 || Math.abs(height - prevSize[0].height) > 10) {
                            console.log('gridstack item bar content was resized');
                            this.barChart.updateChart();
                        }
                        break;
                    case 'dash-stacked-bar':
                        if (Math.abs(width - prevSize[1].width) > 10 || Math.abs(height - prevSize[1].height) > 10) {
                            console.log('gridstack item stacked-bar content was resized');
                            this.stackedChart.updateChart();
                        }
                        break;
                    case 'dash-star':
                        if (Math.abs(width - prevSize[2].width) > 10 || Math.abs(height - prevSize[2].height) > 10) {
                            console.log('gridstack item star content was resized');
                            this.starPlot.updateChart();
                        }
                        break;
                    case 'dash-pie':
                        if (Math.abs(width - prevSize[3].width) > 10 || Math.abs(height - prevSize[3].height) > 10) {
                            console.log('gridstack item pie content was resized');
                            this.pieChart.updateChart();
                        }
                        break;
                    case 'dash-doughnut':
                        if (Math.abs(width - prevSize[4].width) > 10 || Math.abs(height - prevSize[4].height) > 10) {
                            console.log('gridstack item doughnut content was resized');
                            this.donutChart.updateChart();
                        }
                        break;
                }
            }
        });

        // Observe the element for size changes
        resizeObserver.observe(this.barContEl);
        // resizeObserver.observe(this.stackedBarContEl);
        // resizeObserver.observe(this.starContEl);
        resizeObserver.observe(this.pieContEl);
        // resizeObserver.observe(this.donutContEl);

    }

    ngAfterViewInit() {
        combineLatest([
            this.chartService.currentChartType,
            this.chartService.currentDataSource
        ]).subscribe(([chartType, dataSource]) => {
            // console.log('chartType:', chartType);
            // console.log('dataSource.length:', dataSource.length);
            if (chartType && dataSource.length > 0) {
                switch (chartType) {
                    case 'Bar Chart':
                        combineLatest([
                            this.chartService.currentJobName,
                            this.chartService.currentTitleCount
                        ]).subscribe(([jobName, titleCount]) => {
                            this.barChart.createChart(jobName, dataSource, titleCount);
                            // this.chartService.savePersistence(chartType, jobName, dataSource, titleCount);
                        });
                        break;
                    case 'Pie Chart':
                        this.chartService.currentPieLabel.subscribe(pieLabel => {
                            this.pieChart.createChart(dataSource, pieLabel);
                            // this.chartService.savePersistence(chartType, '', dataSource, 0);
                        });
                        break;
                    default:
                        console.log('Invalid Chart Type:');
                        break;
                }
                this.chartService.chartType.next('');
                this.chartService.dataSource.next([]);
            }
        });

        // this.chartService.loadPersistence();
        
        this.chartService.currentBarRemove.subscribe(barRemove => {
            if (barRemove) {
                let element = document.getElementById('dash-bar');
                let gridItemElement = element.closest('.grid-stack-item');
                this.grid.removeWidget(gridItemElement as GridStackElement);
            }
        });
        this.chartService.currentPieRemove.subscribe(pieRemove => {
            if (pieRemove) {
                let element = document.getElementById('dash-pie');
                let gridItemElement = element.closest('.grid-stack-item');
                this.grid.removeWidget(gridItemElement as GridStackElement);
            }
        });
    }

}