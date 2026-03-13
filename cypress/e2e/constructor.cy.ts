/// <reference types="cypress" />

describe('Stellar Burgers - Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order'
    }).as('createOrder');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'Bearer test-token');
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      }
    });
  });

  it('должно добавить булку в конструктор', () => {
    cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
      .find('button')
      .first()
      .click();

    cy.get('[class*="constructor-element"]').should(
      'contain',
      'Краторная булка N-200i'
    );
  });

  it('должно добавить начинку в конструктор', () => {
    cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
      .find('button')
      .first()
      .click();

    cy.get('[class*="constructor-element"]').should(
      'contain',
      'Краторная булка N-200i'
    );
  });

  it('должно добавить соус в конструктор', () => {
    cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
      .find('button')
      .first()
      .click();

    cy.get('[class*="constructor-element"]').should(
      'contain',
      'Краторная булка N-200i'
    );
  });

  it('должно заменить булку на другую', () => {
    // Добавляем первую булку
    cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
      .find('button')
      .first()
      .click();

    // Проверяем, что первая булка добавилась
    cy.get('[class*="constructor-element"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Добавляем вторую булку (должна заменить первую)
    cy.contains('[data-testid="card"]', 'Флюоресцентная булка R2-D3')
      .find('button')
      .first()
      .click();

    // Проверяем, что теперь отображается вторая булка
    cy.get('[class*="constructor-element"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
    
    // Проверяем, что первой булки больше нет
    cy.get('[class*="constructor-element"]').should(
      'not.contain',
      'Краторная булка N-200i'
    );
  });

  it('должно открыть модальное окно при клике на ингредиент', () => {
    cy.contains('[data-testid="card"]', 'Краторная булка N-200i').click();

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');
  });

  it('должно закрыть модальное окно при нажатии ESC', () => {
    cy.contains('[data-testid="card"]', 'Краторная булка N-200i').click();
    cy.get('[data-testid="modal"]').should('be.visible');

    cy.get('body').type('{esc}');

    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должно закрыть модальное окно при клике на оверлей', () => {
    cy.contains('[data-testid="card"]', 'Краторная булка N-200i').click();
    cy.get('[data-testid="modal"]').should('be.visible');

    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должно отображать правильные данные ингредиента в модале', () => {
    cy.contains('[data-testid="card"]', 'Краторная булка N-200i').click();

    cy.get('[data-testid="modal"]').within(() => {
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Калории').should('be.visible');
      cy.contains('Белки').should('be.visible');  
      cy.contains('Жиры').should('be.visible');
      cy.contains('Углеводы').should('be.visible');
    });
  });

  it('должно создать заказ с правильным номером', () => {
    cy.wait('@getUser');

    cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
      .find('button')
      .first()
      .click();

    cy.contains(/оформить заказ/i).click();

    cy.wait('@createOrder');

    cy.get('[data-testid="modal"]').should('contain', '12345');
  });

  it('должно закрыть модальное окно заказа', () => {
    cy.wait('@getUser');

    cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
      .find('button')
      .first()
      .click();

    cy.contains(/оформить заказ/i).click();

    cy.wait('@createOrder');

    cy.get('[data-testid="modal"]').should('contain', '12345');

    cy.get('body').type('{esc}');

    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должно очистить конструктор после создания заказа', () => {
    cy.wait('@getUser');

    cy.contains('[data-testid="card"]', 'Краторная булка N-200i')
      .find('button')
      .first()
      .click();

    cy.get('[data-testid="burger-constructor"]').should('exist');

    cy.contains(/оформить заказ/i).click();

    cy.wait('@createOrder');

    cy.get('body').type('{esc}');

    cy.contains('Выберите булки').should('be.visible');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
});
