import { Injectable } from '@angular/core';

/**
 * Optional customizations
 */
export interface CustomizationsMetadata {
  hasEula?: boolean;
  copyright?: string;
  logoText?: string;
  aboutInfoComponent?: any;
  supportInfoComponent?: any;
  noEndpointsComponent?: any;
  alwaysShowNavForEndpointTypes?: (epType) => boolean;
  // Ensure custom login component is included when running `ng build --prod`. See #4473
  loginComponent?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CustomizationService {

  private customizationMetadata: CustomizationsMetadata = {};

  set = (cm: CustomizationsMetadata) => this.customizationMetadata = cm;
  get = () => this.customizationMetadata;
}
