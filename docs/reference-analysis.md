# Reference Page Analysis

This document records the visible structure and behavior of the supplied reference page. It is an implementation guide only: production endpoints, identifiers, tracking code, tokens, and server workflows are intentionally omitted.

## 1. Complete Page Section Order

1. Fixed header/navigation with desktop and mobile variants.
2. Language-unavailable alert dialog.
3. Hero with responsive background artwork, headline, supporting copy, and primary CTA.
4. Elevated "How It Works?" process panel overlapping the bottom of the hero.
5. "Why Choose Mobee Cars" comparison table.
6. "How We Determine Your Car's Market Price" pricing-input cards.
7. "Cars Sold With Mobee" daily-transactions carousel.
8. Customer-reviews section with a load-more link.
9. Persistent bottom CTA and Messenger contact button.
10. Sell-your-car dialog containing a multi-step valuation form.
11. FAQ section with category tabs and accordions.
12. About Mobee Cars promotional banner.
13. Footer, including a mobile-only CTA card, company/navigation links, social links, and privacy link.

## 2. Desktop Navigation

- A fixed, shadowed header hides when scrolling down past the initial page area and reappears while scrolling up.
- Left: Mobee logo linking to the sell page.
- Center: "Sell My Car" and a hover-triggered "Learn" menu.
- The Learn menu contains About Us, Blog, Team, Reviews, and Contact links.
- Right: language choices, with English active and Tagalog available.
- The desktop nav is shown from the medium breakpoint upward.

## 3. Mobile Navigation

- A compact header displays the logo and a hamburger/close control.
- The control opens a full-height, right-aligned drawer with an overlay.
- The drawer presents large "Sell My Car" and expandable "Learn" navigation; Learn reveals the same child links as desktop.
- A Language control expands English and Tagalog choices.
- Following a link closes the drawer and collapses any expanded submenus.

## 4. Hero Section

- Responsive full-width imagery: distinct mobile and desktop hero assets, set to cover their container.
- At tablet width, a thin red band appears above the hero; the hero has a minimum height of approximately 500px.
- White, centered-on-mobile and left-aligned-on-desktop content contains:
  - Heading: "Sell Your Used Car ... in the Philippines."
  - A rotating inline word: Place, Time, Price, with a blinking caret.
  - Supporting value proposition about instant quotes, free inspection, and payment.
  - "Start Selling Your Car" CTA, which opens the sell dialog.
- The process panel overlaps the hero's lower edge and is a rounded, white, shadowed container.
- The panel has five cards: initial quotation, free inspection, condition verification, buyer offers, and handover/payment. The first three occupy the top row at desktop; the last two are centered below. Cards use subtle hover color, icon, and shadow changes.

## 5. Major Sections After the Hero

### Comparison section

- "Differences" eyebrow, title, and supporting sentence.
- A zebra-style feature table contrasts Mobee with "Others" across buyer reach, pricing, inspection, paperwork, security, fees, and time.
- The Mobee column is visually elevated with logo and checkmark-led values.

### Market-price inputs

- "Our Pricing" eyebrow, title, and concise supporting copy.
- Five illustrated cards: used-car database, market/transaction data, buyer-demand signals, condition/mileage assessment, and right market price.
- Cards have decorative low-opacity artwork and hover shadow/image treatments.

### Daily transactions

- "Daily Transactions" eyebrow and Cars Sold With Mobee heading.
- A horizontal Swiper carousel intended to show sold-car records, initially rendered with a loading state.

### Reviews

- "Reviews" eyebrow, trust-focused title, supporting text, embedded third-party reviews area, and "Load More" link.

### FAQ

- Heading and explanatory copy.
- Category controls: Selling Guide, Finance & Loan Settlement, Car Valuation, and Buyer & Dealer Network.
- Each category exposes a question/answer accordion list. The selling-guide category is the default.

### About banner

- Full-width red, image-backed promotional banner.
- Glass-like content card with short company description and "Learn More About Mobee Cars" CTA.

### Footer

- Mobile-only "Ready to Sell Your Car?" CTA card.
- Logo, company summary, desktop CTA, social links, company links, country/navigation links, copyright, and privacy/terms.

## 6. Forms and Dialogs

### Language alert dialog

- A simple alert dialog explains that language switching is unavailable while submitted information is protected; it has an OK/close action.

### Sell-your-car dialog

- Bottom-sheet presentation on mobile; centered, large scrollable dialog on desktop.
- Step 1 offers tabs for entering car details or uploading a photo/registration document.
- Car details use dependent fields: brand, year, model, transmission, variant, and mileage.
- File upload supports drag-and-drop, validation, preview, replacement, and a client-side analyzing state.
- Step 2 requests name, phone number, location, optional other location, and a six-digit verification code; it includes resend and error states.
- Completion displays a thank-you/end message.
- In the frontend rebuild, retain only presentational state and local validation unless backend work is explicitly authorized.

## 7. Animations and Interactions

