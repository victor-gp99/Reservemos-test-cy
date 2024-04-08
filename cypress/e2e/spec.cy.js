describe('Code Challenge: Simple purchases', function() {
  
  beforeEach(function() { 
    cy.fixture('testData').then((data) => {
      this.data = data;
    });
    cy.visit('https://roll-bits.reservamos-saas.com/');
  });

  it('Simple purchase for CDMX-LEON', function() { 
    selectOriginDestination(this.data.origin, this.data.destination);
    selectSeats();
    fillPassengerInformation(this.data.name, this.data.last_name, this.data.email);
    fillPaymentMethod(this.data.encryptedCardNumber, this.data.encryptedExpiryDate, this.data.encryptedSecurityCode,this.data.name, this.data.last_name);
  });

  function selectOriginDestination(origin, destination) {
    cy.get('input#txtorigin-desktop').click({force:true});
    cy.get('div.place-info').contains(origin).click({force:true});
    cy.get('input#txtdestination-desktop').click({force:true});
    cy.get('div.place-info').contains(destination).click({force:true});
    cy.get('.dates-controls-wrapped > :nth-child(2)').click({force:true});
    cy.get('.search-button').click({force:true});
    cy.get('.results-title').should('contain', 'Seleccionar horario de ida');
  }
  function selectSeats() {
    cy.get('div.matrix-action button').eq(1).click({force:true});
    cy.wait(1000);
    cy.get('.selected-seats').should('contain', 'Elige los asientos que necesites');
    cy.get('.seat-available').then(($seats) => {
      const randomIndex = Math.floor(Math.random() * $seats.length);
      cy.wrap($seats[randomIndex]).click({force:true});
    });
    cy.get('button.main-button').click({force:true});
  }
  function fillPassengerInformation(name, lastName, email) {
    cy.get('div.passengers-heading').should('contain', 'Pasajero');
    cy.get('input[placeholder="Nombre (s)"]').type(name);
    cy.get('input[placeholder="Apellido Paterno"]').type(lastName);
    cy.get('input[placeholder="Correo electrónico"]').type(email);
    cy.get('button.main-button').click({force:true});
  }
  //Here we are using the window object to stub the postMessage function that is used to communicate with the Adyen iframe but the 
  //CORS policy is blocking the communication
  function fillPaymentMethod(encryptedCardNumber, encryptedExpiryDate, encryptedSecurityCode, name, lastName) {
    cy.wait(10000);
    cy.get('input#check-passengers').check({force:true});
    let randomPhoneNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    cy.get('input#phone').type(randomPhoneNumber.toString());
    cy.window().then((win) => {
      cy.stub(win, 'postMessage').callsFake((message, targetOrigin) => {
        if (targetOrigin === 'https://secure.adyen.com') {
          // Simula la interacción con los campos seguros
          if (message.action === 'encryptedCardNumber') {
            return Promise.resolve({ data: 'encryptedCardNumber' });
          } else if (message.action === 'encryptedExpiryDate') {
            return Promise.resolve({ data: 'encryptedExpiryDate' });
          } else if (message.action === 'encryptedSecurityCode') {
            return Promise.resolve({ data: 'encryptedSecurityCode' });
          }
        }
      });
    });
    cy.get('iframe.js-iframe').then($iframe => {
      const iframe = $iframe.contents();
      cy.wrap(iframe.find('input[data-fieldtype="encryptedCardNumber"]')).type(encryptedCardNumber);
      cy.wrap(iframe.find('input[data-fieldtype="encryptedExpiryDate"]')).type(encryptedExpiryDate);
      cy.wrap(iframe.find('input[data-fieldtype="encryptedSecurityCode"]')).type(encryptedSecurityCode);
  });
    cy.get('input.adyen-checkout__input.adyen-checkout__input--text.adyen-checkout__card__holderName__input').type(name + ' ' + lastName);
    cy.get('button.main-button').click();
  }
});