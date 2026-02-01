import './commands';
Cypress.on('uncaught:exception', (err, runnable) => {
return false;
});

beforeEach(() => {
cy.clearLocalStorage();
cy.clearCookies();
});
/// <reference types="cypress" />
