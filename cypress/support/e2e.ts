// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable {
      dragIngredient(ingredientName: string): Chainable<JQuery<HTMLElement>>
      addBunToConstructor(): Chainable<JQuery<HTMLElement>>
      addSauceToConstructor(): Chainable<JQuery<HTMLElement>>
      checkConstructorElements(): Chainable<JQuery<HTMLElement>>
    }
  }
} 