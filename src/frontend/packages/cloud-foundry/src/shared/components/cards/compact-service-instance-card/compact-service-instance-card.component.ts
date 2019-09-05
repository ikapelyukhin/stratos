import { Component, Input, OnInit } from '@angular/core';

import {
  AppChip,
} from '@stratos/shared';


import { IServiceInstance } from '../../../../../../core/src/core/cf-api-svc.types';
import { APIResource } from '../../../../../../store/src/types/api.types';

@Component({
  selector: 'app-compact-service-instance-card',
  templateUrl: './compact-service-instance-card.component.html',
  styleUrls: ['./compact-service-instance-card.component.scss']
})
export class CompactServiceInstanceCardComponent implements OnInit {
  serviceInstanceTags: AppChip[];

  @Input() serviceInstance: APIResource<IServiceInstance>;
  constructor() { }

  ngOnInit() {
    this.serviceInstanceTags = this.serviceInstance.entity.tags.map(t => ({
      value: t
    }));
  }

}
