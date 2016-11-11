'use strict';
var wizard = require('../widgets/wizard.po');

module.exports = {
  isDisplayed: isDisplayed,
  getElement: getElement,
  getWizard: getWizard,
  getTitle: getTitle
};

function isDisplayed() {
  return getElement().isDisplayed();
}

function getElement() {
  return element(by.css('add-app-workflow'));
}

function getWizard() {
  return wizard.wrap(getElement());
}

function getTitle() {
  return element(by.css('.detail-view-header h4')).getText();
}
