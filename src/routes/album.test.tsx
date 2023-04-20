import { chromium } from 'playwright'
import { test, expect } from '@playwright/test'

test('renders album information', async () => {
  // setup
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  // navigation
  await page.goto('http://localhost:3000/')
  await page.click('text=Heroes')

  // route test
  const albumTitle = page.getByText(
    'David Bowie (aka Space Oddity) [2015 Remaster]'
  )
  const artistName = page.getByText('David Bowie')
  const summary = page.getByText(
    /David Bowie \(commonly known as Space Oddity\)/i
  )
  expect(albumTitle).not.toBeNull()
  expect(artistName).not.toBeNull()
  expect(summary).not.toBeNull()

  // teardown
  await browser.close()
})
