import { test, expect } from '@playwright/test'
import { mockPublicAPI, mockLogin, MOCK_LISTINGS } from './fixtures.js'

test.describe('Admin — auth protection', () => {
  test.beforeEach(async ({ page }) => {
    // Not authenticated by default
    await mockPublicAPI(page, { authenticated: false })
  })

  test('/admin redirects to /admin/login when not authenticated', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL('/admin/login')
  })

  test('/admin/listings redirects to /admin/login when not authenticated', async ({ page }) => {
    await page.goto('/admin/listings')
    await expect(page).toHaveURL('/admin/login')
  })

  test('/admin/listings/new redirects to /admin/login when not authenticated', async ({ page }) => {
    await page.goto('/admin/listings/new')
    await expect(page).toHaveURL('/admin/login')
  })
})

test.describe('Admin login page', () => {
  test.beforeEach(async ({ page }) => {
    await mockPublicAPI(page, { authenticated: false })
    await page.goto('/admin/login')
    // Wait for the form to be rendered (auth check completed)
    await page.getByRole('heading', { name: /Connexion/i }).waitFor()
  })

  test('renders "Connexion" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Connexion/i })).toBeVisible()
  })

  test('shows email and password fields', async ({ page }) => {
    await expect(page.getByPlaceholder('admin@altaimmobilier.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('shows demo credentials hint', async ({ page }) => {
    await expect(page.getByText(/admin@altaimmobilier\.com.*admin123/i)).toBeVisible()
  })

  test('shows "Se connecter" submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Se connecter/i })).toBeVisible()
  })

  test('"Retour au site" link navigates to homepage', async ({ page }) => {
    await page.getByRole('link', { name: /Retour au site/i }).click()
    await expect(page).toHaveURL('/')
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await mockLogin(page, 'failure')
    await page.getByPlaceholder('admin@altaimmobilier.com').fill('wrong@email.com')
    await page.getByPlaceholder('••••••••').fill('badpass')
    await page.getByRole('button', { name: /Se connecter/i }).click()
    await expect(page.getByText(/Email ou mot de passe incorrect/i)).toBeVisible()
  })

  test('shows loading state during submit', async ({ page }) => {
    // Delay the login response so we can catch the loading text
    await page.route('http://localhost:5000/api/auth/login', async (route) => {
      await new Promise((r) => setTimeout(r, 800))
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Nope' }) })
    })
    await page.getByPlaceholder('admin@altaimmobilier.com').fill('admin@altaimmobilier.com')
    await page.getByPlaceholder('••••••••').fill('admin123')
    await page.getByRole('button', { name: /Se connecter/i }).click()
    // Button shows loading text briefly
    await expect(page.getByRole('button', { name: /Connexion…/i })).toBeVisible()
  })

  test('successful login redirects to /admin', async ({ page }) => {
    // Override login endpoint to succeed — must be registered after beforeEach's
    // mockPublicAPI so this handler takes precedence (Playwright matches last-added first)
    await page.route('http://localhost:5000/api/auth/login', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
    )
    await page.route('http://localhost:5000/api/admin/listings**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LISTINGS) })
    )

    await page.getByPlaceholder('admin@altaimmobilier.com').fill('admin@altaimmobilier.com')
    await page.getByPlaceholder('••••••••').fill('admin123')
    await page.getByRole('button', { name: /Se connecter/i }).click()
    await expect(page).toHaveURL('/admin')
  })
})

test.describe('Admin — authenticated session', () => {
  test.beforeEach(async ({ page }) => {
    // Simulate an active session
    await mockPublicAPI(page, { authenticated: true })
    await page.route('http://localhost:5000/api/admin/listings**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LISTINGS) })
    )
  })

  test('/admin/login redirects authenticated user to /admin', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page).toHaveURL('/admin')
  })

  test('admin dashboard is accessible when authenticated', async ({ page }) => {
    await page.goto('/admin')
    // Should NOT redirect to login
    await expect(page).toHaveURL('/admin')
    await expect(page).not.toHaveURL('/admin/login')
  })
})
