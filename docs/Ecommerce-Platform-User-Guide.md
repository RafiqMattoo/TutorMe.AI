---
title: "Ecommerce Platform"
subtitle: "End User Guide"
author: "Customers · Administrators · Vendors · Content & Support"
date: "Version 1.0"
---

\newpage

# About This Guide

This guide is for the people who use the Ecommerce Platform every day: **customers**, **store administrators**, **vendor managers**, **content editors**, and **support teams**. It explains what the platform does and how each role uses it. It is written as user documentation, not developer documentation.

Menu names may vary by theme, permissions, and enabled modules. If a feature is not visible to you, your account may not have access to that area.

\newpage

# Platform Overview

The Ecommerce Platform is an ecommerce and vendor-management system for selling products online, managing suppliers, handling customer orders, tracking stock, and applying taxes and shipping.

**The platform supports**

- Browsing, search, comparison, cart, checkout, payment, and order tracking.
- Customer accounts, addresses, wishlist, order history, reviews, comments, contact messages.
- Admin management of products, categories, brands, pages, menus, widgets, users, customer groups, locations, taxes, shipping, payments, inventory, orders, shipments, vendors, and themes.
- Vendor-specific pricing, stock, discounts, and availability.
- Vendor dashboards for sales, inventory, fees, reports, and offers.

\newpage

# Main User Roles

| Role | What they do |
|------|--------------|
| Customer / Shopper | Browse, compare, buy, track orders, manage account |
| Administrator | Run the back office: catalog, vendors, orders, settings |
| Vendor / Supplier Manager | Manage vendor pricing, stock, offers, reports |
| Content Editor | Maintain pages, menus, widgets, banners, translations |
| Support / Operations | Help customers and vendors after orders are placed |

> If a feature isn't visible, your role may not have access to it.

\newpage

# Roles in Detail

**Customer / Shopper** — Create an account, browse categories/brands/products, search and filter, compare, view details and vendor options, use cart and wishlist, apply coupons, check out, and track orders.

**Administrator** — Manage products, categories, brands, and templates; manage vendors and assign products with vendor pricing and stock; review orders and create shipments; configure payment, tax, shipping, and store settings; maintain CMS content; manage users, groups, and locations.

**Vendor / Supplier Manager** — View dashboards; maintain assigned products, stock, prices, discounts, and tax; view orders; create offers.

**Content Editor** — Create and edit pages; maintain menus and links; add carousel banners, HTML blocks, and product/category widgets; manage translations.

**Support / Operations** — Check accounts and orders; review messages and comments; update order statuses; create shipments; confirm payments; help reset passwords and manage addresses; review stock.

\newpage

# Accessing the Platform

**Storefront** — the customer-facing website. Common areas:

- Home, product listing, and category pages
- Product detail pages and search results
- Cart and checkout
- Order history and account/profile pages
- Wishlist and contact pages

**Back Office** — the admin area at `/Admin` (for accounts with admin access). Sections include Catalog, Orders, Vendors, Inventory, Pricing, CMS, Settings, Payments, Shipping, Taxes, Customers, and Users.

\newpage

# Customer Guide — Accounts

**Creating an account**

- Register with email, full name, and password.
- Mobile-number login or OTP password reset may be available.
- After registering: sign in, save addresses, use wishlist, place orders, view history.

**Signing in**

- Sign in with registered credentials; external login providers may be enabled.
- Forgot password → reset via email or OTP where configured.

**Profile & password**

- Update personal info and account settings.
- Change or set a password (e.g. for external-login accounts).
- Manage connected login providers.

\newpage

# Customer Guide — Addresses

Customers can save multiple addresses and pick a default. Saved addresses are reusable at checkout.

An address can include:

- Contact name and phone number
- Address line 1 and line 2
- Country, state/province, district, city
- Zip / postal code

\newpage

# Customer Guide — Browsing & Search

