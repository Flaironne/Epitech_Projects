describe("Boards", () => {
  it("should view workspace boards", () => {
    cy.visit("/");
    cy.get("#sign-in").click();
    cy.get("#page-title").should("contain", "Workspaces");
    cy.get("#page-title").should("be.visible");
    cy.url().should("contain", "/pages/home");

    cy.wait(500);

    // @ts-ignore
    cy.get("#workspace-0").click();
    cy.get("#show-workspace-boards").should("be.visible");
  });

  it("should rename board", () => {
    cy.visit("/");
    cy.get("#sign-in").click();
    cy.get("#page-title").should("contain", "Workspaces");
    cy.get("#page-title").should("be.visible");
    cy.url().should("contain", "/pages/home");

    cy.wait(500);

    // @ts-ignore
    cy.get("#workspace-0").click();
    cy.get("#show-workspace-boards").should("be.visible");
    cy.get(`#board-0`).should("be.visible");
    cy.get(`#board-0`).click();
    cy.get("#update-board-modal").should("be.visible");
    cy.get("#update-board-modal").should("contain", "Name of your board");
    cy.get("#board-name-input").clear();
    let randomString = `AAAA1 ${Math.random().toString(36).substring(7)}`;
    cy.get("#board-name-input").type(randomString);
    cy.get("#submit-update-board").click();
    cy.get("#board-0").should("contain", randomString);
  });

  it("should create a new board (with manual option)", () => {
    cy.visit("/");
    cy.get("#sign-in").click();
    cy.get("#page-title").should("contain", "Workspaces");
    cy.get("#page-title").should("be.visible");
    cy.url().should("contain", "/pages/home");

    cy.wait(500);

    // @ts-ignore
    cy.get("#workspace-0").click();
    cy.get("#show-workspace-boards").should("be.visible");
    cy.get("#create-modal").click();
    cy.get("#button-container > :nth-child(1)").click();
    cy.get("#board-name-input").clear();

    // @ts-ignore
    let randomString = `AAAAA1 ${Math.random().toString(36).substring(7)}`;

    cy.get("#board-name-input").type(randomString);
    cy.get("#submit-create-board").click();
  });

  it("should create a new board (with template option)", () => {
    cy.visit("/");
    cy.get("#sign-in").click();
    cy.get("#page-title").should("contain", "Workspaces");
    cy.get("#page-title").should("be.visible");
    cy.url().should("contain", "/pages/home");

    cy.wait(500);

    // @ts-ignore
    cy.get("#workspace-0").click();
    cy.get("#show-workspace-boards").should("be.visible");
    cy.get("#create-modal").click();
    cy.get("#button-container > :nth-child(2)").click();
    cy.get("#submit-create-board").click();
  });
});
