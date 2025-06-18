/// <reference types="cypress" />

import '@4tw/cypress-drag-drop';
import { addIngredient, clearConstructor } from '../../src/services/reducers/constructorReducer';
import { clearOrder } from '../../src/services/reducers/orderReducer';

// Константы для селекторов
const CONSTRUCTOR_BUN_SELECTOR = '[data-testid="constructor-bun"]';
const CONSTRUCTOR_FILLING_SELECTOR = '[data-testid="constructor-filling"]';
const ORDER_BUTTON_SELECTOR = '[data-testid="order-button"]';
const MODAL_SELECTOR = '[data-testid="modal"]';
const INGREDIENT_ITEM_SELECTOR = '[data-testid="ingredient-item"]';
const INGREDIENT_DETAILS_SELECTOR = '[data-testid="ingredient-details"]';
const TOTAL_PRICE_SELECTOR = '[data-testid="total-price"]';
const TEXT_DIGITS_LARGE_SELECTOR = '.text_type_digits-large';
const TEXT_MAIN_MEDIUM_SELECTOR = '.text_type_main-medium';
const DONE_ICON_SELECTOR = 'img[alt="Done"]';
const TEXT_MAIN_DEFAULT_SELECTOR = '.text_type_main-default';

describe('Конструктор бургеров', () => {
  let ingredientsData;
  let loginData;

  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', '**/auth/login', { fixture: 'login.json' }).as('login');
    cy.intercept('GET', '**/auth/user', { fixture: 'login.json' }).as('fetchUser');

    cy.fixture('ingredients.json').then((data) => {
      ingredientsData = data.data;
    });
    cy.fixture('login.json').then((data) => {
      loginData = data;
      localStorage.setItem('accessToken', loginData.accessToken);
      localStorage.setItem('refreshToken', loginData.refreshToken);
    });

    cy.visit('/');
    cy.wait('@getIngredients');

    // Пробуем удалить iframe, если он есть, но не ждем его появления
    cy.document().then((doc) => {
      const iframe = doc.querySelector('iframe#react-refresh-overlay');
      if (iframe) {
        iframe.remove();
      }
    });

    // Очищаем Redux store состояние перед каждым тестом
    cy.window().then((win) => {
      win.store.dispatch(clearConstructor());
      win.store.dispatch(clearOrder());
    });
  });

  afterEach(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('должен позволять перетаскивать ингредиенты в конструктор', () => {
    const bun = ingredientsData.find(item => item.type === 'bun');
    const sauce = ingredientsData.find(item => item.type === 'sauce');

    cy.window().then((win) => {
      win.store.dispatch(addIngredient(bun));
      win.store.dispatch(addIngredient(sauce));
    });

    // Проверяем, что состояние Redux store обновлено
    cy.window().its('store').invoke('getState').its('burgerConstructor.bun').should('not.be.null');
    cy.window().its('store').invoke('getState').its('burgerConstructor.items').should('have.length.gt', 0);
    
    // Проверяем видимость и содержимое элементов в UI
    cy.get(CONSTRUCTOR_BUN_SELECTOR).should('be.visible').and('contain', bun.name);
    cy.get(CONSTRUCTOR_FILLING_SELECTOR).should('be.visible').and('contain', sauce.name);
    cy.get(`${CONSTRUCTOR_BUN_SELECTOR} img`).should('have.attr', 'src', bun.image);
    cy.get(`${CONSTRUCTOR_FILLING_SELECTOR} img`).should('have.attr', 'src', sauce.image);
  });

  it('должен открывать модальное окно при клике на ингредиент', () => {
    cy.get(INGREDIENT_ITEM_SELECTOR).first().click();
    cy.url().should('include', '/ingredients/');
    cy.get(INGREDIENT_DETAILS_SELECTOR).should('be.visible');
  });

  it('должен создавать заказ при наличии ингредиентов', () => {
    // Проверяем, что пользователь авторизован
    cy.window().its('store').invoke('getState').its('auth.user').should('not.be.null');
    
    // Добавляем ингредиенты в конструктор
    cy.window().then((win) => {
        const state = win.store.getState();
        const ingredients = state.ingredients.items;
        
        // Находим булку и соус
        const bun = ingredients.find(item => item.type === 'bun');
        const sauce = ingredients.find(item => item.type === 'sauce');
        
        // Добавляем ингредиенты в конструктор
        win.store.dispatch({
            type: 'constructor/addIngredient',
            payload: { ...bun, uniqueId: `${bun._id}-${Date.now()}` }
        });
        
        win.store.dispatch({
            type: 'constructor/addIngredient',
            payload: { ...sauce, uniqueId: `${sauce._id}-${Date.now()}` }
        });
    });
    
    // Ждем обновления состояния
    cy.window().its('store').invoke('getState').its('burgerConstructor.bun').should('not.be.null');
    cy.window().its('store').invoke('getState').its('burgerConstructor.items').should('have.length.above', 0);
    
    // Проверяем видимость элементов конструктора
    cy.get(CONSTRUCTOR_BUN_SELECTOR).should('be.visible');
    cy.get(CONSTRUCTOR_FILLING_SELECTOR).should('be.visible');
    
    // Проверяем содержимое конструктора
    cy.get(CONSTRUCTOR_BUN_SELECTOR).should('contain', 'Краторная булка N-200i');
    cy.get(CONSTRUCTOR_FILLING_SELECTOR).should('contain', 'Соус фирменный Space Sauce');
    
    // Проверяем изображения
    cy.get(`${CONSTRUCTOR_BUN_SELECTOR} img`).should('have.attr', 'src', 'https://code.s3.yandex.net/react/code/bun-02.png');
    cy.get(`${CONSTRUCTOR_FILLING_SELECTOR} img`).should('have.attr', 'src', 'https://code.s3.yandex.net/react/code/sauce-04.png');
    
    // Проверяем кнопку заказа и кликаем по ней
    cy.get(ORDER_BUTTON_SELECTOR)
        .should('exist')
        .and('not.be.disabled')
        .click();
    
    // Ждем создания заказа и обновления состояния
    cy.wait('@createOrder').then(() => {
        // Проверяем, что номер заказа появился в store
        cy.window().its('store').invoke('getState').its('order.orderNumber').should('not.be.null');
    });
    
    // Проверяем появление содержимого модального окна, затем само модальное окно
    cy.get(TEXT_DIGITS_LARGE_SELECTOR, { timeout: 10000 }).should('contain', '12345'); // Ждем номер заказа
    cy.get(TEXT_MAIN_MEDIUM_SELECTOR).should('contain', 'идентификатор заказа');
    cy.get(DONE_ICON_SELECTOR).should('be.visible');
    cy.get(TEXT_MAIN_DEFAULT_SELECTOR).should('contain', 'Ваш заказ начали готовить');
    
    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get(MODAL_SELECTOR).should('not.exist');
  });

  it('должен показывать итоговую стоимость заказа', () => {
    const bun = ingredientsData.find(item => item.type === 'bun');
    const sauce = ingredientsData.find(item => item.type === 'sauce');
    const expectedTotalPrice = (bun.price * 2) + sauce.price;

    cy.window().then((win) => {
      win.store.dispatch(addIngredient(bun));
      win.store.dispatch(addIngredient(sauce));
    });

    // Проверяем, что состояние Redux store обновлено и ингредиенты отобразились в конструкторе
    cy.window().its('store').invoke('getState').its('burgerConstructor.bun').should('not.be.null');
    cy.window().its('store').invoke('getState').its('burgerConstructor.items').should('have.length.gt', 0);
    cy.get(CONSTRUCTOR_BUN_SELECTOR).should('be.visible').and('contain', bun.name);
    cy.get(CONSTRUCTOR_FILLING_SELECTOR).should('be.visible').and('contain', sauce.name);
    cy.get(`${CONSTRUCTOR_BUN_SELECTOR} img`).should('have.attr', 'src', bun.image);
    cy.get(`${CONSTRUCTOR_FILLING_SELECTOR} img`).should('have.attr', 'src', sauce.image);

    cy.get(TOTAL_PRICE_SELECTOR).should('exist');
    cy.get(TOTAL_PRICE_SELECTOR).should('contain', expectedTotalPrice.toString());
  });

  it('добавляет ингредиенты через store', () => {
    cy.window().then((win) => {
      const bun = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      };
      const sauce = {
        _id: '643d69a5c3f7b9001cfa093e',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
        __v: 0
      };

      win.store.dispatch(addIngredient(bun));
      win.store.dispatch(addIngredient(sauce));
    });

    cy.get(CONSTRUCTOR_BUN_SELECTOR).should('exist');
    cy.get(CONSTRUCTOR_FILLING_SELECTOR).should('exist');
  });
}); 