# Free Subscription Feature

## Overview
This feature allows users with a "free" subscription status to have 1 default dive center, enabling them to access manager functionality with limited dive center creation.

## Implementation Details

### 1. Subscription Check API (`app/api/check-subscription/route.ts`)
- Modified to handle "free" subscription status
- Returns `hasFreeSubscription: true` for free users
- Sets `maxDiveCenters: 1` for free subscriptions
- Includes subscription status in response

### 2. Role Selection (`app/signin/role-selection/client.tsx`)
- Updated to allow managers with free subscriptions
- Checks for both `hasPaidSubscription` and `hasFreeSubscription`
- Only redirects to subscription required page if no subscription at all

### 3. Dive Center Selector (`components/dive-center-selector.tsx`)
- Updated to handle free subscriptions
- Shows appropriate messaging for free users
- Allows creation of 1 dive center for free users
- Displays "(Free)" indicator in the UI

### 4. Dive Center Creation (`lib/dive-center.ts`)
- Modified `createDiveCenter` function to accept free subscriptions
- Sets `maxDiveCenters: 1` for free users
- Updated error messages to be subscription-agnostic

### 5. Subscription Required Page (`app/subscription-required/page.tsx`)
- Updated messaging to mention free plans
- Explains that free plans allow 1 dive center

## Database Schema
The `UserSubscription` model already supports the "free" status in the `status` field.

## Usage
1. Users with "free" subscription status can sign in as managers
2. They can create exactly 1 dive center
3. The system automatically enforces the 1 dive center limit
4. UI clearly indicates when a user is on a free plan

## Testing
1. Create a user subscription with `status: "free"`
2. Sign in as a manager with that subscription
3. Verify that only 1 dive center can be created
4. Check that appropriate messaging is displayed in the UI

## Limitations
- Free users are limited to 1 dive center
- They cannot access "All Dive Centers" view
- No additional dive centers can be created beyond the first one
