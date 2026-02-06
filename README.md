# Volume Discount Shopify App

[Note - Find All project images added below the ReadMe file]

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
   
2. **Start Development Server:**

        npm run dev

Follow the prompts to connect your development store.

3. **Deploy Extensions:**

        npm run deploy
    
## ⚙️ Configuration

### 1. Storefront Widget Setup
Navigate to Online Store > Themes in your Admin.

Click Customize (or Edit theme) on your active development theme.

Switch the page view to Products > Default product.

In the left sidebar under Product Information, click Add block.

Select the Apps tab and choose Volume Discount Widget.

Click Save in the top right.

### 2. Setting the Discount
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

Future Step - Multi-Product & Collection Support, Tiered Discount Levels, Enhanced Analytics Dashboard, Custom Styling Options for Widget

# The Project Image Gallery

## Development Store Creation
![Development Store Creation](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Store-creation.png)

## Development Store Successfully Created
![Development Store Successfully Created](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Dev-Store-Created.png)

## Shopify Partner Dashboard Overview
![Shopify Partner Dashboard Overview](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Dev-Dashboard-App.png)

## Scaffolding the New Shopify App
![Scaffolding the New Shopify App](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Built-New-shopify-App.png)

## Project Structure & Milestone A Code
![Project Structure & Milestone A Code](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Code-Milestone-A.png)

## GraphQL Input Query for the Function
![GraphQL Input Query for the Function](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/graphql.png)

## Core Discount Function Logic Implementation
![Core Discount Function Logic Implementation](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Milestone-B.png)

## Automatic Discount Applied in Cart (10% Off)
![Automatic Discount Applied in Cart (10% Off)](https://github.com/resel143/shopify-discount-app/blob/main/Submission%20Assets/milestone-B-10%25-off-price-drop.png)

## Product Selection & Metafield Configuration
![Product Selection & Metafield Configuration](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/milestone-C-AdminU.png)

## Theme Editor - Adding the App Block
![Theme Editor - Adding the App Block](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Volume-Discount-Dev-Theme-Option.png)

## Live Storefront Widget Rendering (PDP)
![Live Storefront Widget Rendering (PDP)](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Widget-Visible-C-Milestone.png)

## App Successfully Released and Deployed
![App Successfully Released and Deployed](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/App-released.png)

## Final Shopify Admin Store Dashboard Overview
![Final Shopify Admin Store Dashboard Overview](https://raw.githubusercontent.com/resel143/shopify-discount-app/main/Submission%20Assets/Store-Dashboard.png)

