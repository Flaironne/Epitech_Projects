describe("My cards", () => {
  it("should navigate to my cards tab", () => {
    cy.visit("/");
    cy.get("#sign-in").click();
    cy.get("#page-title").should("contain", "Workspaces");
    cy.get("#page-title").should("be.visible");
    cy.wait(1000);

    // @ts-ignore
    cy.get(
      ".css-text-146c3p1.r-display-6koalj.r-alignItems-1awozwy.r-flex-13awgt0.r-flexDirection-18u37iz.r-justifyContent-1777fci.r-cursor-1loqt21",
      {
        multiple: true,
      }
    )
      .eq(1)
      .click();

    cy.wait(1000);

    cy.get("#cards").should("be.visible");
  });
});
