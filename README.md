# Cypress Testing Project

This project uses Cypress to automate a simple purchase test flow on the travel booking site https://roll-bits.reservamos-saas.com/.

## Code

The main code is located in the `spec.cy.js` file. This file contains a series of functions that interact with the elements on the web page.

## Limitations

Due to the same-origin policy (CORS) implemented in web browsers, Cypress cannot directly interact with elements within an iframe that is on a different domain. This is a known limitation of Cypress and can cause errors when running the script. For this reason, the code gives an error when looking for the element `cy.wrap(iframe.find('input[data-fieldtype="encryptedCardNumber"]')).type(encryptedCardNumber);`.
I tried several solutions, such as waiting for the iframe to load completely and verifying that the selectors of the elements are correct. However, these solutions have not solved the problem due to the same-origin policy.
There are alternative solutions such as: configuring a proxy server so that the iframe content appears to come from the same origin with Burpsuite, or simulating user actions by sending the corresponding events. However, these solutions can be complicated to implement and may not be the best option for a test.
The most viable option would be the use of a different testing tool that does not have this limitation, such as Selenium. However, this would require a significant change in the approach to testing and I have no experience with Selenium, I can learn it if necessary.

## How to run the script

To run the script, follow these steps:

1. Make sure you have Node.js and npm installed on your system. You can download them from here.

2. Clone this repository to your local system.

3. Navigate to the project directory.

4. Run the following command to install Cypress dependencies:

    ```bash
    npm install
    ```

5. Run the following command to open the Cypress interface:

    ```bash
    npx cypress open
    ```

6. In the Cypress interface that opens, select the `spec.cy.js` file to run the script.

**Please note that due to Cypress's limitations with iframes from different origins, some parts of the script may not execute correctly.**
