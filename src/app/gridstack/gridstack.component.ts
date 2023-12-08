import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent } from '../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../diagram/star-plot/star-plot.component';
import { PieChartComponent } from '../diagram/pie-chart/pie-chart.component';
import { DoughnutComponent } from '../diagram/doughnut/doughnut.component';
import { LineChartComponent } from '../diagram/line-chart/line-chart.component';

import { combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { GridStack, GridStackElement, GridHTMLElement } from 'gridstack';
import { ChartService } from '../services/chart.service';
import { GridStackService } from '../services/gridstack.service';

import 'gridstack/dist/h5/gridstack-dd-native';

declare var ResizeObserver: any;

@Component({
    selector: 'app-gridstack',
    templateUrl: './gridstack.component.html',
})

export class GridStackComponent implements OnInit {
    @ViewChild(BarChartComponent) barChart: BarChartComponent;
    @ViewChild(StackedBarChartComponent) stackedBarChart: StackedBarChartComponent;
    @ViewChild(StarPlotComponent) starPlot: StarPlotComponent;
    @ViewChild(PieChartComponent) pieChart: PieChartComponent;
    @ViewChild(DoughnutComponent) donutChart: DoughnutComponent;
    @ViewChild(LineChartComponent) lineChart: LineChartComponent;

    private minorGrid: GridStack;
    public majorGrid: GridStack;
    public majorInitImage: boolean = true;
    public minorInitImage: boolean = true;
    private minorGridEl: any;

    private dataSources = new Map();
    private resizeObservers = new Map();
    private chartFavorites = new Map();

    private options = {
        margin: 5,
        column: 12,
        cellHeight: "auto",
        disableOneColumnMode: true,
        acceptWidgets: true,
        // removable: '#trash',
        removeTimeout: 100
    };

    public chartTypeNum = {
        'Line Chart': 0,
        'Stacked Line Chart': 0,
        'Bar Chart': 0,
        'Stacked Bar Chart': 0,
        'Pie Chart': 0,
        'Doughnut': 0,
        'Star Plot': 0,
        'Star Plots': 0
    };

    constructor(private chartService: ChartService, private gridService: GridStackService) { }

    ngOnInit(): void {
        // GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });
        this.majorGrid = GridStack.init(this.options, '#major-grid');
        this.majorGrid.addWidget(this.gridService.majorInitImage);
        this.minorGrid = GridStack.init(this.options, '#minor-grid');
        this.minorGrid.addWidget(this.gridService.minorInitImage);
        this.minorGridEl = document.querySelector('#minor-grid') as GridHTMLElement;
        this.minorGridEl.style.display = 'none';
    }

    ngAfterViewInit() {
        combineLatest([
            this.chartService.currentChartType,
            this.chartService.currentDataSource
        ]).pipe(
            switchMap(([chartType, dataSource]) => {
                if (chartType && dataSource.length > 0) {
                    return this.chartService.chartAction.pipe(
                        map((chartAction): { chartType: string, dataSource: any[], action?: string, serial?: string, jobName?: string, titleCount?: number, pieLabel?: string, color?: any } => {
                            if (chartAction && typeof chartAction === 'object') {
                                return { chartType, dataSource, ...chartAction };
                            } else {
                                return { chartType, dataSource };
                            }
                        })
                    );
                } else {
                    return EMPTY;
                }
            })
        ).subscribe(({ chartType, dataSource, action, serial, jobName, titleCount, pieLabel, color }) => {
            var chartCreators = {
                'Bar Chart': this.barChart.copeChartAction.bind(this.barChart),
                'Pie Chart': this.pieChart.copeChartAction.bind(this.pieChart),
            };

            var conditions = {
                'Bar Chart': jobName && titleCount > 0,
                'Pie Chart': jobName && pieLabel
            };

            var parameter = chartType === 'Bar Chart' ? titleCount : pieLabel;

            var contEl, tileSerial;

            var chartActions = {
                'create': () => {
                    if (this.majorInitImage) {
                        this.majorGrid.removeAll();
                        this.majorInitImage = false;
                    }
                    if (conditions[chartType]) {
                        tileSerial = this.getTileSerial(chartType);
                        contEl = document.getElementById(tileSerial);
                        chartCreators[chartType]('create', tileSerial, jobName, dataSource, parameter, 'black');
                        this.chartService.savePersistence(chartType, tileSerial, dataSource, jobName, parameter, 'black');
                    }
                },
                'edit': () => {
                    tileSerial = serial;
                    contEl = document.getElementById(serial);
                    contEl.innerHTML = '';
                    chartCreators[chartType]('edit', serial, jobName, dataSource, parameter, color);
                    this.chartService.savePersistence(chartType, serial, dataSource, jobName, parameter, color);
                },
                'load': () => {
                    if (this.majorInitImage) {
                        this.majorGrid.removeAll();
                        this.majorInitImage = false;
                    }
                    if (this.minorInitImage) {
                        this.minorGrid.removeAll();
                        this.minorInitImage = false;
                    }
                    tileSerial = serial;
                    if (serial.includes('major')) {
                        console.log(serial);
                        var itemEl = this.majorGrid.addWidget(this.gridService.newTile);
                        var serialNum = Number(tileSerial.split('-')[3]);
                        if (this.chartTypeNum[chartType] < serialNum) {
                            this.chartTypeNum[chartType] = serialNum;
                        }
                    } else if (serial.includes('minor')) {
                        console.log(serial);
                        if (this.minorGridEl.style.display === 'none') {
                            this.minorGridEl.style.display = 'block';
                            console.log(this.minorGrid)
                        }
                        var itemEl = this.minorGrid.addWidget(this.gridService.newTile);
                    }
                    contEl = itemEl.querySelector('.grid-stack-item-content');
                    contEl.setAttribute('id', tileSerial);
                    chartCreators[chartType]('load', serial, jobName, dataSource, parameter, color);
                },
                'favor': () => {
                    if (this.minorInitImage) {
                        this.minorGrid.removeAll();
                        this.minorInitImage = false;
                    }
                    console.log(action, chartType, dataSource, serial, jobName, parameter)
                    tileSerial = serial;
                    var itemEl = this.minorGrid.addWidget(this.gridService.newTile);
                    contEl = itemEl.querySelector('.grid-stack-item-content');
                    contEl.setAttribute('id', serial);
                    chartCreators[chartType]('create', serial, jobName, dataSource, parameter, '');
                    this.chartService.savePersistence(chartType, serial, dataSource, jobName, parameter, '');
                },
                'disfavor': () => {
                    tileSerial = serial.replace('minor', 'major');
                    let element = document.getElementById(serial);
                    let gridItemElement = element.closest('.grid-stack-item');
                    this.minorGrid.removeWidget(gridItemElement as GridStackElement);
                    this.chartFavorites.set(tileSerial, 'black');
                    this.chartService.removePersistence(serial);
                },
                'remove': () => {
                    this.removeOneChart(serial);
                }
            };
            // Call the corresponding function
            if (chartActions[action]) {
                chartActions[action]();
            }
            if (action != 'remove' && action != 'disfavor') {
                // Update the dataSource for this contEl
                this.dataSources.set(tileSerial, dataSource);
                // Stop observing the old contEl
                if (this.resizeObservers.has(tileSerial)) {
                    this.resizeObservers.get(tileSerial).disconnect();
                }
                // Create a new ResizeObserver and start observing the new contEl
                var resizeObserver = new ResizeObserver(entries => {
                    var latestAction = this.chartService.chartAction.value.action;
                    console.log('latestAction', latestAction);
                    if (latestAction != 'remove' && latestAction != 'disfavor') {
                        var latestDataSource = this.dataSources.get(tileSerial);
                        chartCreators[chartType]('update', tileSerial, jobName, latestDataSource, parameter);
                    }
                });
                resizeObserver.observe(contEl);
                this.resizeObservers.set(tileSerial, resizeObserver);
            }
            this.chartService.chartType.next('');
            this.chartService.dataSource.next([]);
        });
        
        console.log(localStorage.length);
        this.minorGridEl.style.display = 'block';
        this.chartService.loadPersistence();
        // setTimeout(() => {
        //     this.minorGridEl.style.display = 'none';
        //   }, 0);

        // localStorage.clear();

        this.majorGrid.on('change', (event, items) => this.mergeItem(event, items));

    }

    private removeOneChart(serial: string) {
        let element = document.getElementById(serial);
        let gridItemElement = element.closest('.grid-stack-item');
        this.majorGrid.removeWidget(gridItemElement as GridStackElement);
        this.chartService.removePersistence(serial);
    }

    private getTileSerial(chartType: string) {
        var itemEl = this.majorGrid.addWidget(this.gridService.newTile);
        this.chartTypeNum[chartType]++;
        var contEl = itemEl.querySelector('.grid-stack-item-content');
        var tileSerial = 'major-dash-' + (chartType === 'Bar Chart' ? 'bar-' : 'pie-') + this.chartTypeNum[chartType];
        contEl.setAttribute('id', tileSerial);
        return tileSerial;
    }

    private mergeItem(event, items) {
        var nodes = this.majorGrid.getGridItems();
        for (var i = 0; i < nodes.length; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
                if (this.isOverlap(nodes[i], nodes[j])) {
                    // console.log('overlap');
                    break;
                }
            }
        }
    }

    private isOverlap(item1, item2) {
        return !(item2.x >= item1.x + item1.width || item2.x + item2.width <= item1.x ||
            item2.y >= item1.y + item1.height || item2.y + item2.height <= item1.y);
    }

}