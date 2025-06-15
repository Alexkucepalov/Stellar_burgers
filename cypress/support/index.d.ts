declare namespace Cypress {
  interface Chainable {
    drag(subject: string, options?: unknown): Chainable<Element>;
    dnd(targetSelector: string): Chainable<Element>;
  }
} 