import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdir } from 'node:fs/promises'
import { homeReadings, homeMean } from '../src/data/clinical'

async function checkLayout(page: Page, modal = false) {
  const issues = await page.evaluate((isModal) => {
    const issues: string[] = []
    if (document.documentElement.scrollWidth > innerWidth) issues.push('Page overflows horizontally')
    const selector = isModal ? 'dialog[open], dialog[open] *' : 'header *, main *, footer *'
    for (const el of document.querySelectorAll<HTMLElement>(selector)) {
      if (el instanceof SVGElement) continue
      const box = el.getBoundingClientRect()
      if (!box.width || !box.height) continue
      if (box.left < -1 || box.right > innerWidth + 1) issues.push(`Outside viewport: ${el.className}`)
      if (el.clientWidth && el.scrollWidth > el.clientWidth + 1) issues.push(`Clipped content: ${el.className}`)
      if (/gradient/.test(getComputedStyle(el).backgroundImage)) issues.push(`Gradient: ${el.className}`)
    }
    for (const group of ['.header-inner', '.header-tools', '.priority-row', '.supporting-information', '.detail-layout', '.chart-records', '.clinical-facts', '.timeline-event', '.drawer-header']) {
      for (const parent of document.querySelectorAll(group)) {
        const boxes = [...parent.children].map((el) => ({ rect: el.getBoundingClientRect(), name: el.className }))
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i].rect, b = boxes[j].rect
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) issues.push(`Overlap: ${boxes[i].name} / ${boxes[j].name}`)
        }
      }
    }
    if (isModal) {
      const box = document.querySelector('dialog[open]')!.getBoundingClientRect()
      if (box.top < 0 || box.bottom > innerHeight + 1) issues.push('Drawer extends outside viewport')
    }
    return issues
  }, modal)
  expect(issues).toEqual([])
}

async function capture(page: Page, name: string, width: number, modal = false) {
  await page.evaluate(() => document.fonts.ready)
  await checkLayout(page, modal)
  await mkdir('.impeccable/review/final', { recursive: true })
  await page.screenshot({ path: `.impeccable/review/final/${name}-${width}.png`, fullPage: !modal })
}

