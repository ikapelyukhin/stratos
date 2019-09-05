import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanIndicatorComponent } from '@stratos/shared';
import { EntityMonitorFactory } from '../../../../../../../../core/src/shared/monitors/entity-monitor.factory.service';
import { MetadataCardTestComponents } from '../../../../../../../../core/test-framework/core-test.helper';
import {
  generateCfBaseTestModulesNoShared,
} from '../../../../../../../test-framework/cloud-foundry-endpoint-service.helper';
import { CfBuildpackCardComponent } from './cf-buildpack-card.component';

describe('CfBuildpackCardComponent', () => {
  let component: CfBuildpackCardComponent;
  let fixture: ComponentFixture<CfBuildpackCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CfBuildpackCardComponent, ...MetadataCardTestComponents, BooleanIndicatorComponent],
      imports: generateCfBaseTestModulesNoShared(),
      providers: [
        EntityMonitorFactory
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfBuildpackCardComponent);
    component = fixture.componentInstance;
    component.row = {
      entity: {
        name: '',
        position: 1,
        enabled: true,
        locked: true,
        filename: ''
      },
      metadata: {
        created_at: '',
        updated_at: '',
        guid: '',
        url: ''
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
