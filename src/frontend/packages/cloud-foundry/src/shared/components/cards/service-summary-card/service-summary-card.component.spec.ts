import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AppChipsComponent,
  BooleanIndicatorComponent,
} from '@stratos/shared';

import { EntityMonitorFactory } from '../../../../../../core/src/shared/monitors/entity-monitor.factory.service';
import { MetadataCardTestComponents } from '../../../../../../core/test-framework/core-test.helper';
import { generateCfBaseTestModulesNoShared } from '../../../../../test-framework/cloud-foundry-endpoint-service.helper';
import { ServicesService } from '../../../../features/service-catalog/services.service';
import { ServicesServiceMock } from '../../../../features/service-catalog/services.service.mock';
import { ServiceIconComponent } from '../../service-icon/service-icon.component';
import { ServiceSummaryCardComponent } from './service-summary-card.component';


describe('ServiceSummaryCardComponent', () => {
  let component: ServiceSummaryCardComponent;
  let fixture: ComponentFixture<ServiceSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ServiceSummaryCardComponent,
        ServiceIconComponent,
        MetadataCardTestComponents,
        BooleanIndicatorComponent,
        AppChipsComponent,
      ],
      imports: generateCfBaseTestModulesNoShared(),
      providers: [
        { provide: ServicesService, useClass: ServicesServiceMock },
        EntityMonitorFactory
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
