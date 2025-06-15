Cypress.Commands.add('dnd', { prevSubject: 'element' }, (subject, targetSelector) => {
  const dataTransfer = new DataTransfer();
  cy.wrap(subject).trigger('dragstart', { dataTransfer });
  cy.get(targetSelector).trigger('drop', { dataTransfer });
}); 