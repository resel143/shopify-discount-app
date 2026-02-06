# Volume Discount Shopify App

A tiny Shopify application built using the MERN stack that enables merchants to configure and display "Buy 2, Get X% Off" automatic discounts.

## 🚀 Installation & Setup

### Prerequisites
* Shopify Partner Account & Development Store.
* Node.js & npm installed.
* Shopify CLI.

### Commands
1. **Install Dependencies:**
   ```bash
   npm install


   Start Development Server:

### Bash
npm run dev

Follow the prompts to connect your development store.

Deploy Extensions:

### Bash
npm run deploy
## ⚙️ Configuration
1. Storefront Widget Setup
Navigate to Online Store > Themes in your Admin.

Click Customize (or Edit theme) on your active development theme.

Switch the page view to Products > Default product.

In the left sidebar under Product Information, click Add block.

Select the Apps tab and choose Volume Discount Widget.

Click Save in the top right.

2. Setting the Discount
Open the Volume-Discount-App from the Apps menu.

Use the Product Picker to select your target product.

Enter a discount percentage (e.g., 10 for 10%).

Click Save Configuration.

## 🏗️ Technical Architecture
Data Storage

Mechanism: App-owned Shop Metafields.


Namespace: volume_discount.


Key: rules.


JSON Structure:

JSON
{
  "productId": "gid://shopify/Product/123",
  "percentOff": 10,
  "minQty": 2
}
Discount Engine (Shopify Functions)

API Target: cart.lines.discounts.generate.run.

Logic: The function evaluates cart lines in real-time. If it finds the configured product with a quantity of 2 or more, it outputs a percentage discount operation.


Type: Automatic Discount (no coupon code required).

## ✅ Acceptance Criteria Status

OAuth & Installation: Verified.


Admin Persistence: Saves to shop metafields correctly.


PDP Widget: Correctly displays "Buy 2, get X% off" only for selected products.


Functionality: Cart applies discount at quantity ≥ 2 and removes it below 2.

## 🛠️ Limitations & Future Steps

Current Scope: Supports one product configuration at a time.


## Next Steps: Implement multi-product support and tiered volume levels (e.g., Buy 5, get 20%).