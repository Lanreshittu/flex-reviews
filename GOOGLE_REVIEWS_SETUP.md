# Google Reviews Integration Setup Guide

## 🎯 Overview
This guide walks you through setting up Google Reviews integration for the Flex Living Reviews Dashboard using the Google Places API.

## 📋 Prerequisites
- Google Cloud Platform account
- Active Flex Living Reviews project
- Node.js and npm installed

## 🔧 Step-by-Step Setup

### 1. Google Cloud Console Setup

#### Create a New Project (if needed)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Flex Living Reviews"
4. Click "Create"

#### Enable Places API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Places API"
3. Click on "Places API" and click "Enable"

#### Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Click "Restrict Key" to limit usage

### 2. Environment Configuration

#### Update Environment File
Add your Google Places API key to the `env` file:

```bash
# Add this line to your env file
GOOGLE_PLACES_API_KEY=your-actual-api-key-here
```

#### Restart Server
```bash
npm run dev-db
```

### 3. Testing the Integration

#### Access the Google Reviews Interface
1. Start your server: `npm run dev-db`
2. Open: `http://localhost:3000/google-reviews.html`

#### Test Connection
1. Find a Google Place ID using [Google's Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Enter the Place ID in the test form
3. Click "Test Connection"

#### Sync Reviews
1. Enter a Listing ID (e.g., `listing_123`)
2. Enter the Google Place ID
3. Click "Sync Reviews"

## 🔍 Finding Google Place IDs

### Method 1: Google Place ID Finder
1. Go to [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business
3. Copy the Place ID

### Method 2: Google Maps
1. Go to [Google Maps](https://maps.google.com)
2. Search for your business
3. Click on the business
4. Look at the URL: `https://maps.google.com/maps/place/[PLACE_ID]`


## 📊 API Endpoints

### Test Connection
```
GET /api/google/test?placeId=ChIJN1t_tDeuEmsRUsoyG83frY4
```

### Sync Reviews
```
POST /api/google/sync
Content-Type: application/json

{
  "listingId": "listing_123",
  "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4"
}
```

### Get Google Reviews
```
GET /api/google/reviews?listing=listing_123
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. "API key not configured"
- Check that `GOOGLE_PLACES_API_KEY` is set in your `env` file
- Restart the server after adding the key

#### 2. "Google Places API error: REQUEST_DENIED"
- Verify the API key is correct
- Check that Places API is enabled in Google Cloud Console
- Ensure billing is enabled for your Google Cloud project

#### 3. "Google Places API error: INVALID_REQUEST"
- Verify the Place ID is correct
- Check that the Place ID exists and is accessible

#### 4. "No reviews found"
- The business might not have Google reviews
- Check the business listing on Google Maps
- Verify the Place ID is for the correct business

### Debug Steps
1. Test the API key with a simple request
2. Verify the Place ID using Google Maps
3. Check server logs for detailed error messages
4. Ensure the business has Google reviews