**Browsing** — by category, brand, search results, and listing pages. Cards and detail pages can show name, image, price, discount price, availability, stock status, vendor availability, options/variations, and descriptions.

**Search & filtering** — keyword search with filters for category, brand, price, vendor, and availability (theme-dependent). Vendor-aware results let customers compare price and stock.

**Product detail page** — images, description and specifications, options/variations, vendor price, MRP, discount price, tax values, stock, reviews/ratings, and actions to add to cart, wishlist, or comparison.

\newpage

# Customer Guide — Compare & Wishlist

**Compare** — add products to comparison and remove later to weigh details side by side.

**Wishlist** — a private saved list:

- View the wishlist.
- Update item quantity.
- Remove items.
- Share by email.
- Open a public wishlist link via a sharing code.

\newpage

# Customer Guide — Cart & Coupons

**Cart** — add from listing or detail pages, then:

- Review selected products.
- Change quantity or remove items.
- Apply a coupon.
- Continue to checkout.

The cart respects availability, vendor selection, and stock rules.

**Coupons** — apply codes in cart or checkout. A coupon may be rejected if it has expired, is inactive, the minimum order isn't met, it's restricted to specific products/categories/customers, or a usage limit is reached.

\newpage

# Customer Guide — Checkout

Typical flow:

1. Review cart items.
2. Apply or confirm a coupon.
3. Select or enter a shipping address.
4. Review tax and shipping charges.
5. Select a payment method.
6. Place the order.
7. View success or error result.

Tax and shipping are calculated from address, items, and configured rules.

\newpage

# Customer Guide — Payments

**Payment methods** (only enabled, valid methods appear):

- **Cash on Delivery** — pay in cash when the order is delivered.
- **Razorpay** — pay online by card, UPI, net banking, or wallet through the Razorpay gateway.

At checkout, the customer selects one of the available methods and places the order. With Cash on Delivery the order is confirmed immediately; with Razorpay the customer completes payment on the gateway and returns to a success or failure result.

\newpage

# Customer Guide — Order History

After signing in, customers can view their orders, showing:

- Order number and date
- Order status
- Payment method
- Items and quantities
- Amounts
- Shipping information and order details

\newpage

# Administrator Guide — Dashboard & Users

**Admin dashboard** — the starting point for store operations, with quick access and activity/order/product/review widgets depending on enabled modules.

**User management**

- View, create, and edit users.
- Assign roles (give admin roles only to trusted staff).
- Delete users when appropriate.

**Customer groups** — organize customers for pricing, promotions, access, or reporting; create, edit, activate, or deactivate groups.

\newpage

# Administrator Guide — Locations

Location data drives addresses, shipping, and tax.

Admins can manage:

- Countries
- States / provinces
- Districts (where enabled)
- Billing availability
- Shipping availability

> Keep location data accurate so customers can enter valid addresses and shipping/tax rules apply correctly.

\newpage

# Catalog — Brands & Categories

**Brands** — group products by manufacturer/identity; create, edit name and slug, publish or unpublish.

**Categories** — organize products on the storefront:

- Create parent and child categories.
- Add descriptions and SEO content.
- Set display order and menu visibility.
- Upload thumbnails.
- Publish/unpublish and add translations.

\newpage

# Catalog — Attributes, Options & Templates

**Attributes & attribute groups** — describe product characteristics (size, material, color, specification). Create groups, create attributes, and assign them to templates for consistency.

**Product options** — selectable choices such as size, pack, or color; create options and add values.

**Product templates** — define which attributes and options apply to a product type, keeping creation consistent (e.g. an apparel template differs from an electronics template).

\newpage

# Catalog — Products

Products are the core items sold. When creating or editing, admins manage:

- Name, slug, and SKU
- Short and full descriptions
- Categories, brand, and template
- Attributes, options, and variations
- Images and media
- Price, special/discount price
- Inventory behavior
- Tax class and shipping requirements
- Publishing status, SEO fields, and translations

