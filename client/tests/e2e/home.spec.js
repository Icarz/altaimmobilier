import { test, expect } from '@playwright/test'
import { mockPublicAPI, MOCK_LISTINGS } from './fixtures.js'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicAPI(page)
    await page.goto('/')
  })

  test('renders hero section with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Trouvez/i })).toBeVisible()
  })

  test('renders all three category quick-links in the hero', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Appartements/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Maisons/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Villas/i }).first()).toBeVisible()
  })

  test('"Voir tous" link navigates to /listings', async ({ page }) => {
    await page.getByRole('link', { name: 'Voir tous →' }).click()
    await expect(page).toHaveURL('/listings')
  })

  test('category card navigates to /listings?category=villa', async ({ page }) => {
    // The categories section has three 3/4-aspect-ratio cards
    const villaCard = page.locator('a[href="/listings?category=villa"]').first()
    await expect(villaCard).toBeVisible()
    await villaCard.click()
    await expect(page).toHaveURL('/listings?category=villa')
  })

  test('renders "Nos catégories" section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Nos catégories/i })).toBeVisible()
  })

  test('renders "Sélection du moment" section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Sélection du moment/i })).toBeVisible()
  })

  test('featured listings load from API', async ({ page }) => {
    // Available listings: listing1 (villa, available) and listing2 (apartment, available)
    // listing3 is sold_rented so not shown in featured
    await expect(page.getByText('Villa Moderne Marrakech')).toBeVisible()
    await expect(page.getByText('Appartement Casablanca Centre')).toBeVisible()
  })

  test('sold/rented listing not shown in featured section', async ({ page }) => {
    // listing3 has status=sold_rented so filtered from featured
    await expect(page.getByText('Maison Rabat')).not.toBeVisible()
  })

  test('CTA banner is visible', async ({ page }) => {
    await expect(page.getByText(/Vous n'avez pas trouvé/i)).toBeVisible()
  })

  test('"Explorer tous les biens" CTA links to /listings', async ({ page }) => {
    const cta = page.getByRole('link', { name: /Explorer tous les biens/i })
    await expect(cta).toBeVisible()
    await cta.click()
    await expect(page).toHaveURL('/listings')
  })
})
