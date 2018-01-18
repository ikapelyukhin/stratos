import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ApplicationBaseComponent } from './application-base.component';
import { StoreModule } from '@ngrx/store';
import { appReducers } from '../../../store/reducers.module';
import { getInitialTestStoreState } from '../../../test-framework/store-test-helper';
import { ApplicationStateService } from '../../../shared/components/application-state/application-state.service';
import { ApplicationEnvVarsService } from './application-tabs-base/tabs/build-tab/application-env-vars.service';

describe('ApplicationTabBaseComponent', () => {
  let component: ApplicationBaseComponent;
  let fixture: ComponentFixture<ApplicationBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationBaseComponent ],
      imports: [
        RouterTestingModule,
        StoreModule,
        StoreModule.forRoot(
          appReducers
          , {
            initialState: getInitialTestStoreState()
          })

      ],
      providers: [
        ApplicationStateService,
        ApplicationEnvVarsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
