/// <reference types="cypress" />
describe('Stellar Burgers - Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json',
    }).as('createOrder');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json',
    }).as('getUser');

    cy.visit('/');

    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должно добавить булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="constructor-bun-top"]').should('exist');
      cy.get('[data-testid="constructor-bun-bottom"]').should('exist');
    });

    it('должно добавить начинку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодона')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="constructor-ingredient"]')
        .should('contain', 'Филе Люминесцентного тетраодона');
    });

    it('должно добавить соус в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.contains('Соус Фалленианского плотоядного растения')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="constructor-ingredient"]')
        .should('contain', 'Соус Фалленианского плотоядного растения');
    });

    it('должно заменить булку на другую', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="constructor-bun-top"]')
        .should('contain', 'Краторная булка N-200i');

      cy.contains('Флюоресцентная булка R2D3')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="constructor-bun-top"]')
        .should('contain', 'Флюоресцентная булка R2D3');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открыть модальное окно при клике на ингредиент', () => {
      cy.contains('Филе Люминесцентного тетраодона')
        .closest('[data-testid="ingredient-item"]')
        .click();

      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="ingredient-details"]').should('be.visible');
    });

    it('должно закрыть модальное окно при клике на крестик', () => {
      cy.contains('Филе Люминесцентного тетраодона')
        .closest('[data-testid="ingredient-item"]')
        .click();

      cy.get('[data-testid="modal-close"]').click();

      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.contains('Филе Люминесцентного тетраодона')
        .closest('[data-testid="ingredient-item"]')
        .click();

      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должно отображать правильные данные ингредиента в модале', () => {
      cy.contains('Филе Люминесцентного тетраодона')
        .closest('[data-testid="ingredient-item"]')
        .click();
      cy.get('[data-testid="ingredient-details"]')
        .should('contain', 'Филе Люминесцентного тетраодона');
      cy.get('[data-testid="ingredient-details"]')
        .should('contain', '643');

      cy.get('[data-testid="modal-close"]').click();

      cy.contains('Соус Фалленианского плотоядного растения')
        .closest('[data-testid="ingredient-item"]')
        .click();
      cy.get('[data-testid="ingredient-details"]')
        .should('contain', 'Соус Фалленианского плотоядного растения');

      cy.get('[data-testid="ingredient-details"]')
        .should('contain', '426');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem(
          'accessToken',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        );
        win.localStorage.setItem('refreshToken', 'test_refresh_token');
      });
    });

    it('должно создать заказ с правильным номером', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодона')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.contains('Соус Фалленианского плотоядного растения')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrder');
      cy.get('[data-testid="order-modal"]').should('be.visible');
      cy.get('[data-testid="order-number"]').should('contain', '12345');
    });

    it('должно закрыть модальное окно заказа', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодона')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="order-button"]').click();

      cy.wait('@createOrder');

      cy.get('[data-testid="modal-close"]').click();

      cy.get('[data-testid="order-modal"]').should('not.exist');
    });

    it('должно очистить конструктор после создания заказа', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодона')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();
      cy.get('[data-testid="constructor-ingredient"]').should('exist');
      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrder');
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="constructor-ingredient"]').should('not.exist');
      cy.get('[data-testid="constructor-bun-top"]').should('exist');
    });
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