- Header translates out on downward scroll and returns on upward scroll.
- Hero rotating word has typing/backspacing and a blinking cursor.
- Process and pricing cards animate shadows, text colors, and decorative image scale/opacity on hover.
- Mobile drawer animates open/closed; Learn and language controls toggle independently.
- Swiper supports horizontal card navigation and pagination.
- FAQ category selection changes the visible question group; an accordion opens one answer at a time and rotates its chevron.
- Sticky CTA slides down when the footer enters the viewport, using an intersection observer.
- Reviews embed is lazy-loaded near its section using an intersection observer.
- File input supports drag feedback, preview, change/reset, errors, and a simulated/async analysis state.
- All motion should respect `prefers-reduced-motion` in the rebuild.

## 8. Responsive Behavior

- Mobile-first layout is used throughout.
- Navigation switches to the drawer below the medium breakpoint.
- Hero has mobile and desktop imagery, centered versus left-aligned copy, and different aspect ratios at mobile, tablet, and large desktop sizes.
- Process cards stack on mobile; desktop shows a three-card row and centered two-card row.
- Comparison-table side spacer columns appear only on desktop; the primary values adapt toward left alignment on small screens.
- Pricing cards stack on mobile and become three then two centered cards at desktop.
- Daily-transactions heading changes from vertical to inline logo/text layout at medium width.
- Sell dialog is bottom-aligned and nearly full viewport height on mobile; on desktop it is centered and constrained to a wide, shorter viewport panel.
- Sticky CTA is full-width at mobile and constrained to a centered panel on desktop. The Messenger button changes vertical position/layout between mobile and desktop.
- Footer CTA and social-link placement differ by breakpoint.

## 9. Third-Party Libraries Used

- Tailwind CSS utility classes and DaisyUI component conventions.
- jQuery for DOM manipulation, events, form flow, accordion/category switching, and network requests. Do not use it in the rebuild.
- Typed.js for the hero word animation.
- Swiper for the daily-transactions carousel.
- Font Awesome for navigation, accordion, social, and loading icons. Replace with the project-standard Lucide React icons where equivalents exist.
- Elfsight for the reviews widget.
- Google Tag Manager/Google Analytics, Meta/Facebook Pixel, and TikTok Pixel. These are tracking integrations and must not be copied.

## 10. Backend/Server-Specific Code That Must Not Be Copied

- CSRF token meta tag and hidden form token.
- Production form submission and all calculator, vehicle-lookup, image-analysis, lead, verification, OTP, resend, and valuation requests.
- Hidden lead, campaign, source, content, medium, country, language, and other submitted-data fields.
- Server-provided vehicle option data, sold-car data, review-widget identifiers, and localized/route-specific markup.
- Phone verification workflow, OTP validation, countdowns tied to server calls, and final form submission.
- Production domains, canonical/social metadata URLs, site navigation URLs, and external production asset hotlinks.
- Analytics, tag-manager, Facebook/Meta, TikTok, and similar pixel scripts or identifiers.
- Cookie/local-storage behavior used to preserve theme while navigating between country sites.

## 11. Proposed React Component Tree

```text
SellPage
├─ SiteHeader
│  ├─ DesktopNav
│  │  ├─ LearnMenu
│  │  └─ LanguageSwitcher
│  └─ MobileNavDrawer
│     ├─ LearnDisclosure
│     └─ LanguageDisclosure
├─ LanguageAlertDialog
├─ HeroSection
│  ├─ RotatingWord
│  └─ PrimarySellButton
├─ ProcessSection
│  └─ ProcessCard × 5
├─ ComparisonSection
│  └─ ComparisonTable
├─ MarketPriceSection
│  └─ PricingFactorCard × 5
├─ DailyTransactionsSection
│  └─ SoldCarCarousel
├─ ReviewsSection
│  └─ ReviewsPlaceholder
├─ StickySellCta
├─ ContactFab
├─ SellCarDialog
│  ├─ VehicleDetailsStep
│  ├─ UploadVehicleStep
│  ├─ ContactDetailsStep
│  ├─ OtpStep (presentational only)
│  └─ CompletionStep
├─ FaqSection
│  ├─ FaqCategoryTabs
│  └─ FaqAccordion
├─ AboutBanner
└─ SiteFooter
   ├─ FooterCta
   ├─ FooterLinkGroups
   └─ SocialLinks
```

## 12. Recommended Implementation Order

1. Inventory permitted local assets and establish page tokens for spacing, color, typography, and motion.
2. Build the responsive page shell, header/navigation, hero, and reusable CTA button.
3. Build the process panel and verify its hero overlap at 390px, 768px, 1024px, and 1440px.
4. Implement comparison, market-price cards, about banner, and responsive footer using reusable data-driven components.
5. Add local/static daily-transaction and review placeholders; do not integrate production data or embeds.
6. Build the sticky CTA, contact button, and accessible dialog shell.
7. Implement the dialog's presentational steps and local form-state/validation only; defer real submission, image analysis, and OTP work.
8. Add accessible FAQ category tabs and single-open accordion behavior.
9. Add restrained interactions and reduced-motion fallbacks; use Lucide React rather than Font Awesome.
10. Perform viewport and keyboard/accessibility verification, then run lint and build.
