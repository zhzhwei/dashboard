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
import * as d3 from 'd3';

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

    private options = {
        margin: 5,
        column: 12,
        cellHeight: "auto",
        disableOneColumnMode: true,
        acceptWidgets: true,
        removeTimeout: 100
    };

    constructor(private chartService: ChartService, private gridService: GridStackService) { }

    ngOnInit(): void {
        this.majorGrid = GridStack.init(this.options, '#major-grid');
        this.majorGrid.addWidget(this.gridService.majorInitContent);
        this.minorGrid = GridStack.init(this.options, '#minor-grid');
        this.minorGrid.addWidget(this.gridService.minorInitContent);
        this.minorGridEl = document.querySelector('#minor-grid') as GridHTMLElement;
        this.minorGridEl.style.display = 'none';
    }

    ngAfterViewInit() {
        this.gridService.currentMajorEmpty.subscribe((isEmpty: boolean) => {
            if (isEmpty) {
                this.majorGrid.removeAll();
                this.majorGrid.addWidget(this.gridService.majorInitContent);
                this.majorInitImage = true;
            }
        });

        this.gridService.currentMinorEmpty.subscribe((isEmpty: boolean) => {
            if (isEmpty) {
                console.log('minorGrid is empty');
                this.minorGrid.removeAll();
                this.minorGrid.addWidget(this.gridService.minorInitContent);
                this.minorInitImage = true;
            }
        });

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
                        tileSerial = this.getMajorTileSerial(chartType);
                        contEl = document.getElementById(tileSerial);
                        console.log(action,tileSerial);
                        chartCreators[chartType]('create', tileSerial, jobName, dataSource, parameter, 'rgb(0, 0, 0)');
                        this.chartService.savePersistence(chartType, tileSerial, dataSource, jobName, parameter, 'rgb(0, 0, 0)');
                        this.gridService.saveInfoPosition(tileSerial);
                    }
                },
                'edit': () => {
                    tileSerial = serial;
                    contEl = document.getElementById(serial);
                    contEl.innerHTML = '';
                    console.log(action,tileSerial);
                    chartCreators[chartType]('edit', serial, jobName, dataSource, parameter, 'rgb(0, 0, 0)');
                    this.chartService.savePersistence(chartType, serial, dataSource, jobName, parameter, 'rgb(0, 0, 0)');
                },
                'load': () => {
                    tileSerial = serial;
                    console.log(action,tileSerial);
                    if (serial.includes('major')) {
                        if (this.majorInitImage) {
                            this.majorGrid.removeAll();
                            this.majorInitImage = false;
                        }
                        var itemEl = this.majorGrid.addWidget(this.gridService.newTile);
                        var serialNum = Number(tileSerial.split('-')[3]);
                        if (this.gridService.majorChartTypeNum[chartType] < serialNum) {
                            this.gridService.majorChartTypeNum[chartType] = serialNum;
                        }
                    } else if (serial.includes('minor')) {
                        if (this.minorInitImage) {
                            this.minorGrid.removeAll();
                            this.minorInitImage = false;
                        }
                        var itemEl = this.minorGrid.addWidget(this.gridService.newTile);
                        var serialNum = Number(tileSerial.split('-')[3]);
                        if (this.gridService.minorChartTypeNum[chartType] < serialNum) {
                            this.gridService.minorChartTypeNum[chartType] = serialNum;
                        }
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
                    tileSerial = serial;
                    console.log(action, tileSerial);
                    this.chartService.savePersistence(chartType, tileSerial, dataSource, jobName, parameter, 'rgb(255, 0, 0)');
                    if (this.minorGridEl.style.display === 'block') {
                        var itemEl = this.minorGrid.addWidget(this.gridService.newTile);
                        contEl = itemEl.querySelector('.grid-stack-item-content');
                        contEl.setAttribute('id', tileSerial);
                        chartCreators[chartType]('create', tileSerial, jobName, dataSource, parameter, 'rgb(255, 0, 0)');
                    }
                },
                'disfavor': () => {
                    if (serial.includes('major')) {
                        tileSerial = serial;
                        var tempTileSerial = this.gridService.tileSerialMap.get(serial);
                        console.log(action, tempTileSerial);
                        this.chartService.removePersistence(tempTileSerial);
                        this.gridService.minorChartTypeNum[chartType] = this.gridService.majorChartTypeNum[chartType];
                        if (this.minorGridEl.style.display === 'block') {
                            contEl = document.getElementById(tileSerial);
                            let element = document.getElementById(tempTileSerial);
                            let gridItemElement = element.closest('.grid-stack-item');
                            this.minorGrid.removeWidget(gridItemElement as GridStackElement);
                        }
                        let keys = Object.keys(localStorage);
                        keys.forEach(key => {
                            if (key.includes('minor')) {
                                this.minorInitImage = false;
                            }
                        });
                        if (this.minorInitImage || this.minorGrid.getGridItems().length === 0) {
                            // console.log('minorGrid is empty');
                            this.gridService.minorEmpty.next(true);
                        }
                    } else {
                        tileSerial = 'major-dash-bar-1';
                        contEl = document.getElementById(tileSerial);
                        dataSource = this.dataSources.get(tileSerial);
                        this.chartService.removePersistence(serial);
                        this.gridService.minorChartTypeNum[chartType] = this.gridService.majorChartTypeNum[chartType];
                        if (this.minorGridEl.style.display === 'block') {
                            let element = document.getElementById(serial);
                            let gridItemElement = element.closest('.grid-stack-item');
                            this.minorGrid.removeWidget(gridItemElement as GridStackElement);
                        }
                        let keys = Object.keys(localStorage);
                        keys.forEach(key => {
                            if (key.includes('minor')) {
                                this.minorInitImage = false;
                            }
                        });
                        if (this.minorInitImage || this.minorGrid.getGridItems().length === 0) {
                            // console.log('minorGrid is empty');
                            this.gridService.minorEmpty.next(true);
                        }
                    }
                },
                'remove': () => {
                    console.log(action, serial);
                    this.removeOneChart(serial);
                    if (this.majorGrid.getGridItems().length === 0) {
                        this.gridService.majorEmpty.next(true);
                    }
                }

            };

            if (chartActions[action]) {
                chartActions[action]();
            }

            if (action === 'favor') {
                if (this.minorGridEl.style.display === 'block') {
                    this.dataSources.set(tileSerial, dataSource);
                    if (this.resizeObservers.has(tileSerial)) {
                        this.resizeObservers.get(tileSerial).disconnect();
                    }
                    var resizeObserver = new ResizeObserver(entries => {
                        var latestAction = this.chartService.chartAction.value.action; // within the callback, this.chartService.chartAction.value is the latest value
                        // console.log(action, latestAction, tileSerial);
                        if (latestAction != 'remove' && latestAction != 'disfavor') {
                            var latestDataSource = this.dataSources.get(tileSerial);
                            chartCreators[chartType]('update', tileSerial, jobName, latestDataSource, parameter);
                        }
                    });
                    resizeObserver.observe(contEl);
                    this.resizeObservers.set(tileSerial, resizeObserver);
                }
            } else if (action === 'disfavor') {
                if (this.minorGridEl.style.display === 'block') {
                    this.dataSources.set(tileSerial, dataSource);
                    if (this.resizeObservers.has(tileSerial)) {
                        this.resizeObservers.get(tileSerial).disconnect();
                    }
                    var resizeObserver = new ResizeObserver(entries => {
                        var latestAction = this.chartService.chartAction.value.action;
                        // console.log(action, latestAction, tileSerial);
                        var latestDataSource = this.dataSources.get(tileSerial);
                        chartCreators[chartType]('update', tileSerial, jobName, latestDataSource, parameter);
                    });
                    resizeObserver.observe(contEl);
                    this.resizeObservers.set(tileSerial, resizeObserver);
                }
            } else if (action != 'remove') {
                this.dataSources.set(tileSerial, dataSource);
                if (this.resizeObservers.has(tileSerial)) {
                    this.resizeObservers.get(tileSerial).disconnect();
                }
                var resizeObserver = new ResizeObserver(entries => {
                    var latestAction = this.chartService.chartAction.value.action;
                    // console.log(action, latestAction, tileSerial);
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

        this.chartService.loadPersistence('major');
        console.log(localStorage.length);
        // localStorage.clear();

        // this.moveFromMinorToMajor();
        // this.moveFromMajorToMinor();

        this.gridService.currentMinorGridEl.subscribe((minorGridEl: any) => {
            if (minorGridEl) {
                let keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.includes('minor')) {
                        this.minorInitImage = false;
                    }
                });
                if (this.minorInitImage) {
                    this.gridService.minorEmpty.next(true);
                } else {
                    // console.log('minorGrid is not empty');
                    this.chartService.loadPersistence('minor');
                }
            } else {
                let keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.includes('minor')) {
                        var tileSerial = key;
                        if (this.resizeObservers.has(tileSerial)) {
                            this.resizeObservers.get(tileSerial).disconnect();
                        }
                    }
                });
                this.minorGrid.removeAll();
                this.minorInitImage = true;
            }
        });

        this.minorGrid.on('change', (event, items) => {
            if (this.minorGrid.getGridItems().length === 0) {
                console.log('minorGrid is empty');
                this.gridService.minorEmpty.next(true);
            }
        });

        this.majorGrid.on('change', (event, items) => this.mergeItem(event, items));

    }

    private removeOneChart(serial: string) {
        let element = document.getElementById(serial);
        let gridItemElement = element.closest('.grid-stack-item');
        this.majorGrid.removeWidget(gridItemElement as GridStackElement);
        this.chartService.removePersistence(serial);
    }

    private getMajorTileSerial(chartType: string) {
        var itemEl = this.majorGrid.addWidget(this.gridService.newTile);
        this.gridService.majorChartTypeNum[chartType]++;
        var contEl = itemEl.querySelector('.grid-stack-item-content');
        var tileSerial = 'major-dash-' + (chartType === 'Bar Chart' ? 'bar-' : 'pie-') + this.gridService.majorChartTypeNum[chartType];
        contEl.setAttribute('id', tileSerial);
        return tileSerial;
    }

    private moveFromMinorToMajor() {
        this.minorGrid.on('removed', (event, items) => {
            var serial = items[0].el.querySelector('.grid-stack-item-content').id;
            if (this.resizeObservers.has(serial)) {
                this.resizeObservers.get(serial).disconnect();
            }
            console.log(serial);
            if (serial.includes('bar')) {
                var dataSource = this.dataSources.get(serial);
                var titleCount = this.chartService.chartAction.value.titleCount;
                var jobName = this.chartService.chartAction.value.jobName;
                var color = this.chartService.chartAction.value.color;
                this.gridService.majorChartTypeNum['Bar Chart']++;
                var contEl = document.getElementById(serial);
                serial = serial.replace('minor', 'major');
                serial = serial.replace(serial.split('-')[3], this.gridService.majorChartTypeNum['Bar Chart']);
                contEl.setAttribute('id', serial);
                var barEL = document.getElementById(serial);
                var svg = d3.select('#' + serial).select('svg')
                    .attr('width', barEL.clientWidth)
                    .attr('height', barEL.clientHeight)
                // console.log(barEL, serial, jobName, titleCount, color);
                d3.select('#' + serial).select('svg').select('foreignObject.heart').remove();
                this.barChart.addPencil(svg, barEL, serial, jobName, titleCount, color);
                this.barChart.addDownload(svg, barEL, jobName, dataSource, titleCount, color);
                this.barChart.addHeart(svg, barEL, serial, jobName, dataSource, titleCount, color);
                this.barChart.addTrash(svg, serial, dataSource, barEL.clientWidth - 36, 95);
            }
            var resizeObserver = new ResizeObserver(entries => {
                this.barChart.copeChartAction('update', serial, jobName, dataSource, titleCount, color);
            });
            resizeObserver.observe(contEl);
            this.resizeObservers.set(serial, resizeObserver);
        });
    }

    private moveFromMajorToMinor() {
        this.majorGrid.on('removed', (event, items) => {
            var serial = items[0].el.querySelector('.grid-stack-item-content').id;
            if (this.resizeObservers.has(serial)) {
                this.resizeObservers.get(serial).disconnect();
            }
            console.log(serial);
            if (serial.includes('bar')) {
                var dataSource = this.dataSources.get(serial);
                var titleCount = this.chartService.chartAction.value.titleCount;
                var jobName = this.chartService.chartAction.value.jobName;
                var color = this.chartService.chartAction.value.color;
                this.gridService.majorChartTypeNum['Bar Chart']++;
                var contEl = document.getElementById(serial);
                serial = serial.replace('major', 'minor');
                serial = serial.replace(serial.split('-')[3], this.gridService.majorChartTypeNum['Bar Chart']);
                contEl.setAttribute('id', serial);
                var barEL = document.getElementById(serial);
                var svg = d3.select('#' + serial).select('svg')
                    .attr('width', barEL.clientWidth)
                    .attr('height', barEL.clientHeight)
                // console.log(barEL, serial, jobName, titleCount, color);
                d3.select('#' + serial).select('svg').select('foreignObject.pencil').remove();
                d3.select('#' + serial).select('svg').select('foreignObject.download').remove();
                d3.select('#' + serial).select('svg').select('foreignObject.heart').remove();
                d3.select('#' + serial).select('svg').select('foreignObject.trash').remove();
                this.barChart.addHeart(svg, barEL, serial, jobName, dataSource, titleCount, color);
            }
            var resizeObserver = new ResizeObserver(entries => {
                this.barChart.copeChartAction('update', serial, jobName, dataSource, titleCount, color);
            });
            resizeObserver.observe(contEl);
            this.resizeObservers.set(serial, resizeObserver);
        });
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