**Product cloning** — create a new product from an existing one for similar items; review carefully before publishing.

\newpage

# Catalog — Prices & Vendor Listings

**Product prices** can include:

- Base and original price
- Discount price
- Tax rate
- Vendor-assigned price
- Maximum retail price (MRP)
- Net sale price

**Vendor-aware listings** — the same catalog product can be sold by different vendors with different stock and price. Customers see vendor-specific availability where the storefront supports it.

\newpage

# Vendor Management

**Vendors** — create and manage seller records:

- Name, slug, email, description
- Active status
- Vendor managers

Only active vendors appear as sellers.

**Vendor managers** — users assigned to a vendor; per permissions they maintain products, view dashboards, and manage orders.

\newpage

# Vendor Management — Assigning Products

Admins or vendor managers assign catalog products to a vendor. Assignment can include:

- Product and batch number
- Manufacturing date
- Maximum retail price
- Assigned price, original price, discount price
- Tax rate
- Stock quantity
- Active / inactive status

This matters when many vendors sell the same product at different prices or stock levels.

\newpage

# Vendor Management — Pricing & Stock

**Vendor pricing** controls what customers see for that listing:

- **MRP** — reference retail price.
- **Assigned price** — the vendor's selling price.
- **Discount price** — optional reduced price.
- **Tax rate** — percentage used for calculation.
- **Net sale price** — price after tax/discount.

**Vendor stock** — controls availability; low or inactive stock hides the vendor's listing.

\newpage

# Vendor Dashboard

A business view of vendor activity, with areas for **Home, Inventory, Sales, Fees, Reports, and Offers**.

- **Home** — key metrics: active products, orders, revenue.
- **Inventory** — active products, stock, low-stock items, performance.
- **Sales** — total sales and orders, regional coverage, product revenue, quantity sold.
- **Fees** — order amount, payment type, fee rate, fee charged, weekly statements.
- **Reports** — sales, tax, product performance, delivery performance.

\newpage

# Vendor & Platform Offers

**Vendor offers** (where enabled) can include:

- Offer type, title, description, terms
- Discount type and value, maximum discount
- Minimum order amount and quantity
- Coupon code
- Start and end dates, active status

Vendors can activate, deactivate, update, or delete offers as permitted.

**Platform offers** — managed by the marketplace operator; vendors can view details, benefits, eligibility, and participation status.

\newpage

# Inventory Management

**Warehouses** — represent stock locations; create, edit, delete, and manage assigned products.

**Warehouse products** — add products one by one or all at once where available.

**Stock updates** — update quantities for warehouse products.

**Stock history** — review changes over time to investigate movement, corrections, and availability.

**Back-in-stock subscriptions** — customers can subscribe to be notified when an out-of-stock product returns.

\newpage

# Pricing & Promotions

**Cart rules** define promotional discounts (commonly coupons and order-level promotions). They control:

- Coupon code
- Discount value
- Start and end dates
- Active status and usage limits
- Conditions: customer group, product, category, or cart total

**Cart rule usage** shows how coupons/promotions have been used — monitor campaign performance and detect misuse.

\newpage

# Tax Management

**Tax classes** group products for tax calculation (different product types may be taxed differently).

**Tax rates** define the actual percentage used, and may depend on location and tax class. Admins can create, edit, and import tax rates.

> Review tax settings before publishing products or opening checkout.

\newpage

# Shipping Management

- **Shipping providers** — define available delivery methods; view and configure from the shipping area.
- **Free shipping** — applies based on configured rules or provider settings.
- **Table-rate shipping** — cost varies by destination, order value, or weight, per setup.
- **Shipping prices** — calculated at checkout from address, products, and configuration.

\newpage

# Payment Management

**Payment providers** — view, enable, and configure the available methods:

- **Cash on Delivery** — no gateway setup; just enable it.
- **Razorpay** — enable and configure the gateway.