for (const width of [1440, 1024, 390, 320]) {
  test(`Complete care story at ${width}px`, async ({ page }) => {
    test.setTimeout(60000)
    await page.setViewportSize({ width, height: 1000 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('What matters right now')
    await expect(page.getByRole('article')).toHaveCount(3)
    await expect(page.getByText('3 active priorities')).toBeVisible()
    await expect(page.getByText('138 / 86', { exact: true })).toBeVisible()
    await capture(page, 'today', width)
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([])

    await page.getByRole('link', { name: 'View priority: Blood pressure' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blood pressure')
    await expect(page.locator('main')).toBeFocused()
    await expect(page.getByRole('link', { name: 'Today', exact: true })).toHaveAttribute('aria-current', 'location')
    await expect(page.getByRole('img', { name: 'Blood pressure relative to the earlier baseline' })).toBeVisible()
    // SVG text must remain readable after responsive plot reflow.
    await expect.poll(() => page.locator('.chart-label').first().evaluate((el) => {
      const label = el as SVGTextElement
      return parseFloat(getComputedStyle(label).fontSize) * label.getScreenCTM()!.a
    })).toBeGreaterThanOrEqual(10.9)
    await capture(page, 'detail', width)
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])

    const evidenceButton = page.getByRole('button', { name: 'Why am I seeing this?' })
    await evidenceButton.click()
    const drawer = page.getByRole('dialog')
    await expect(drawer).toBeVisible()
    await expect(drawer.getByRole('heading', { name: 'Why this is a priority' })).toBeVisible()
    await expect(drawer.getByText('Clinician reviewed')).toBeVisible()
    await capture(page, 'evidence', width, true)
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('Tab')
      expect(await drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    }
    await drawer.getByRole('button', { name: 'View source: Home blood pressure log' }).click()
    await expect(drawer.getByRole('heading', { name: 'Patient-recorded home measurements' })).toBeVisible()
    await expect(drawer.locator('tbody tr')).toHaveCount(7)
    await expect(drawer.locator('tfoot')).toContainText('138')
    await capture(page, 'source', width, true)
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
    await drawer.getByRole('button', { name: 'Back to evidence' }).click()
    await expect(drawer.getByRole('button', { name: 'View source: Home blood pressure log' })).toBeFocused()
    await drawer.getByRole('button', { name: 'View source: PHC visit' }).click()
    await expect(drawer.getByText('142 / 88 mmHg')).toBeVisible()
    await drawer.getByRole('button', { name: 'Back to evidence' }).click()
    await drawer.getByRole('button', { name: 'View source: Historical measurements' }).click()
    await expect(drawer.getByText('126 / 78 mmHg')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(drawer).toHaveCount(0)
    await expect(evidenceButton).toBeFocused()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

    await page.getByRole('button', { name: 'Clinician', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Clinical context' })).toBeVisible()
    await expect(page.getByText('Recent observations: n = 7')).toBeVisible()
    await expect(page.getByText('Baseline observations: n = 18')).toBeVisible()
    await expect(page.getByText('Confirm home measurement consistency')).toBeVisible()
    await capture(page, 'clinician', width)
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
    await page.locator('.supporting-records button').first().click()
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'PHC visit', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Close evidence' }).click()
    await expect(page.locator('.supporting-records button').first()).toBeFocused()

    await page.getByRole('button', { name: 'Patient', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Clinical context' })).toHaveCount(0)
    await page.getByRole('link', { name: 'Health over time', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Health over time')
    await expect(page.locator('.timeline-event')).toHaveCount(7)
    await capture(page, 'timeline', width)
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([])
    await page.getByRole('button', { name: 'Vitamin D', exact: true }).click()
    await expect(page.locator('.timeline-event')).toHaveCount(4)
    await expect(page.getByRole('heading', { name: 'Supplementation and the results that followed' })).toBeVisible()
    await capture(page, 'vitamin', width)
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
    await page.getByRole('button', { name: 'Thyroid', exact: true }).click()
    await expect(page.locator('.timeline-event')).toHaveCount(2)
    await expect(page.getByText('PHC coordinating')).toBeVisible()
    await page.getByRole('button', { name: 'Blood pressure', exact: true }).click()
    await expect(page.locator('.timeline-event')).toHaveCount(1)
    await expect(page.locator('.timeline-toolbar')).toContainText('1 event · Most recent first')
    await page.getByRole('button', { name: 'View source', exact: true }).click()
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'PHC visit', exact: true })).toBeVisible()
    await page.keyboard.press('Escape')
    await page.getByRole('link', { name: 'Today', exact: true }).click()
    await page.getByRole('link', { name: 'View history: Vitamin D' }).click()
    await expect(page.getByRole('button', { name: 'Vitamin D', exact: true })).toHaveAttribute('aria-pressed', 'true')
    expect(errors).toEqual([])
  })
}

test('Navigation history, reload, chart selection, and keyboard entry', async ({ page }) => {
  await page.goto('/#health-over-time?lens=clinician&filter=vitamin-d')
  await expect(page.getByRole('button', { name: 'Clinician', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Vitamin D', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.locator('.timeline-event')).toHaveCount(4)
  await page.getByRole('button', { name: 'Thyroid', exact: true }).click()
  await expect(page.locator('.timeline-event')).toHaveCount(2)
  await page.goBack()
  await expect(page.locator('.timeline-event')).toHaveCount(4)
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await page.getByRole('link', { name: 'View priority: Blood pressure' }).click()
  await expect(page.getByRole('heading', { name: 'Clinical context' })).toBeVisible()
  const baseline = page.getByRole('button', { name: /Earlier baseline 126/ })
  await baseline.focus()
  await page.keyboard.press('Enter')
  await expect(baseline).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.chart-inspection')).toContainText('18 measurements')
  await page.locator('.chart-inspection').getByRole('button', { name: 'View source' }).click()
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Historical measurements', exact: true })).toBeVisible()
  await page.mouse.click(20, 200)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})

test('Nested source Back restores a visible trigger and evidence scroll position', async ({ page }) => {
  for (const width of [1024, 320]) {
    await page.setViewportSize({ width, height: 640 })
    await page.goto('/#blood-pressure')
    const headerBefore = await page.locator('.brand').boundingBox()
    await page.getByRole('button', { name: 'Why am I seeing this?' }).click()
    const headerAfter = await page.locator('.brand').boundingBox()
    expect(headerAfter?.x).toBe(headerBefore?.x)
    const source = page.getByRole('button', { name: 'View source: Historical measurements' })
    await source.scrollIntoViewIfNeeded()
    const previousScroll = await page.locator('.drawer-scroll').evaluate((el) => el.scrollTop)
    await source.click()
    await page.getByRole('button', { name: 'Back to evidence' }).click()
    await expect(source).toBeFocused()
    await expect.poll(() => source.evaluate((el) => {
      const button = el.getBoundingClientRect()
      const viewport = document.querySelector('.drawer-scroll')!.getBoundingClientRect()
      return button.top >= viewport.top && button.bottom <= viewport.bottom
    })).toBe(true)
    expect(Math.abs(await page.locator('.drawer-scroll').evaluate((el) => el.scrollTop) - previousScroll)).toBeLessThan(2)
    await capture(page, 'evidence-return', width, true)
    await page.keyboard.press('Escape')
    // A source opened directly has no saved overview scroll position.
    await page.getByRole('button', { name: /Earlier baseline 126/ }).click()
    await page.locator('.chart-inspection button').click()
    await page.getByRole('button', { name: 'Back to evidence' }).click()
    await expect(source).toBeFocused()
    await expect(source).toBeInViewport({ ratio: 1 })
    await page.keyboard.press('Escape')
  }
})

test('Lens, chart, and filter state survive keyboard navigation and history', async ({ page }) => {
  await page.goto('/#blood-pressure')
  await page.getByRole('button', { name: /Earlier baseline 126/ }).click()
  await page.getByRole('button', { name: 'Clinician', exact: true }).focus()
  await page.keyboard.press('Space')
  await expect(page.getByRole('heading', { name: 'Clinical context' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Earlier baseline 126/ })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('link', { name: 'Health over time', exact: true }).click()
  await page.getByRole('button', { name: 'Vitamin D', exact: true }).focus()
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Patient', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Vitamin D', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.goBack()
  await expect(page.getByRole('button', { name: 'Clinician', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.goForward()
  await expect(page.getByRole('button', { name: 'Patient', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.locator('.timeline-event')).toHaveCount(4)
  await page.getByRole('button', { name: 'Blood pressure', exact: true }).click()
  await page.getByRole('link', { name: 'View priority', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blood pressure')
  await page.getByRole('link', { name: 'Back to Today', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('What matters right now')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('Intermediate reflow and reduced motion retain readable controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [720, 820, 900]) {
    await page.setViewportSize({ width, height: 800 })
    for (const route of ['today', 'blood-pressure?lens=clinician', 'health-over-time?filter=vitamin-d']) {
      await page.goto(`/#${route}`)
      await checkLayout(page)
      await expect(page.locator('.lens-control button').first()).toHaveCSS('transition-duration', '0s')
    }
    await capture(page, 'reflow-vitamin', width)
  }
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/#blood-pressure')
  await page.getByRole('button', { name: 'Why am I seeing this?' }).click()
  await expect(page.getByRole('button', { name: 'Close evidence' })).toHaveCSS('width', '44px')
  await expect(page.getByRole('button', { name: 'Close evidence' })).toHaveCSS('height', '44px')
  await checkLayout(page, true)
})

test('Home log agrees with the supplied summary', () => {
  expect(homeReadings.length).toBe(homeMean.count)
  expect(homeReadings.reduce((sum, reading) => sum + reading.value, 0) / homeReadings.length).toBe(homeMean.value)
  expect(homeReadings.reduce((sum, reading) => sum + reading.secondaryValue, 0) / homeReadings.length).toBe(homeMean.secondaryValue)
})

test('Evidence drawer scrolls within a short viewport and traps reverse Tab', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 640 })
  await page.goto('/#blood-pressure')
  await page.getByRole('button', { name: 'Why am I seeing this?' }).click()
  const drawer = page.getByRole('dialog')
  const close = drawer.getByRole('button', { name: 'Close evidence' })
  await close.focus()
  await page.keyboard.press('Shift+Tab')
  await expect(drawer.getByRole('button', { name: 'View source: Historical measurements' })).toBeFocused()
  expect(await page.locator('.drawer-scroll').evaluate((el) => el.scrollTop)).toBeGreaterThan(0)
  await drawer.getByRole('button', { name: 'View source: Home blood pressure log' }).click()
  await expect(drawer.getByRole('table')).toBeVisible()
  await page.locator('.drawer-scroll').evaluate((el) => { el.scrollTop = el.scrollHeight })
  await capture(page, 'source-short-viewport', 1024, true)
  await expect(close).toBeInViewport()
  await expect(page.locator('.drawer-footer')).toBeInViewport()
  await close.click()
  await expect(page.getByRole('button', { name: 'Why am I seeing this?' })).toBeFocused()
})
