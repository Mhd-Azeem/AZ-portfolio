import { test, expect } from "@playwright/test";

test("motion remains usable when reduced-motion preference changes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("");
  await page
    .getByRole("button", { name: "View details about Jarvis", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#work h2")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    )
    .toBe("auto");
  expect(errors).toEqual([]);
});

test("responsive layout and existing assets load without errors", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "MOHAMMED",
  );
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await expect(page.locator(".skill-card")).toHaveCount(3);
  await expect(page.locator(".featured-card")).toHaveCount(3);
  expect(
    await page
      .locator(".portrait")
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.setViewportSize(
    testInfo.project.name === "mobile"
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 },
  );
  await page.screenshot({
    path: testInfo.outputPath("portfolio.png"),
    fullPage: true,
  });
});

test("project dialogs disclose concepts, trap focus and restore the trigger", async ({
  page,
}) => {
  await page.goto("");
  for (const name of ["AzMusic", "Jarvis", "AZ Remote Connect"]) {
    const trigger = page.getByRole("button", {
      name: `View details about ${name}`,
      exact: true,
    });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(name);
    await expect(dialog.locator(".preview-disclosure")).toContainText(
      "not screenshots",
    );
    await expect(dialog.locator(".az-project-preview")).toHaveCount(2);
    await expect(page.locator("main")).toHaveAttribute("inert", "");
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("link")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      dialog.getByRole("button", { name: "Close project details" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("main")).not.toHaveAttribute("inert");
  }
});

test("CV shows the real image and closes from backdrop", async ({ page }) => {
  await page.goto("");
  await page.getByRole("button", { name: "View My CV" }).click();
  const dialog = page.getByRole("dialog");
  const image = dialog.locator("img");
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(dialog.getByRole("link", { name: "Download" })).toHaveAttribute(
    "download",
    "Mohammed-Azeem-CV.png",
  );
  await page.locator(".az-modal-backdrop").click({ position: { x: 2, y: 2 } });
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View My CV" })).toBeFocused();
});

test("mobile navigation opens, navigates and dismisses", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Toolkit" })
    .click();
  await expect(page).toHaveURL(/#toolkit$/);
  await expect(page.getByRole("navigation")).toBeHidden();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
});