**Payment configuration** — Razorpay needs its own settings (sandbox/live mode, merchant key and secret, return and notification URLs).

**Before going live**

- Confirm credentials are correct.
- Confirm callback / return URLs.
- Test in sandbox where supported.
- Confirm successful orders reach the expected status.

\newpage

# Orders & Shipments

**Order list** can show order number, customer, date, payment method, payment status, order status, total, and shipping status.

**Order details** help staff review customer info, billing/shipping address, items and quantities, vendor info, tax/shipping, discounts, payment, order history, and shipment status.

**Admin order creation** — support/sales staff can create orders on behalf of customers where permitted.

**Invoices** — view or download invoice information where enabled.

**Shipments** — create a shipment, view the list and details, and track progress. Ship only after verifying payment and stock per your process.

\newpage

# Content — Pages & Menus

**Pages** — static/semi-static content (About, Terms, Privacy, FAQ, campaigns). Create, edit, publish/unpublish, and translate.

**Menus** — storefront navigation:

- Create menus.
- Add pages, categories, or custom links.
- Reorder items.
- Publish/unpublish and delete items.

\newpage

# Content — Widgets, Banners & Themes

**Widgets** place content in storefront areas. Types include carousel, HTML, spacer, product, category, simple product, and recently-viewed widgets. Use them for homepage sections, banners, featured products, and reusable blocks.

**Carousel banners** can include image, caption, sub-caption, link text, and target URL. Use clear images and check the storefront after publishing.

**Themes** control look and layout:

- View installed and online themes.
- Install, activate, download, or delete themes.

> Changing themes can affect layout and content visibility — review key pages afterward.

\newpage

# Reviews, Comments, Contacts & News

- **Reviews** — customers share product feedback; admins review submissions and replies.
- **Comments** — attached to supported content/products; admins review and change status.
- **Contact messages** — customers submit messages; admins view, preview, and delete.
- **Contact areas** — define contact sections/departments; translatable where enabled.
- **News** — publish news or announcements if enabled in the theme.

\newpage

# Vendor & Seller Profiles

Seller onboarding and verification data supports marketplace trust.

**Business information** — shop/business name, owner name, primary and alternate contact, email, full address, and geolocation.

**Operational details** — years in business, tie-ups, delivery availability, service areas, average monthly sales volume.

**Product portfolio** — product types, major brands, custom products, stock quantity, units.

**Licensing & compliance** — tax registration and business ID numbers, license type and number, start/expiry dates, license and supporting documents.

**Financial & payout details** — payout method, selling status, account holder name, account number, bank code, bank and branch. *Only authorized staff should update payout/bank info.*

**Verification & ratings** — verified badge, seller rating, customer reviews, review dates, comments.

\newpage

# Localization & Translations

Multilingual content is supported for pages, categories, products, and contact areas. When enabled, content editors maintain translated versions per culture.

Before publishing translated content:

- Confirm the translated name and slug.
- Review descriptions and SEO fields.
- Check the storefront in the selected language.

\newpage

# Notifications & Email

Email sender modules and notifications support:

- Account confirmation
- Password reset
- Order confirmation
- Wishlist sharing
- Back-in-stock alerts
- Admin / vendor notifications

Delivery depends on the configured email provider (e.g. SMTP or SendGrid).

\newpage

# Activity & Reporting

Activity reporting includes most-viewed tracking and dashboard widgets. Use it to understand popular and viewed products, customer interest, and content performance. Vendor reports and dashboards add operational reporting.

\newpage

# Workflow — New Store Setup

1. Configure general store settings.
2. Add countries, states, and shipping-enabled locations.
3. Configure tax classes and rates.
4. Configure shipping providers.
5. Configure payment providers.
6. Create customer groups.
7. Add brands and categories.
8. Create attributes, options, and templates.
9. Add products.
10. Add vendors and vendor managers.
11. Assign products to vendors with pricing and stock.
12. Create pages, menus, widgets, and banners.
13. Place test orders.
14. Verify payment, tax, shipping, order, and email behavior.
15. Publish the storefront.

