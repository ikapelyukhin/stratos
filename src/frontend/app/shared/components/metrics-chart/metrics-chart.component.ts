import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ContentChild, AfterContentInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, map, takeWhile, tap } from 'rxjs/operators';
import { FetchApplicationMetricsAction, MetricQueryConfig, MetricQueryType, MetricsAction } from '../../../store/actions/metrics.actions';
import { AppState } from '../../../store/app-state';
import { entityFactory, metricSchemaKey } from '../../../store/helpers/entity-factory';
import { EntityMonitor } from '../../monitors/entity-monitor';
import { ChartSeries, IMetrics, MetricResultTypes } from './../../../store/types/base-metric.types';
import { EntityMonitorFactory } from './../../monitors/entity-monitor.factory.service';
import { MetricsChartTypes } from './metrics-chart.types';
import { MetricsChartManager } from './metrics.component.manager';
import { MetricsRangeSelectorComponent } from '../metrics-range-selector/metrics-range-selector.component';

export interface MetricsConfig<T = any> {
  metricsAction: MetricsAction;
  getSeriesName: (T) => string;
  mapSeriesItemName?: (value) => string | Date;
  mapSeriesItemValue?: (value) => any;
  sort?: (a: ChartSeries<T>, b: ChartSeries<T>) => number;
}
export interface MetricsChartConfig {
  // Make an enum for this.
  chartType: MetricsChartTypes;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

@Component({
  selector: 'app-metrics-chart',
  templateUrl: './metrics-chart.component.html',
  styleUrls: ['./metrics-chart.component.scss']
})
export class MetricsChartComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input()
  public metricsConfig: MetricsConfig;
  @Input()
  public chartConfig: MetricsChartConfig;
  @Input()
  public title: string;

  @ContentChild(MetricsRangeSelectorComponent)
  public timeRangeSelector: MetricsRangeSelectorComponent;

  @Input()
  set metricsAction(action: MetricsAction) {
    this.commitAction(action);
  }

  public chartTypes = MetricsChartTypes;

  private pollSub: Subscription;

  public results$;

  public metricsMonitor: EntityMonitor<IMetrics>;

  private committedAction: MetricsAction;

  constructor(
    private store: Store<AppState>,
    private entityMonitorFactory: EntityMonitorFactory
  ) { }

  private postFetchMiddleware(metricsArray: ChartSeries[]) {
    if (this.metricsConfig.sort) {
      const newMetricsArray = [
        ...metricsArray
      ];
      newMetricsArray.sort(this.metricsConfig.sort);
      if (
        this.committedAction.query.params &&
        this.committedAction.query.params.start &&
        this.committedAction.query.params.end
      ) {
        return MetricsChartManager.fillOutTimeOrderedChartSeries(
          newMetricsArray,
          this.committedAction.query.params.start as number,
          this.committedAction.query.params.end as number,
          this.committedAction.query.params.step as number,
          this.metricsConfig,
        );
      }
    }
    return metricsArray;
  }

  ngOnInit() {

    this.committedAction = this.metricsConfig.metricsAction;
    this.metricsMonitor = this.entityMonitorFactory.create<IMetrics>(
      this.metricsConfig.metricsAction.metricId,
      metricSchemaKey,
      entityFactory(metricSchemaKey)
    );

    this.results$ = this.metricsMonitor.entity$.pipe(
      map(metrics => {
        const metricsArray = this.mapMetricsToChartData(metrics, this.metricsConfig);
        if (!metricsArray.length) {
          return null;
        }
        return this.postFetchMiddleware(metricsArray);
      })
    );
  }

  ngAfterContentInit() {
    if (this.timeRangeSelector) {
      this.timeRangeSelector.baseAction = this.metricsConfig.metricsAction;
      const listener = this.timeRangeSelector.metricsAction.subscribe((action) => {
        this.commitAction(action);
      });
    }
  }

  private setup(action: MetricsAction) {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
    }
    if (action.queryType === MetricQueryType.QUERY) {
      this.pollSub = this.metricsMonitor
        .poll(
          10000,
          () => {
            this.store.dispatch(action);
          },
          request => ({ busy: request.fetching, error: request.error, message: request.message })
        ).subscribe();
    }
  }

  ngOnDestroy() {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
    }
  }

  private mapMetricsToChartData(metrics: IMetrics, metricsConfig: MetricsConfig) {
    if (metrics && metrics.data) {
      switch (metrics.data.resultType) {
        case MetricResultTypes.MATRIX:
          return MetricsChartManager.mapMatrix(metrics.data, metricsConfig);
        case MetricResultTypes.VECTOR:
          return MetricsChartManager.mapVector(metrics.data, metricsConfig);
        case MetricResultTypes.SCALAR:
        case MetricResultTypes.STRING:
        default:
          throw new Error(`Could not find chart data mapper for metrics type ${metrics.data.resultType}`);
      }
    } else {
      return [];
    }
  }

  private commitAction(action: MetricsAction) {
    this.committedAction = action;
    this.setup(action);
    this.store.dispatch(action);
  }
}
