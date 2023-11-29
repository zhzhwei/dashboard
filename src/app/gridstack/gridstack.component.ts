import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent } from '../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../diagram/star-plot/star-plot.component';
import { PieChartComponent } from '../diagram/pie-chart/pie-chart.component';
import { DoughnutComponent } from '../diagram/doughnut/doughnut.component';
import { LineChartComponent } from '../diagram/line-chart/line-chart.component';

import 'gridstack/dist/h5/gridstack-dd-native';
import { combineLatest } from 'rxjs';
import { GridStack, GridStackElement } from 'gridstack';

import { ChartService } from '../services/chart.service';
import { escapeRegExp } from '@angular/compiler/src/util';
import { VariableAst } from '@angular/compiler';
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
    private serializedData: any[] = []
    private itemEl: any;
    private tileSerial: string;

    public barContEl: any;
    public stackedBarContEl: any;
    public starContEl: any;
    public pieContEl: any;
    public donutContEl: any;
    public lineContEl: any;

    private options = {
        margin: 5,
        column: 12,
        cellHeight: "auto",
        disableOneColumnMode: true,
        acceptWidgets: true,
        removable: '#trash',
        removeTimeout: 100
    };

    public showDiagrams: boolean = false;
    public initImage: boolean = true;

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
        x: 0, y: 0, w: 3, h: 3,
        autoPosition: true,
    };

    constructor(private chartService: ChartService) {

    }

    ngOnInit(): void {
        // GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });
        this.majorGrid = GridStack.init(this.options, '#major-grid');
        this.majorGrid.addWidget({
            w: 3, h: 3, minW: 12, minH: 6,
            content: '<img src="assets/page.webp" style="width: 100%; height: 100%;">',
            noResize: true,
        });
    }

    ngAfterViewInit() {
        combineLatest([
            this.chartService.currentChartType,
            this.chartService.currentDataSource
        ]).subscribe(([chartType, dataSource]) => {
            // console.log('chartType:', chartType);
            // console.log('dataSource.length:', dataSource.length);
            if (chartType && dataSource.length === 0) {
                switch (chartType) {
                    case 'Stacked Bar Chart':
                        this.stackedBarChart.createChart(this.stackedBarChart.data);
                        break;
                    case 'Star Plot':
                        this.starPlot.createChart();
                        break;
                    case 'Doughnut':
                        this.donutChart.createChart(this.donutChart.data);
                        break;
                    case 'Line Chart':
                        this.lineChart.createChart();
                        break;
                }
            }
            if (chartType && dataSource.length > 0) {
                if (this.initImage) {
                    this.majorGrid.removeAll();
                    this.initImage = false;
                }
                if (!this.initImage) {
                    switch (chartType) {
                        case 'Bar Chart':
                            combineLatest([
                                this.chartService.currentJobName,
                                this.chartService.currentTitleCount
                            ]).subscribe(([jobName, titleCount]) => {
                                var tileSerial = this.initDiagram(chartType);
                                this.barChart.createChart(tileSerial, jobName, dataSource, titleCount);
                                this.chartService.savePersistence(chartType, jobName, dataSource, titleCount);
                            });
                            break;
                        case 'Pie Chart':
                                console.log(chartType);
                                combineLatest([
                                    this.chartService.currentJobName,
                                    this.chartService.currentPieLabel
                                ]).subscribe(([jobName, pieLabel]) => {
                                    var tileSerial = this.initDiagram(chartType);
                                    this.pieChart.createChart(tileSerial, jobName, dataSource, pieLabel);
                                    this.chartService.savePersistence(chartType, jobName, dataSource, pieLabel);
                                });
                                break;
                        default:
                            console.log('Invalid Chart Type:');
                            break;
                    }
                    this.chartService.chartType.next('');
                    this.chartService.dataSource.next([]);
                }
            }
        });

        this.chartService.loadPersistence();

        this.chartService.currentBarRemove.subscribe(barRemove => {
            if (barRemove) {
                this.barChart.barRemove = true;
                let element = document.getElementById('dash-bar');
                let gridItemElement = element.closest('.grid-stack-item');
                this.majorGrid.removeWidget(gridItemElement as GridStackElement);
            }
        });
        this.chartService.currentPieRemove.subscribe(pieRemove => {
            if (pieRemove) {
                this.pieChart.pieRemove = true;
                let element = document.getElementById('dash-pie');
                let gridItemElement = element.closest('.grid-stack-item');
                this.majorGrid.removeWidget(gridItemElement as GridStackElement);
            }
        });

        this.chartService.currentShowDiagrams.subscribe(showDiagrams => {
            this.showDiagrams = showDiagrams;
            // console.log('showDiagrams:', this.showDiagrams);
            if (this.showDiagrams) {
                setTimeout(() => {
                    this.minorGrid = GridStack.init(this.options, '#minorGrid');
                    this.minorGrid.load(this.serializedData);
                });
            }
        });

        this.chartService.currentBarFavorite.subscribe(barFavorite => {
            if (barFavorite) {
                // this.barChart.createChart('dash-bar', jobName, dataSource, titleCount);
            }
        });
    }

    private initDiagram(chartType: string) {
        if (this.chartTypeNum[chartType] === 0) {
            this.itemEl = this.majorGrid.addWidget(this.newTile);
            this.chartTypeNum[chartType]++;
        }
        var contEl = this.itemEl.querySelector('.grid-stack-item-content');
        const chartActions = {
            'Bar Chart': {
                setTileSerial: () => 'dash-bar-' + this.chartTypeNum[chartType],
                updateChart: () => {
                    if (!this.barChart.barRemove) {
                        this.barChart.updateChart();
                    }
                }
            },
            'Pie Chart': {
                setTileSerial: () => 'dash-pie-' + this.chartTypeNum[chartType],
                updateChart: () => {
                    if (!this.pieChart.pieRemove) {
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