\newpage

# Workflow — New Product & Vendor

**New product**

1. Confirm the category and brand exist.
2. Choose or create the template.
3. Create the product (name, SKU, description, images, attributes).
4. Set pricing and tax class.
5. Configure options/variations.
6. Publish.
7. Assign to vendors with price, discount, tax, and stock.
8. Check the storefront page.

**New vendor**

1. Create the vendor record and assign managers.
2. Add business, operational, licensing, financial, and service details.
3. Verify documents and bank info.
4. Assign products with prices and stock.
5. Review the vendor dashboard and storefront listings.

\newpage

# Workflow — Promotions & Pages

**New promotion**

1. Create the cart rule and set a coupon code.
2. Define discount value and conditions.
3. Set start/end dates and activate.
4. Test in cart and checkout; monitor usage.

**New content page**

1. Create the page (title, slug, content, SEO).
2. Publish and add to a menu.
3. Add translations; review on the storefront.

\newpage

# Support — Sign-in & Checkout

**Customer can't sign in** — check email/mobile and password, account exists and is active, and that password/OTP reset is available.

**Customer can't checkout** — check item availability and stock, complete shipping address, shipping-enabled country/state, an enabled payment method, and a valid coupon.

**Payment failed** — check the provider is enabled with correct credentials, the customer returned from the gateway, the order payment status, the gateway dashboard, and sandbox vs. live mode.

\newpage

# Support — Catalog & Vendors

**Product not visible** — check it is published; category/brand published; valid price and stock; active vendor assignment; required fields and images complete; theme/menu includes the area.

**Vendor listing unavailable** — check the vendor is active, the assignment is active, stock is available, and the assigned price is set.

**Coupon doesn't work** — check spelling, dates, active status, minimum order, product/category/customer restrictions, and usage limits.

\newpage

# Support — Orders

**Order not ready to ship** — check payment status, order status, stock, shipping address, and vendor fulfillment responsibility.

**Payment not confirmed (Razorpay)** — check the customer returned from the gateway, the order payment status, the Razorpay dashboard result, and sandbox vs. live mode.

\newpage

# Data Quality Tips

- Use clear product names and SKUs.
- Keep the category hierarchy simple.
- Upload good-quality product images.
- Keep vendor stock and pricing current.
- Review tax and shipping before accepting orders.
- Use consistent coupon names and dates.
- Keep licenses and bank details up to date.
- Review storefront pages after editing menus, widgets, or themes.
- Test key flows after changing payment, shipping, tax, or checkout settings.

\newpage

# Glossary

- **Admin** — a user who manages the back office.
- **Attribute** — a product detail such as size, type, color, or specification.
- **Brand** — the manufacturer or commercial brand of a product.
- **Cart Rule** — a promotion or coupon rule applied to the cart.
- **Category** — a group used to organize products.
- **Checkout** — confirming items, address, shipping, payment, and placing the order.
- **Customer Group** — a group used for promotions, access, or reporting.
- **Discount Price** — a reduced product or vendor selling price.
- **MRP** — the reference retail price for a vendor listing.
- **Order** — a confirmed customer purchase.
- **Payment Provider** — a payment method/gateway at checkout.
- **Product Option** — a selectable choice such as size or pack.
- **Product Template** — a reusable structure of fields, attributes, and options.
- **Shipment** — the delivery record for an order.
- **Tax Class** — a product tax grouping used to calculate tax.
- **Vendor** — a seller/supplier providing products through the marketplace.
- **Vendor Product** — a vendor-specific listing with its own price and stock settings.
- **Widget** — a reusable storefront content block.
- **Wishlist** — a saved list of products to buy later or share.

---

*Ecommerce Platform · End User Guide · Version 1.0*
