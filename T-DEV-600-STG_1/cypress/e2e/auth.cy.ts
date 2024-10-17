describe("Login Test", () => {
  it("should display an error message when the token is invalid", () => {
    cy.visit("/");
    cy.get("#api-token").clear();
    cy.get("#api-token").type("invalid-token");
    cy.get("#sign-in").click();
    cy.get("#error-message").should("contain", "Your token is invalid");
  });

  it("should login successfully using the token specified in the environment variable", () => {
    cy.visit("/");
    cy.get("#sign-in").click();
    cy.get("#page-title").should("contain", "Workspaces");
    cy.get("#page-title").should("be.visible");
    cy.url().should("contain", "/pages/home");
  });

  it("should redirect to the home page after a successful login", () => {
    cy.visit("/");
    cy.get("#api-token").clear();
    cy.get("#api-token").type(Cypress.env("EXPO_PUBLIC_API_TOKEN"));
    cy.get("#sign-in").click();
    cy.get("#page-title").should("contain", "Workspaces");
    cy.get("#page-title").should("be.visible");
    cy.url().should("contain", "/pages/home");
  });
});
