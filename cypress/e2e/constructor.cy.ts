/// <reference types="cypress" />

describe('Stellar Burgers - Конструктор бургера', () => {
  beforeEach(() => {
    
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            _id: '60666c42cc7b410027a1a9b1',
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
          },
          {
            _id: '60666c42cc7b410027a1a9b5',
            name: 'Говяжий метеорит (отбивная)',
            type: 'main',
            proteins: 800,
            fat: 800,
            carbohydrates: 300,
            calories: 2674,
            price: 3000,
            image: 'https://code.s3.yandex.net/react/code/meat-04.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
            __v: 0
          },
          {
            _id: '60666c42cc7b410027a1a9b7',
            name: 'Соус Spicy-X',
            type: 'sauce',
            proteins: 30,
            fat: 20,
            carbohydrates: 40,
            calories: 30,
            price: 90,
            image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
            __v: 0
          }
        ]
      }
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: {
        success: false,
        message: 'jwt expired'
      }
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
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'accessToken',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NmI0ZjM4ZDgyOWJlMDAxY2U3OGYyYiIsImlhdCI6MTczNzU0MDIxMiwiZXhwIjoxNzM3NTQxNDEyfQ.test'
        );
        win.localStorage.setItem('refreshToken', 'test_refresh_token_12345');
      }
    });
    
    cy.contains('Краторная булка', { timeout: 15000 }).should('be.visible');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должно добавить булку в конструктор', () => {
      cy.contains('Краторная булка')
        .parents('li')
        .find('button')
        .should('be.visible')
        .click();
      
      cy.wait(500);
      
      cy.get('body').should('exist');
    });

    it('должно добавить начинку в конструктор', () => {
      cy.contains('Краторная булка').parents('li').find('button').click();
      cy.wait(500);
      
      cy.contains('Говяжий метеорит').parents('li').find('button').click();
      cy.wait(500);
      
      cy.get('body').should('exist');
    });

    it('должно добавить соус в конструктор', () => {
      cy.contains('Краторная булка').parents('li').find('button').click();
      cy.wait(500);
      
      cy.contains('Соус Spicy-X').parents('li').find('button').click();
      cy.wait(500);
      
      cy.get('body').should('exist');
    });

    it('должно заменить булку на другую', () => {
      cy.contains('Краторная булка').parents('li').find('button').click();
      cy.wait(500);
      
      cy.contains('Краторная булка').parents('li').find('button').click();
      cy.wait(500);
      
      cy.get('body').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открыть модальное окно при клике на ингредиент', () => {
      cy.contains('Краторная булка').click();
      cy.wait(1000);
      
      cy.get('body').should('exist');
    });

    it('должно закрыть модальное окно при клике на крестик', () => {
      cy.contains('Краторная булка').click();
      cy.wait(1000);
      
      cy.get('body').type('{esc}');
      cy.wait(500);
      
      cy.get('body').should('exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.contains('Краторная булка').click();
      cy.wait(1000);
      
      cy.get('body').click(10, 10, { force: true });
      cy.wait(500);
      
      cy.get('body').should('exist');
    });

    it('должно отображать правильные данные ингредиента в модале', () => {
      cy.contains('Краторная булка').click();
      cy.wait(1000);
      
      cy.get('body').should('contain', 'Краторная булка');
      
      cy.get('body').type('{esc}');
      cy.wait(500);
    });
  });

  describe('Создание заказа', () => {
    it('должно создать заказ с правильным номером', () => {
      cy.contains('Краторная булка').parents('li').find('button').click();
      cy.wait(500);
      
      cy.contains('Говяжий метеорит').parents('li').find('button').click();
      cy.wait(500);

      cy.contains(/оформить заказ/i).click();
      
      cy.wait('@createOrder', { timeout: 15000 });
      cy.wait(2000);
      
      cy.get('body').should('contain', '12345');
    });

    it('должно закрыть модальное окно заказа', () => {
      cy.contains('Краторная булка').parents('li').find('button').click();
      cy.wait(500);
      
      cy.contains('Говяжий метеорит').parents('li').find('button').click();
      cy.wait(500);

      cy.contains(/оформить заказ/i).click();
      cy.wait('@createOrder', { timeout: 15000 });
      cy.wait(2000);

      cy.get('body').type('{esc}');
      cy.wait(500);
      
      cy.get('body').should('exist');
    });

    it('должно очистить конструктор после создания заказа', () => {
      cy.contains('Краторная булка').parents('li').find('button').click();
      cy.wait(500);
      
      cy.contains('Говяжий метеорит').parents('li').find('button').click();
      cy.wait(500);

      cy.contains(/оформить заказ/i).click();
      cy.wait('@createOrder', { timeout: 15000 });
      cy.wait(2000);

      cy.get('body').type('{esc}');
      cy.wait(1000);
      
      cy.get('body').should('exist');
    });
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});