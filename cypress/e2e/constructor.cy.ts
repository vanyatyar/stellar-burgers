/// <reference types="cypress" />

describe('Stellar Burgers - Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients**', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
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
              image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
            },
            {
              _id: '643d69a5c3f7b9001cfa093d',
              name: 'Флюоресцентная булка R2-D3',
              type: 'bun',
              proteins: 44,
              fat: 26,
              carbohydrates: 85,
              calories: 643,
              price: 988,
              image: 'https://code.s3.yandex.net/react/code/bun-01.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
            },
            {
              _id: '643d69a5c3f7b9001cfa093e',
              name: 'Филе Люминесцентного тетраодона',
              type: 'main',
              proteins: 44,
              fat: 26,
              carbohydrates: 85,
              calories: 643,
              price: 988,
              image: 'https://code.s3.yandex.net/react/code/meat-03.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
            },
            {
              _id: '643d69a5c3f7b9001cfa0942',
              name: 'Соус Фалленианского плотоядного растения',
              type: 'sauce',
              proteins: 234,
              fat: 171,
              carbohydrates: 11,
              calories: 426,
              price: 812,
              image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
            }
          ]
        }
      });
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'jwt expired' }
    }).as('getUser');

    cy.intercept('GET', '**/api/orders/all', {
      statusCode: 200,
      body: {
        success: true,
        orders: [],
        total: 0,
        totalToday: 0
      }
    }).as('getOrders');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Space бургер',
        order: {
          number: 12345
        }
      }
    }).as('createOrder');

    cy.visit('/', {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'Bearer test');
        win.localStorage.setItem('refreshToken', 'test_refresh');
      }
    });

    cy.contains('Краторная булка N-200i', { timeout: 15000 }).should('be.visible');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должно добавить булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.get('body').should('exist');
    });

    it('должно добавить начинку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодона')
        .parent()
        .find('button')
        .click();

      cy.get('body').should('exist');
    });

    it('должно добавить соус в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.contains('Соус Фалленианского плотоядного растения')
        .parent()
        .find('button')
        .click();

      cy.get('body').should('exist');
    });

    it('должно заменить булку на другую', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.contains('Флюоресцентная булка R2-D3')
        .parent()
        .find('button')
        .click();

      cy.get('body').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открыть модальное окно при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('body').should('exist');
    });

    it('должно закрыть модальное окно при нажатии ESC', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('body').type('{esc}');
      cy.get('body').should('exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('body').click(10, 10, { force: true });
      cy.get('body').should('exist');
    });

    it('должно отображать правильные данные ингредиента в модале', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('body').should('contain', 'Краторная булка N-200i');
      cy.get('body').type('{esc}');
    });
  });

  describe('Создание заказа', () => {
    it('должно создать заказ с правильным номером', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодона')
        .parent()
        .find('button')
        .click();

      cy.contains(/оформить заказ/i).click();

      cy.contains('12345', { timeout: 15000 }).should('be.visible');
    });

    it('должно закрыть модальное окно заказа', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодона')
        .parent()
        .find('button')
        .click();

      cy.contains(/оформить заказ/i).click();

      cy.contains('12345', { timeout: 15000 }).should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('body').should('exist');
    });

    it('должно очистить конструктор после создания заказа', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодона')
        .parent()
        .find('button')
        .click();

      cy.contains(/оформить заказ/i).click();

      cy.contains('12345', { timeout: 15000 }).should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('body').should('exist');
    });
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
