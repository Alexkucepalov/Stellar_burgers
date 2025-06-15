/// <reference types="cypress" />

import '@4tw/cypress-drag-drop';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // Мокаем API запросы
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    // Переходим на главную страницу перед каждым тестом
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');

    // Пробуем удалить iframe, если он есть, но не ждем его появления
    cy.document().then((doc) => {
      const iframe = doc.querySelector('iframe#react-refresh-overlay');
      if (iframe) {
        iframe.remove();
      }
    });
  });

  it('должен позволять перетаскивать ингредиенты в конструктор', () => {
    cy.get('[data-testid="ingredient-item"]').contains('булка').first().dnd('[data-testid="constructor-drop-area"]');
    cy.get('[data-testid="constructor-bun"]').should('exist');

    cy.get('[data-testid="ingredient-item"]').contains('Соус фирменный Space Sauce').first().dnd('[data-testid="constructor-drop-area"]');
    cy.get('[data-testid="constructor-filling"]').should('exist');
  });

  it('должен открывать модальное окно при клике на ингредиент', () => {
    cy.get('[data-testid="ingredient-item"]').first().click();
    cy.url().should('include', '/ingredients/');
    cy.get('[data-testid="ingredient-details"]').should('be.visible');
  });

  it('должен создавать заказ при наличии ингредиентов', () => {
    cy.get('[data-testid="ingredient-item"]').contains('булка').first().dnd('[data-testid="constructor-drop-area"]');
    cy.get('[data-testid="ingredient-item"]').contains('Соус фирменный Space Sauce').first().dnd('[data-testid="constructor-drop-area"]');
    cy.get('[data-testid="order-button"]').should('not.be.disabled');
    cy.get('[data-testid="order-button"]').click();
    cy.wait('@createOrder');
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('.order-details-module__container__kmGLM').should('contain', '12345');
  });

  it('должен показывать итоговую стоимость заказа', () => {
    cy.get('[data-testid="ingredient-item"]').contains('булка').first().dnd('[data-testid="constructor-drop-area"]');
    cy.get('[data-testid="ingredient-item"]').contains('Соус фирменный Space Sauce').first().dnd('[data-testid="constructor-drop-area"]');
    cy.get('[data-testid="total-price"]').should('exist');
    cy.get('[data-testid="total-price"]').should('not.contain', '0');
  });

  it('добавляет ингредиенты через store', () => {
    cy.visit('/');
    cy.window().then((win: any) => {
      const bun = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        price: 1255,
        calories: 420,
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        uniqueId: `643d69a5c3f7b9001cfa093c-${Date.now()}-${Math.random()}`
      };
      const sauce = {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        price: 80,
        calories: 14,
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        uniqueId: `643d69a5c3f7b9001cfa093d-${Date.now()}-${Math.random()}`
      };
      win.store.dispatch({ type: 'constructor/addIngredient', payload: bun });
      win.store.dispatch({ type: 'constructor/addIngredient', payload: sauce });
    });
    cy.get('[data-testid="constructor-bun"]').should('exist');
    cy.get('[data-testid="constructor-filling"]').should('exist');
  });
}); 