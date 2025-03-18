describe("Create post and delete", () => {
  const postText = "Test Post";
  const email = "kandidat@example.com";
  const password = "RandomPassword123*!";

  it("Create post", () => {
    cy.visit("/login");

    cy.intercept("**/v3/posts").as("newPost");
    cy.intercept("**/v3/posts/**").as("deletePost");

    //Login using password
    cy.get("button").contains("Use password").should("be.visible").click();
    cy.contains("Use password to log in").should("be.visible");
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.contains("Log in").should("be.visible").click();
    cy.url().should("include", "/feed");

    // Create post
    cy.get('[data-test-id="panel_start-conversation"]').click();
    cy.get('[data-test-id="post-editor_header"]').click();
    cy.get(".ant-select-item-option-content", { timeout: 10000 })
      .contains("BigHeart Philanthropy")
      .click();
    cy.get('[data-test-id="post-editor_content"]')
      .should("be.visible")
      .find(".ck-editor__editable_inline[contenteditable=true]")
      .then((el) => {
        // @ts-ignore
        const editor = el[0].ckeditorInstance;
        editor.setData(postText);
      });

    cy.get("#btn_submit-post").should("have.attr", "type", "submit").click();
    cy.wait("@newPost").then(({ response }) => {
      expect(response?.statusCode).to.eq(201);
      expect(response?.body.post.text_content).to.contain(postText);
    });

    // Assert that post IS visible in the feed
    cy.get(".ant-card-body").contains(postText).should("be.visible");

    // Find the heading with the text "Pohovor Kandidat" and navigate to its parent structure
    cy.contains("h4", "Pohovor Kandidat")
      .parents(".feed-header")
      .find("button.ant-dropdown-trigger")
      .click();

    // Select the Delete option from the dropdown with a timeout
    cy.contains("Delete", { timeout: 10000 }).click();
    cy.wait("@deletePost").then((interception) => {
      expect(interception.request.method).to.eq("DELETE");
      expect(interception.response?.statusCode).to.eq(204);
    });
    // Assert that post is NOT visible in the feed
    // cy.get(".ant-card-body").contains(postText).should("not.be.visible");
  });
});
