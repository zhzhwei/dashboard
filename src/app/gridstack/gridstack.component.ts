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
    private majorGrid: GridStack;
    public majorInitImage: boolean = true;
    public minorInitImage: boolean = true;

    private itemEl: any;
    public barContEl: any;
    public stackedBarContEl: any;
    public starContEl: any;
    public pieContEl: any;
    public donutContEl: any;
    public lineContEl: any;

    private contElsAndObservers = {};

    private options = {
        margin: 5,
        column: 12,
        cellHeight: "auto",
        disableOneColumnMode: true,
        acceptWidgets: true,
        removable: '#trash',
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

    private newTile = {
        w: 3, h: 3,
        minW: 3, minH: 3,
        autoPosition: true,
    };

    constructor(private chartService: ChartService) { }

    ngOnInit(): void {
        // GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });
        this.majorGrid = GridStack.init(this.options, '#major-grid');
        this.majorGrid.addWidget({
            w: 3, h: 3, minW: 12, minH: 3,
            content: '<ion-icon name="help-buoy-outline" style="color: white; background-color: #5763cc; height: 100%; width: 100%"></ion-icon>',
            noResize: true,
        });
        this.minorGrid = GridStack.init(this.options, '#minor-grid');
        this.minorGrid.addWidget({
            w: 3, h: 3, minW: 12, minH: 3,
            content: '<ion-icon name="heart" style="color: white; background-color: rgb(115, 105, 148); height: 100%; width: 100%"></ion-icon>',
            noResize: true,
        });
        let minorGridEl = document.querySelector('#minor-grid') as GridHTMLElement;
        minorGridEl.style.display = 'none';
    }

    ngAfterViewInit() {
        combineLatest([
            this.chartService.currentChartType,
            this.chartService.currentDataSource
        ]).pipe(
            switchMap(([chartType, dataSource]) => {
                if (chartType && dataSource.length > 0) {
                    return this.chartService.chartAction.pipe(
                        map(chartAction => ({ chartType, dataSource, ...chartAction }))
                    );
                } else {
                    return EMPTY;
                }
            })
        ).subscribe(({ chartType, dataSource, action, serial, jobName, titleCount, pieLabel }) => {
            if (chartType === 'Bar Chart') {
                if (action === 'Create') {
                    if (this.majorInitImage) {
                        this.majorGrid.removeAll();
                        this.majorInitImage = false;
                    }
                    if (jobName && titleCount > 0) {
                        serial = this.getTileSerial(chartType);
                        console.log('chartAction', { chartType, dataSource, action, serial, jobName, titleCount });
                        this.barChart.createChart(serial, jobName, dataSource, titleCount);
                    }
                } else if (action === 'Edit') {
                    this.itemEl = document.getElementById(serial);
                    this.itemEl.innerHTML = '';
                    this.barChart.createChart(serial, jobName, dataSource, titleCount);
                }
            } else if (chartType === 'Pie Chart') {
                if (action === 'Create') {
                    if (this.majorInitImage) {
                        this.majorGrid.removeAll();
                        this.majorInitImage = false;
                    }
                    if (jobName && pieLabel) {
                        serial = this.getTileSerial(chartType);
                        console.log('chartAction', { chartType, dataSource, action, serial, jobName, pieLabel });
                        this.pieChart.createChart(serial, jobName, dataSource, pieLabel);
                    }
                } else if (action === 'Edit') {
                    this.itemEl = document.getElementById(serial);
                    this.itemEl.innerHTML = '';
                    this.pieChart.createChart(serial, jobName, dataSource, pieLabel);
                }
            }
            this.chartService.chartType.next('');
            this.chartService.dataSource.next([]);
        });

        // this.chartService.loadPersistence();
        // localStorage.clear();

        this.chartService.currentDiagramFavorite.subscribe(diagramFavorite => {
            if (diagramFavorite.favorite) {
                if (this.minorInitImage) {
                    this.minorGrid.removeAll();
                    this.minorInitImage = false;
                }
                // console.log('diagramFavorite:', diagramFavorite);
                let element = document.getElementById(diagramFavorite.serial);
                let gridItemElement = element.closest('.grid-stack-item');
                let gridItemElementClone = gridItemElement.cloneNode(true) as GridStackElement;
                this.minorGrid.addWidget(gridItemElementClone);
            }
            else {
                if (!this.minorInitImage) {
                    let element = document.getElementById(diagramFavorite.serial);
                    let gridItemElement = element.closest('.grid-stack-item');
                    this.minorGrid.removeWidget(gridItemElement as GridStackElement);
                }
            }
        });

        this.chartService.currentDiagramRemoved.subscribe(diagramRemoved => {
            if (diagramRemoved.removed) {
                switch (diagramRemoved.type) {
                    case 'Bar Chart':
                        this.barChart.barRemoved = true;
                        break;
                    case 'Pie Chart':
                        this.pieChart.pieRemoved = true;
                        break;
                }
                let element = document.getElementById(diagramRemoved.serial);
                let gridItemElement = element.closest('.grid-stack-item');
                this.majorGrid.removeWidget(gridItemElement as GridStackElement);
                this.chartService.removePersistence(diagramRemoved.serial);
            }
        });
    }

    private getTileSerial(chartType: string) {
        var itemEl = this.majorGrid.addWidget(this.newTile);
        this.chartTypeNum[chartType]++;
        var contEl = itemEl.querySelector('.grid-stack-item-content');
        var chartActions = {
            'Bar Chart': {
                setTileSerial: () => 'dash-bar-' + this.chartTypeNum[chartType],
                updateChart: () => {
                    if (!this.barChart.barRemoved) {
                        this.barChart.updateChart();
                    }
                }
            },
            'Pie Chart': {
                setTileSerial: () => 'dash-pie-' + this.chartTypeNum[chartType],
                updateChart: () => {
                    if (!this.pieChart.pieRemoved) {
                        this.pieChart.updateChart();
                    }
                }
            }
        };
        var tileSerial = chartActions[chartType].setTileSerial();
        contEl.setAttribute('id', tileSerial);
        var resizeObserver = new ResizeObserver(entries => {
            chartActions[chartType].updateChart();
        });
        resizeObserver.observe(contEl);
        return tileSerial;
    }

}