declare namespace Cypress {
  interface Chainable {
    drag(subject: string, options?: unknown): Chainable<Element>;
    dnd(targetSelector: string): Chainable<Element>;
    dragIngredient(ingredientName: string): Chainable<JQuery<HTMLElement>>
    addBunToConstructor(): Chainable<JQuery<HTMLElement>>
    addSauceToConstructor(): Chainable<JQuery<HTMLElement>>
    checkConstructorElements(): Chainable<JQuery<HTMLElement>>
  }
} 