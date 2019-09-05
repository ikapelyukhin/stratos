import { Component } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  AppChip,
} from '@stratos/shared';

import { ServicesService } from '../../../../../../cloud-foundry/src/features/service-catalog/services.service';
import {
  ServiceTag,
} from '../../../../../../cloud-foundry/src/shared/components/list/list-types/cf-services/cf-service-card/cf-service-card.component';
import { IService } from '../../../../../../core/src/core/cf-api-svc.types';
import { APIResource } from '../../../../../../store/src/types/api.types';


@Component({
  selector: 'app-service-summary-card',
  templateUrl: './service-summary-card.component.html',
  styleUrls: ['./service-summary-card.component.scss']
})
export class ServiceSummaryCardComponent {
  tags: AppChip<ServiceTag>[] = [];
  service$: Observable<APIResource<IService>>;
  constructor(
    public servicesService: ServicesService
  ) {
    this.service$ = servicesService.service$;

    this.service$.pipe(
      tap(service => {
        this.tags = service.entity.tags.map(t => ({
          value: t,
          hideClearButton$: observableOf(true)
        }));
      })
    ).subscribe();
  }

}
