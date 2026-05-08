# Butterfly Couture - Backend Implementation

## Overview
A complete, fully functional backend system for the Butterfly Couture e-commerce platform using Next.js Route Handlers, Server Actions, and an in-memory database.

## Architecture

### Database Layer (`/lib/db.ts`)
- **In-Memory Storage**: All data is stored in TypeScript Maps for instant access
- **6 Pre-loaded Products**: Butterfly-themed fashion items with pricing, inventory, and details
- **Data Models**:
  - `Product`: Full product details including name, price, colors, sizes, images, ratings
  - `CartItem`: Shopping cart entries with product ID, quantity, size, color
  - `Order`: Complete order data with customer info, shipping, billing, and status
  - `ContactSubmission`: Contact form submissions

### API Routes

#### **Products API**
- `GET /api/products` - Get all products
- `GET /api/products?category=Dresses` - Filter by category
- `GET /api/products?q=butterfly` - Search products
- `GET /api/products/[id]` - Get single product details

#### **Cart API**
- `GET /api/cart` - Get current cart for session
- `POST /api/cart` - Manage cart operations
  - `action: "add"` - Add item to cart
  - `action: "remove"` - Remove item from cart
  - `action: "update"` - Update item quantity
  - `action: "clear"` - Clear entire cart

Cart features:
- Session-based using cookies
- Real-time calculations for subtotal, tax, shipping
- Free shipping for orders over $500

#### **Orders API**
- `POST /api/orders` - Create new order
- `GET /api/orders?email=user@email.com` - Retrieve orders by email

Order features:
- Full address validation
- Automatic order confirmation email notifications
- Order status tracking

#### **Contact API**
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Retrieve all submissions (admin only)

#### **Chat API**
- `POST /api/chat` - Send message to AI chatbot

Features:
- Keyword-based intelligent responses
- Product recommendations
- Policy information
- Dynamic contextual replies

### Server Actions (`/lib/actions.ts`)

#### `submitContactForm()`
Handles contact form submissions with:
- Email validation
- Database storage
- User feedback

#### `submitCheckoutForm()`
Complete checkout processing:
- Multi-step form validation
- Order creation
- Shipping/billing separation
- Automatic order confirmation

#### `subscribeToNewsletter()`
Newsletter signup with email validation

## Custom Hooks

### `useCart()` Hook (`/hooks/useCart.ts`)
React hook for cart management:
```typescript
const { cart, isLoading, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()
```

Features:
- SWR-based data fetching
- Real-time cart sync
- Automatic recalculation

## Data Flow

### Adding Product to Cart
1. User clicks "Add to Bag" on product page
2. `useCart.addToCart()` calls `/api/cart` with item details
3. Backend stores in session-based cart
4. Calculates totals with tax and shipping
5. Hook updates UI with new cart state

### Checkout Flow
1. User fills shipping info (Step 1)
2. User confirms billing address (Step 2)
3. User reviews order (Step 3)
4. `submitCheckoutForm()` server action processes order
5. New order created in database
6. Confirmation page displays with order ID
7. Email notification sent to customer

### Contact Form
1. User submits form on `/contact` page
2. `submitContactForm()` server action validates email
3. Submission stored in database
4. User receives confirmation message

## Shopping Features

### Cart Management
- Add/remove items by product, size, color combination
- Update quantities
- Real-time pricing updates
- Shipping cost calculation based on subtotal
- Tax calculation by state (CA default: 8.25%)

### Pricing
- Free shipping on orders over $500
- Standard shipping: $20 for orders under $200
- Express shipping: $10 for orders $200-$500
- Tax: 7-8% depending on state

### Product Database
1. **Butterfly Silk Gown** - $2,850
2. **Crystal Wing Jacket** - $1,650
3. **Garden Bloom Dress** - $890
4. **Metamorphosis Shoes** - $695
5. **Delicate Wings Bag** - $1,250
6. **Aurora Feather Coat** - $3,200

## Session Management

Carts are session-based using HTTP-only cookies:
- Cookie Name: `session_id`
- Max Age: 7 days
- Secure: HTTP-only (no client-side access)
- Auto-generated on first cart action

## Validation

### Cart Validation
- Required: product ID, quantity, size, color
- Quantity: positive integer
- Size/Color: match product inventory

### Order Validation
- Required fields: first name, last name, email, phone, addresses
- Email validation: RFC-compliant format
- Address validation: non-empty strings
- Automatic order ID generation: `ORD-${timestamp}-${random}`

### Contact Validation
- Email: valid format required
- All fields: required and non-empty
- Message: any length accepted

## AI Chatbot

Smart responses based on keywords:
- **Greetings**: Welcome messages
- **Products**: Product recommendations from database
- **Shipping**: Shipping cost and timing info
- **Returns**: Return policy details
- **Payment**: Accepted payment methods
- **Help**: General support messages

## Performance Optimizations

1. **In-Memory Database**: O(1) lookups for product details
2. **Session Cookies**: No server-side session storage needed
3. **Client-Side Caching**: SWR hook caches cart data
4. **Optimistic Updates**: Cart updates UI immediately
5. **Lazy Loading**: Products loaded on-demand by category

## Integration Points

- All pages use real API data via hooks and server actions
- Cart state syncs across browser tabs
- Product pages fetch single product details
- Shop pages dynamically filter by category
- Checkout validates all inputs before submission

## Demo Data

All data is seeded in `lib/db.ts` and ready to use immediately. No database setup required!
