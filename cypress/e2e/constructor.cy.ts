/// <reference types="cypress" />

describe('Stellar Burgers - Конструктор бургера', () => {
  beforeEach(() => {
    cy.visit('/', {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'Bearer test-token');
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      }
    });

    cy.intercept('GET', 'https://norma.education-services.ru/api/ingredients', { 
      fixture: 'ingredients.json' 
    }).as('getIngredients');

    cy.intercept('GET', 'https://norma.education-services.ru/api/auth/user', { 
      fixture: 'user.json' 
    }).as('getUser');

    cy.intercept('GET', 'https://norma.education-services.ru/api/orders/all', { 
      fixture: 'orders.json' 
    }).as('getOrders');

    cy.intercept('POST', 'https://norma.education-services.ru/api/orders', { 
      fixture: 'order.json' 
    }).as('createOrder');

    cy.wait('@getIngredients');
    cy.contains('Краторная булка N-200i', { timeout: 100 }).should('be.visible');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должно добавить булку в конструктор', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
        .find('button')
        .first()
        .click();

      cy.get('[class*="constructor-element"]').should('contain', 'Краторная булка N-200i');
    });

    it('должно добавить начинку в конструктор', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
        .find('button')
        .first()
        .click();

      cy.contains('[data-testid="card"]', 'Филе Люминесцентного тетраодона')
        .find('button')
        .first()
        .click();

      cy.get('[class*="constructor-element"]').should('contain', 'Филе Люминесцентного тетраодона');
    });

    it('должно добавить соус в конструктор', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
        .find('button')
        .first()
        .click();

      cy.contains('[data-testid="card"]', 'Соус Фалленианского плотоядного растения')
        .find('button')
        .first()
        .click();

      cy.get('[class*="constructor-element"]').should('contain', 'Соус Фалленианского плотоядного растения');
    });

    it('должно заменить булку на другую', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
        .find('button')
        .first()
        .click();

      cy.contains('[data-testid="card"]', 'Флюоресцентная булка R2-D3')
        .find('button')
        .first()
        .click();

      cy.get('[class*="constructor-element"]').should('contain', 'Флюоресцентная булка R2-D3');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открыть модальное окно при клике на ингредиент', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i').click();
      
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должно закрыть модальное окно при нажатии ESC', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i').click();
      cy.get('[class*="modal"]').should('be.visible');
      
      cy.get('body').type('{esc}');
      
      cy.get('[class*="modal"]').should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i').click();
      cy.get('[class*="modal"]').should('be.visible');
      
      cy.get('[class*="modal-overlay"]').click({ force: true });
      
      cy.get('[class*="modal"]').should('not.exist');
    });

    it('должно отображать правильные данные ингредиента в модале', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i').click();
      
      cy.get('[class*="modal"]').within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
        cy.contains('1255').should('be.visible');
        cy.contains('Калории').should('be.visible');
        cy.contains('Белки').should('be.visible');
        cy.contains('Жиры').should('be.visible');
        cy.contains('Углеводы').should('be.visible');
      });
    });
  });

  describe('Создание заказа', () => {
    it('должно создать заказ с правильным номером', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
        .find('button')
        .first()
        .click();

      cy.contains('[data-testid="card"]', 'Филе Люминесцентного тетраодона')
        .find('button')
        .first()
        .click();

      cy.contains(/оформить заказ/i).click();

      cy.wait('@createOrder');

      cy.get('[class*="modal"]').should('contain', '12345');
    });

    it('должно закрыть модальное окно заказа', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
        .find('button')
        .first()
        .click();

      cy.contains('[data-testid="card"]', 'Филе Люминесцентного тетраодона')
        .find('button')
        .first()
        .click();

      cy.contains(/оформить заказ/i).click();

      cy.wait('@createOrder');

      cy.get('[class*="modal"]').should('contain', '12345');
      
      cy.get('body').type('{esc}');
      
      cy.get('[class*="modal"]').should('not.exist');
    });

    it('должно очистить конструктор после создания заказа', () => {
      cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
        .find('button')
        .first()
        .click();

      cy.contains('[data-testid="card"]', 'Филе Люминесцентного тетраодона')
        .find('button')
        .first()
        .click();

      cy.get('[class*="constructor-element"]').should('exist');

      cy.contains(/оформить заказ/i).click();
      
      cy.wait('@createOrder');
      
      cy.get('body').type('{esc}');

      cy.contains('Выберите булку', { timeout: 100 }).should('be.visible');
    });
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});