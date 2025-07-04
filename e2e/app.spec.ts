import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/PromptForge/)
})

test('displays main heading', async ({ page }) => {
  await page.goto('/')
  const heading = page.getByRole('heading', { name: 'PromptForge' })
  await expect(heading).toBeVisible()
})