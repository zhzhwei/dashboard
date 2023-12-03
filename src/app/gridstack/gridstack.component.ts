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

    private dataSources = new Map();
    private resizeObservers = new Map();

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
                        map((chartAction): { chartType: string, dataSource: any[], action?: string, serial?: string, jobName?: string, titleCount?: number, pieLabel?: string } => {
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
        ).subscribe(({ chartType, dataSource, action, serial, jobName, titleCount, pieLabel }) => {
            var chartCreators = {
                'Bar Chart': this.barChart.chartCreateOrUpdate.bind(this.barChart),
                'Pie Chart': this.pieChart.chartCreateOrUpdate.bind(this.pieChart),
            };

            var conditions = {
                'Bar Chart': jobName && titleCount > 0,
                'Pie Chart': jobName && pieLabel
            };
        
            var parameter = chartType === 'Bar Chart' ? titleCount : pieLabel;
            
            var contEl, tileSerial;

            if (action === 'create') {
                if (this.majorInitImage) {
                    this.majorGrid.removeAll();
                    this.majorInitImage = false;
                }
                if (conditions[chartType]) {
                    tileSerial = this.getTileSerial(chartType);
                    contEl = document.getElementById(tileSerial);
                    chartCreators[chartType](tileSerial, jobName, dataSource, parameter, 'create');
                }
            } else if (action === 'edit') {
                tileSerial = serial;
                contEl = document.getElementById(serial);
                contEl.innerHTML = '';
                chartCreators[chartType](serial, jobName, dataSource, parameter, 'edit');
            }
    
            // Update the dataSource for this contEl
            this.dataSources.set(tileSerial, dataSource);
    
            // Stop observing the old contEl
            if (this.resizeObservers.has(tileSerial)) {
                this.resizeObservers.get(tileSerial).disconnect();
            }
    
            // Create a new ResizeObserver and start observing the new contEl
            var resizeObserver = new ResizeObserver(entries => {
                var latestDataSource = this.dataSources.get(tileSerial);
                chartCreators[chartType](tileSerial, jobName, latestDataSource, parameter, 'update');
            });
            resizeObserver.observe(contEl);
            this.resizeObservers.set(tileSerial, resizeObserver);

            this.chartService.chartType.next('');
            this.chartService.dataSource.next([]);
    
        });
    }

    private getTileSerial(chartType: string) {
        var itemEl = this.majorGrid.addWidget(this.newTile);
        this.chartTypeNum[chartType]++;
        var contEl = itemEl.querySelector('.grid-stack-item-content');
        var tileSerial = 'dash-' + (chartType === 'Bar Chart' ? 'bar-' : 'pie-') + this.chartTypeNum[chartType];
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