import { test, expect } from '@playwright/test'
import { mockPublicAPI, MOCK_LISTINGS } from './fixtures.js'

test.describe('Listings page', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicAPI(page)
  })

  test('shows "Tous les biens" heading with no filters', async ({ page }) => {
    await page.goto('/listings')
    await expect(page.getByRole('heading', { name: /Tous les biens/i })).toBeVisible()
  })

  test('shows listing count in subtitle', async ({ page }) => {
    await page.goto('/listings')
    // All 3 listings returned by mock
    await expect(page.getByText(/3 biens disponibles/i)).toBeVisible()
  })

  test('renders listing cards', async ({ page }) => {
    await page.goto('/listings')
    await expect(page.getByText('Villa Moderne Marrakech')).toBeVisible()
    await expect(page.getByText('Appartement Casablanca Centre')).toBeVisible()
    await expect(page.getByText('Maison Rabat')).toBeVisible()
  })

  test('filter by category=villa updates page title and URL', async ({ page }) => {
    await page.goto('/listings')
    // Click Villa filter button
    await page.getByRole('button', { name: /Villa/i }).click()
    await expect(page).toHaveURL(/category=villa/)
    await expect(page.getByRole('heading', { name: /Villas/i })).toBeVisible()
  })

  test('filter by category=apartment updates page title and URL', async ({ page }) => {
    await page.goto('/listings')
    await page.getByRole('button', { name: /Appartement/i }).click()
    await expect(page).toHaveURL(/category=apartment/)
    await expect(page.getByRole('heading', { name: /Appartements/i })).toBeVisible()
  })

  test('filter by type=sale updates URL', async ({ page }) => {
    await page.goto('/listings')
    await page.getByRole('button', { name: 'À vendre' }).click()
    await expect(page).toHaveURL(/type=sale/)
    await expect(page.getByRole('heading', { name: /à vendre/i })).toBeVisible()
  })

  test('filter by type=rent updates URL', async ({ page }) => {
    await page.goto('/listings')
    await page.getByRole('button', { name: 'À louer' }).click()
    await expect(page).toHaveURL(/type=rent/)
    await expect(page.getByRole('heading', { name: /à louer/i })).toBeVisible()
  })

  test('URL query params pre-select filters on page load', async ({ page }) => {
    await page.goto('/listings?category=villa&type=sale')
    await expect(page.getByRole('heading', { name: /Villas à vendre/i })).toBeVisible()
    await expect(page).toHaveURL(/category=villa/)
    await expect(page).toHaveURL(/type=sale/)
  })

  test('empty state shown when no listings match filters', async ({ page }) => {
    // Override: return empty for this request
    await page.route('http://localhost:5000/api/listings*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    )
    await page.goto('/listings?category=villa&type=rent')
    await expect(page.getByText(/Aucun résultat/i)).toBeVisible()
  })

  test('sold listing shows "Vendu" badge', async ({ page }) => {
    await page.goto('/listings')
    // listing3 is house/sale/sold_rented → badge "Vendu"
    await expect(page.getByText('Vendu')).toBeVisible()
  })

  test('listing card links to detail page via slug', async ({ page }) => {
    await mockPublicAPI(page)
    await page.goto('/listings')
    await page.getByText('Villa Moderne Marrakech').click()
    await expect(page).toHaveURL('/listings/villa-moderne-marrakech')
  })

  test('price shown in both MAD and EUR', async ({ page }) => {
    await page.goto('/listings')
    // Villa listing: 3 500 000 MAD · 324 074 €
    await expect(page.getByText(/MAD/).first()).toBeVisible()
    await expect(page.getByText(/€/).first()).toBeVisible()
  })
})
