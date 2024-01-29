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
import { chart } from 'highcharts';

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
        console.log(localStorage.length);
        this.gridService.currentMajorEmpty.subscribe((isEmpty: boolean) => {
            if (isEmpty) {
                this.majorGrid.removeAll();
                this.majorGrid.addWidget(this.gridService.majorInitContent);
                this.majorInitImage = true;
            }
        });

        this.gridService.currentMinorEmpty.subscribe((isEmpty: boolean) => {
            if (isEmpty) {
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
                if (chartType && dataSource && dataSource.length > 0) {
                    return this.chartService.chartAction.pipe(
                        map((chartActionFromObservable): {
                            chartType: string, dataSource: any[], action?: string, serial?: string,
                            title?: string, pieLabel?: string, heartColor?: any, barColor?: any
                        } => {
                            if (chartActionFromObservable && typeof chartActionFromObservable === 'object') {
                                return { chartType, dataSource, ...chartActionFromObservable };
                            } else {
                                return { chartType, dataSource };
                            }
                        })
                    );
                } else {
                    return EMPTY;
                }
            })
        ).subscribe(({ chartType, dataSource, action, serial, title, pieLabel, heartColor, barColor }) => {
            if (!(title)) {
                title = this.chartService.chartAction.value.title
            }
            var chartCreators = {
                'bar_chart': this.barChart.copeChartAction.bind(this.barChart),
                'pie_chart': this.pieChart.copeChartAction.bind(this.pieChart),
            };

            var conditions = {
                'bar_chart': title,
                'pie_chart': pieLabel
            };

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
                        const tempItem = localStorage.getItem("temp");
                        localStorage.setItem(tileSerial + "-config", tempItem);
                        localStorage.removeItem("temp");
                        console.log('create', tileSerial, title, dataSource, 'rgb(0, 0, 0)', barColor);
                        chartCreators[chartType]('create', tileSerial, title, dataSource, 'rgb(0, 0, 0)', barColor);
                        this.chartService.savePersistence(chartType, tileSerial, dataSource, title, undefined, 'rgb(0, 0, 0)', barColor);
                        this.gridService.saveInfoPosition(tileSerial);
                    }
                },
                'edit': () => {
                    tileSerial = serial;
                    contEl = document.getElementById(serial);
                    contEl.innerHTML = '';
                    console.log(action, tileSerial);
                    const tempItem = localStorage.getItem("temp");
                    localStorage.setItem(tileSerial + "-config", tempItem);
                    localStorage.removeItem("temp");
                    chartCreators[chartType]('edit', serial, title, dataSource, 'rgb(0, 0, 0)', barColor);
                    this.chartService.savePersistence(chartType, serial, dataSource, title, undefined, 'rgb(0, 0, 0)', barColor);
                },
                'load': () => {
                    tileSerial = serial;
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
                    console.log('load', serial, title, dataSource, heartColor, barColor);
                    chartCreators[chartType]('load', serial, title, dataSource, heartColor, barColor);
                },
                'favor': () => {
                    if (this.minorInitImage) {
                        this.minorGrid.removeAll();
                        this.minorInitImage = false;
                    }
                    tileSerial = serial;
                    console.log(action, tileSerial);
                    this.chartService.savePersistence(chartType, tileSerial, dataSource, title, undefined, 'rgb(255, 0, 0)', barColor);
                    if (this.minorGridEl.style.display === 'block') {
                        // this.gridService.newTile['noResize'] = true;
                        var itemEl = this.minorGrid.addWidget(this.gridService.newTile);
                        contEl = itemEl.querySelector('.grid-stack-item-content');
                        contEl.setAttribute('id', tileSerial);
                        chartCreators[chartType]('create', tileSerial, title, dataSource, 'rgb(255, 0, 0)', barColor);
                    }
                },
                'disfavor': () => {
                    if (serial.includes('major')) {
                        this.gridService.tileSerialFavor.delete(serial);
                        tileSerial = serial;
                        var tempTileSerial = this.gridService.tileSerialMap.get(serial);
                        this.gridService.tileSerialMap.delete(serial);
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
                        let serialFound: string;
                        for (let [key, value] of this.gridService.tileSerialMap.entries()) {
                            if (value === serial) {
                                serialFound = key;
                                break;
                            }
                        }
                        if (serialFound) {
                            console.log('serialFound:', serialFound);
                            tileSerial = serialFound;
                            this.gridService.tileSerialFavor.delete(tileSerial);
                            contEl = document.getElementById(tileSerial);
                            dataSource = this.dataSources.get(tileSerial);
                        } else {
                            let serial: string;
                            let minNum = 10000;
                            let keys = Object.keys(localStorage);
                            keys.forEach(key => {
                                if (key.includes('major')) {
                                    let serialNum = Number(key.split('-')[3]);
                                    if (serialNum < minNum) {
                                        minNum = serialNum;
                                        serial = key;
                                    }
                                }
                            });
                            tileSerial = serial;
                            contEl = document.getElementById(tileSerial);
                            dataSource = this.dataSources.get(tileSerial);
                        }
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
                    this.gridService.tileSerialMap.delete(serial);
                    // this.compactGridstack(this.majorGrid);
                    if (this.majorGrid.getGridItems().length === 0) {
                        this.gridService.majorEmpty.next(true);
                    }
                }

            };

            if (chartActions[action]) {
                chartActions[action]();
            }
            // console.log(this.gridService.tileSerialFavor);
            if (action === 'create') {
                console.log(chartType, conditions[chartType]);
                // if (conditions[chartType]) {
                this.gridService.tileSerialFavor.delete(tileSerial);
                this.dataSources.set(tileSerial, dataSource);
                if (this.resizeObservers.has(tileSerial)) {
                    this.resizeObservers.get(tileSerial).disconnect();
                }
                var resizeObserver = new ResizeObserver(entries => {
                    var latestAction = this.chartService.chartAction.value.action;
                    console.log(action, latestAction, tileSerial);
                    title = this.chartService.chartAction.value.title
                    if (latestAction != 'remove' && latestAction != 'disfavor') {
                        var latestDataSource = this.dataSources.get(tileSerial);
                        if (this.gridService.tileSerialFavor.has(tileSerial)) {
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(255, 0, 0)', barColor);
                        } else {
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(0, 0, 0)', barColor);
                        }
                    }
                });
                resizeObserver.observe(contEl);
                this.resizeObservers.set(tileSerial, resizeObserver);
                // }
            } else if (action === 'edit') {
                this.gridService.tileSerialFavor.delete(tileSerial);
                this.dataSources.set(tileSerial, dataSource);
                if (this.resizeObservers.has(tileSerial)) {
                    this.resizeObservers.get(tileSerial).disconnect();
                }
                var resizeObserver = new ResizeObserver(entries => {
                    var latestAction = this.chartService.chartAction.value.action;
                    console.log(action, latestAction, tileSerial);
                    if (latestAction != 'remove' && latestAction != 'disfavor') {
                        var latestDataSource = this.dataSources.get(tileSerial);
                        if (this.gridService.tileSerialFavor.has(tileSerial)) {
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(255, 0, 0)', barColor);
                        } else {
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(0, 0, 0)', barColor);
                        }
                    }
                });
                resizeObserver.observe(contEl);
                this.resizeObservers.set(tileSerial, resizeObserver);
            } else if (action === 'load') {
                this.dataSources.set(tileSerial, dataSource);
                if (this.resizeObservers.has(tileSerial)) {
                    this.resizeObservers.get(tileSerial).disconnect();
                }
                var resizeObserver = new ResizeObserver(entries => {
                    var latestAction = this.chartService.chartAction.value.action;
                    // console.log(action, latestAction, tileSerial);
                    if (latestAction != 'remove' && latestAction != 'disfavor') {
                        var latestDataSource = this.dataSources.get(tileSerial);
                        if (this.gridService.tileSerialFavor.has(tileSerial)) {
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(255, 0, 0)', barColor);
                        } else {
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(0, 0, 0)', barColor);
                        }
                    }
                });
                resizeObserver.observe(contEl);
                this.resizeObservers.set(tileSerial, resizeObserver);
            } else if (action === 'favor') {
                if (this.minorGridEl.style.display === 'block') {
                    this.dataSources.set(tileSerial, dataSource);
                    if (this.resizeObservers.has(tileSerial)) {
                        this.resizeObservers.get(tileSerial).disconnect();
                    }
                    var resizeObserver = new ResizeObserver(entries => {
                        var latestAction = this.chartService.chartAction.value.action; // within the callback, this.chartService.chartAction.value is the latest value
                        console.log(action, latestAction, tileSerial);
                        if (latestAction != 'remove' && latestAction != 'disfavor') {
                            var latestDataSource = this.dataSources.get(tileSerial);
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(255, 0, 0)', barColor);
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
                        console.log(action, latestAction, tileSerial);
                        var latestDataSource = this.dataSources.get(tileSerial);
                        if (this.gridService.tileSerialFavor.has(tileSerial)) {
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(255, 0, 0)', barColor);
                        } else {
                            chartCreators[chartType]('update', tileSerial, title, latestDataSource, 'rgb(0, 0, 0)', barColor);
                        }
                    });
                    resizeObserver.observe(contEl);
                    this.resizeObservers.set(tileSerial, resizeObserver);
                    this.compactGridstack(this.minorGrid);
                }
            }
            this.chartService.chartType.next('');
            this.chartService.dataSource.next([]);
        });

        this.gridService.currentMinorGridEl.subscribe((minorGridEl: any) => {
            if (minorGridEl) {
                let minorFound = false;
                let keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.includes('minor')) {
                        // console.log(key);
                        minorFound = true;
                    }
                });
                if (!minorFound) {
                    // console.log('minor is not found');
                    this.gridService.minorEmpty.next(true);
                } else {
                    // console.log('minor is found');
                    this.minorGrid.removeAll();
                    // this.minorInitImage = false;
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
                // console.log('minorGrid is empty');
                this.minorInitImage = true;
                this.gridService.minorEmpty.next(true);
            }
        });

        this.chartService.loadPersistence('major');
        // localStorage.clear();

        this.moveFromMajorToMinor();
        this.moveFromMinorToMajor();
        // this.majorGrid.on('change', (event, items) => this.mergeItem(event, items));

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
        var tileSerial = 'major-dash-' + (chartType === 'bar_chart' ? 'bar-' : 'pie-') + this.gridService.majorChartTypeNum[chartType];
        contEl.setAttribute('id', tileSerial);
        return tileSerial;
    }

    private compactGridstack(gridstack: GridStack) {
        // Start a batch update
        gridstack.batchUpdate();
        // Get all grid items
        let nodes = gridstack.engine.nodes;
        // Sort the grid items by their y position
        nodes.sort((a, b) => a.y - b.y);
        // For each grid item
        for (let node of nodes) {
            // Find the highest empty cell below the grid item
            let highestEmptyCell = node.y;
            for (let y = node.y - 1; y >= 0; y--) {
                let isCellEmpty = true;
                for (let otherNode of nodes) {
                    if (otherNode !== node && otherNode.y <= y && y < otherNode.y + otherNode.h && otherNode.x < node.x + node.w && node.x < otherNode.x + otherNode.w) {
                        isCellEmpty = false;
                        break;
                    }
                }
                if (isCellEmpty) {
                    highestEmptyCell = y;
                } else {
                    break;
                }
            }
            // Move the grid item to the highest empty cell
            gridstack.update(node.el, { x: node.x, y: highestEmptyCell });
        }
        // Compact the grid items vertically
        gridstack.compact();
        // End the batch update
        gridstack.commit();
    }

    private moveFromMajorToMinor() {
        let isDragging = false;
        let originalGrid = null;

        // listen on dragstart event
        this.majorGrid.on('dragstart', function (event, el) {
            isDragging = true;
            originalGrid = this; // this refers to the grid where the drag started
        });

        // listen on dropped event
        this.minorGrid.on('dropped', (event, previousWidget, newWidget) => {
            if (originalGrid !== this) {
                console.log('An item has moved from majorGrid to minorGrid ');
                if (this.majorInitImage) {
                    return;
                }
                if (this.minorInitImage) {
                    this.minorGrid.removeWidget(this.minorGrid.getGridItems()[0] as HTMLElement);
                    this.minorInitImage = false;
                }

                var serial = newWidget.el.querySelector('.grid-stack-item-content').id;
                console.log('serial', serial);
                if (this.resizeObservers.has(serial)) {
                    this.resizeObservers.get(serial).disconnect();
                }

                var visibilityMapping = JSON.parse(localStorage.getItem(serial + "-config"));
                var title = JSON.parse(localStorage.getItem(serial)).title;
                var barColor = JSON.parse(localStorage.getItem(serial)).barColor;
                this.chartService.removePersistence(serial);

                if (serial.includes('bar')) {
                    var dataSource = this.dataSources.get(serial);
                    var filteredDataSource = dataSource.filter((_, index) => visibilityMapping[index]);
                    var contEl = document.getElementById(serial);

                    let serialFound = this.gridService.tileSerialMap.get(serial);
                    if (serialFound) {
                        if (this.resizeObservers.has(serialFound)) {
                            this.resizeObservers.get(serialFound).disconnect();
                        }
                        this.chartService.removePersistence(serialFound);
                        let element = document.getElementById(serialFound);
                        let gridItemElement = element.closest('.grid-stack-item');
                        this.minorGrid.removeWidget(gridItemElement as GridStackElement);
                        this.gridService.tileSerialMap.delete(serial);
                    }

                    serial = this.gridService.getMinorTileSerial('bar_chart', serial);
                    contEl.setAttribute('id', serial);
                    var barEL = document.getElementById(serial);
                    var svg = d3.select('#' + serial).select('svg')
                        .attr('width', barEL.clientWidth)
                        .attr('height', barEL.clientHeight)
                    d3.select('#' + serial).select('svg').select('foreignObject.pencil').remove();
                    d3.select('#' + serial).select('svg').select('foreignObject.download').remove();
                    d3.select('#' + serial).select('svg').select('foreignObject.heart').remove();
                    d3.select('#' + serial).select('svg').select('foreignObject.trash').remove();
                    this.barChart.addHeart(svg, barEL, serial, title, filteredDataSource, 'rgb(255, 0, 0)', barColor);
                }
                if (this.minorGridEl.style.display === 'block') {
                    var resizeObserver = new ResizeObserver(entries => {
                        // console.log('update', serial, jobName, filteredDataSource, titleCount, 'rgb(255, 0, 0)');
                        this.barChart.copeChartAction('update', serial, title, filteredDataSource, 'rgb(255, 0, 0)', barColor);
                    });
                    resizeObserver.observe(contEl);
                    this.resizeObservers.set(serial, resizeObserver);
                    this.dataSources.set(serial, dataSource);
                    this.compactGridstack(this.minorGrid);
                    localStorage.setItem(serial + "-config", JSON.stringify(visibilityMapping));
                    this.chartService.savePersistence('bar_chart', serial, dataSource, title, undefined, 'rgb(255, 0, 0)', barColor);
                }
                setTimeout(() => {
                    if (this.majorGrid.getGridItems().length === 0) {
                        // console.log('minorGrid is empty');
                        this.gridService.majorEmpty.next(true);
                    }
                }, 0);
            }
            isDragging = false;
            originalGrid = null;
        });
    }

    private moveFromMinorToMajor() {
        let isDragging = false;
        let originalGrid = null;

        // listen on dragstart event
        this.minorGrid.on('dragstart', function (event, el) {
            isDragging = true;
            originalGrid = this; // this refers to the grid where the drag started
        });

        // listen on dropped event
        this.majorGrid.on('dropped', (event, previousWidget, newWidget) => {
            if (originalGrid !== this) {
                console.log('An item has moved from minorGrid to majorGrid ');
                if (this.minorInitImage) {
                    return;
                }
                if ( this.majorInitImage ) {
                    this.majorGrid.removeWidget(this.majorGrid.getGridItems()[0] as HTMLElement);
                    this.majorInitImage = false;
                }
                if ( this.minorGridEl.style.display === 'block' ) {
                    // var serial = items[0].el.querySelector('.grid-stack-item-content').id;
                    var serial = newWidget.el.querySelector('.grid-stack-item-content').id;
                    if (this.resizeObservers.has(serial)) {
                        this.resizeObservers.get(serial).disconnect();
                    }
    
                    var visibilityMapping = JSON.parse(localStorage.getItem(serial + "-config"));
                    var title = JSON.parse(localStorage.getItem(serial)).title;
                    var heartColor = JSON.parse(localStorage.getItem(serial)).heartColor;
                    var barColor = JSON.parse(localStorage.getItem(serial)).barColor;
                    console.log(serial, title, heartColor, barColor);
                    this.chartService.removePersistence(serial);
                    
                    if (serial.includes('bar')) {
                        var dataSource = this.dataSources.get(serial);
                        var filteredDataSource = dataSource.filter((_, index) => visibilityMapping[index]);
                        this.gridService.majorChartTypeNum['bar_chart']++;
                        var contEl = document.getElementById(serial);
                        
                        let serialFound: string;
                        for (let [key, value] of this.gridService.tileSerialMap.entries()) {
                            if (value === serial) {
                                serialFound = key;
                                break;
                            }
                        }
                        if (serialFound) {
                            if (this.resizeObservers.has(serialFound)) {
                                this.resizeObservers.get(serialFound).disconnect();
                            }
                            this.chartService.removePersistence(serialFound);
                            let element = document.getElementById(serialFound);
                            let gridItemElement = element.closest('.grid-stack-item');
                            this.majorGrid.removeWidget(gridItemElement as GridStackElement);
                            this.gridService.tileSerialMap.delete(serialFound);
                        }
    
                        serial = serial.replace('minor', 'major');
                        serial = serial.replace(serial.split('-')[3], String(this.gridService.majorChartTypeNum['bar_chart']));
                        contEl.setAttribute('id', serial);
                        var barEL = document.getElementById(serial);
                        var svg = d3.select('#' + serial).select('svg')
                            .attr('width', barEL.clientWidth)
                            .attr('height', barEL.clientHeight)
                        // console.log(barEL, serial, title, color);
                        
                        d3.select('#' + serial).select('svg').select('foreignObject.heart').remove();
                        this.barChart.addPencil(svg, barEL, serial, title, heartColor, barColor);
                        this.barChart.addDownload(svg, barEL, serial, title, filteredDataSource, heartColor);
                        this.barChart.addHeart(svg, barEL, serial, title, filteredDataSource, heartColor, barColor);
                        this.barChart.addTrash(svg, serial, filteredDataSource, barEL.clientWidth - 36, 95);
                    }
                    if (contEl) {
                        var resizeObserver = new ResizeObserver(entries => {
                            // console.log('update', serial, jobName, dataSource, titleCount, 'rgb(0, 0, 0)');
                            this.barChart.copeChartAction('update', serial, title, filteredDataSource, 'rgb(0, 0, 0)', barColor);
                        });
                        resizeObserver.observe(contEl);
                        this.resizeObservers.set(serial, resizeObserver);
                        this.dataSources.set(serial, dataSource);
                        // this.compactGridstack(this.majorGrid);
                        localStorage.setItem(serial + "-config", JSON.stringify(visibilityMapping));
                        this.chartService.savePersistence('bar_chart', serial, dataSource, title, undefined, 'rgb(0, 0, 0)', barColor);
                    }
                }
                setTimeout(() => {
                    if (this.minorGrid.getGridItems().length === 0) {
                        // console.log('minorGrid is empty');
                        this.gridService.minorEmpty.next(true);
                    }
                }, 0);
            }
            isDragging = false;
            originalGrid = null;
        });
    }

    // private mergeItem(event, items) {
    //     var nodes = this.majorGrid.getGridItems();
    //     for (var i = 0; i < nodes.length; i++) {
    //         for (var j = i + 1; j < nodes.length; j++) {
    //             if (this.isOverlap(nodes[i], nodes[j])) {
    //                 // console.log('overlap');
    //                 break;
    //             }
    //         }
    //     }
    // }

    // private isOverlap(item1, item2) {
    //     return !(item2.x >= item1.x + item1.width || item2.x + item2.width <= item1.x ||
    //         item2.y >= item1.y + item1.height || item2.y + item2.height <= item1.y);
    // }

}