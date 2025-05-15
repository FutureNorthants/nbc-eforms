# Report It WNC Application

This application allows users to report various issues to West Northants Council.

## Configuration

The application uses external APIs that require API keys. These keys are stored in the `js/config.js` file.

### API Keys

The following API keys are used:

1. **Google Maps API Key**: Used for displaying maps and geocoding locations.
2. **What3Words API Key**: Used for location lookup using What3Words.

### How to Update API Keys

To update the API keys, edit the `js/config.js` file:

```javascript
// Configuration file for reportItWNC application
const CONFIG = {
    // Google Maps API key
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
    
    // What3Words API key
    WHAT3WORDS_API_KEY: 'YOUR_WHAT3WORDS_API_KEY'
};
```

Replace `'YOUR_GOOGLE_MAPS_API_KEY'` and `'YOUR_WHAT3WORDS_API_KEY'` with your actual API keys.

## Security Considerations

- Do not commit API keys to version control.
- For production environments, consider using environment variables or a secure configuration management system.
- Restrict API key usage by setting up proper referrer restrictions in the Google Cloud Console and What3Words developer portal.