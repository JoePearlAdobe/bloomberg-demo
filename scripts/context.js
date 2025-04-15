import { loadCSS } from './aem.js';

// Global object to store user context data
export const userContext = {
  device: {
    type: null,
    width: null,
    height: null,
    touchCapable: null,
    orientation: null
  },
  browser: {
    name: null,
    version: null,
    engine: null,
    userAgent: null
  },
  geography: {
    latitude: null,
    longitude: null,
    country: null,
    region: null,
    city: null,
    source: null // 'geolocation', 'ip', or 'unavailable'
  }
};

const EDITABLE_SELECTORS = 'h1, h2, p';

function handleEditable(editable) {
  const childEdits = editable.querySelectorAll(EDITABLE_SELECTORS);
  if (childEdits.length > 0) return;
  editable.dataset.edit = true;
  editable.addEventListener('click', (e) => {
    // If it's already editable, do nothing
    const isEditable = e.target.getAttribute('contenteditable');
    if (isEditable) return;

    // Turn off all other editables
    const prevEditables = document.body.querySelectorAll('[contenteditable]');
    prevEditables.forEach((prev) => { prev.removeAttribute('contenteditable'); });

    // Set the editable attr and set focus
    editable.setAttribute('contenteditable', true);
    setTimeout(() => { editable.focus(); }, 150);
  });
}

/**
 * Detects user's device type, browser information, and geography
 * @returns {Object} User context information
 */
export async function getUserContext() {
  try {
    // Device detection
    const ua = navigator.userAgent;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    userContext.device.width = width;
    userContext.device.height = height;
    userContext.device.touchCapable = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    userContext.device.orientation = width > height ? 'landscape' : 'portrait';
    
    // Determine device type based on screen width and user agent
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      if (width < 768) {
        userContext.device.type = 'mobile';
      } else {
        userContext.device.type = 'tablet';
      }
    } else {
      userContext.device.type = 'desktop';
    }
    
    // Browser detection
    userContext.browser.userAgent = ua;
    
    // Detect browser name and version
    if (ua.indexOf('Firefox') > -1) {
      userContext.browser.name = 'Firefox';
      userContext.browser.version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || '';
    } else if (ua.indexOf('SamsungBrowser') > -1) {
      userContext.browser.name = 'Samsung Browser';
      userContext.browser.version = ua.match(/SamsungBrowser\/([0-9.]+)/)?.[1] || '';
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
      userContext.browser.name = 'Opera';
      userContext.browser.version = (ua.match(/Opera\/([0-9.]+)/) || ua.match(/OPR\/([0-9.]+)/))?.[1] || '';
    } else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg/') > -1) {
      userContext.browser.name = 'Edge';
      userContext.browser.version = (ua.match(/Edge\/([0-9.]+)/) || ua.match(/Edg\/([0-9.]+)/))?.[1] || '';
    } else if (ua.indexOf('Chrome') > -1) {
      userContext.browser.name = 'Chrome';
      userContext.browser.version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || '';
    } else if (ua.indexOf('Safari') > -1) {
      userContext.browser.name = 'Safari';
      userContext.browser.version = ua.match(/Safari\/([0-9.]+)/)?.[1] || '';
    } else {
      userContext.browser.name = 'Unknown';
      userContext.browser.version = '';
    }
    
    // Detect browser engine
    if (ua.indexOf('Gecko') > -1 && ua.indexOf('Firefox') > -1) {
      userContext.browser.engine = 'Gecko';
    } else if (ua.indexOf('AppleWebKit') > -1) {
      userContext.browser.engine = 'WebKit';
    } else if (ua.indexOf('Trident') > -1) {
      userContext.browser.engine = 'Trident';
    } else if (ua.indexOf('Edg/') > -1 || ua.indexOf('Chrome') > -1) {
      userContext.browser.engine = 'Blink';
    } else {
      userContext.browser.engine = 'Unknown';
    }
    
    // Geography detection
    try {
      if (navigator.geolocation) {
        // Try to get location using browser's Geolocation API
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 600000 // 10 minutes
          });
        });
        
        userContext.geography.latitude = position.coords.latitude;
        userContext.geography.longitude = position.coords.longitude;
        userContext.geography.source = 'geolocation';
        
        // Optionally reverse geocode to get country/region/city
        // This would typically call a service like Google Maps Geocoding API
        // Example (not implemented): await reverseGeocode(position.coords);
      } else {
        throw new Error('Geolocation not supported');
      }
    } catch (geoError) {
      console.warn('Geolocation error:', geoError);
      
      // Fallback to IP-based geolocation
      try {
        // Example implementation using a free IP geolocation service
        // Note: In production, you'd want to use a more reliable service
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          userContext.geography.latitude = data.latitude;
          userContext.geography.longitude = data.longitude;
          userContext.geography.country = data.country_name;
          userContext.geography.region = data.region;
          userContext.geography.city = data.city;
          userContext.geography.source = 'ip';
        } else {
          throw new Error('IP geolocation failed');
        }
      } catch (ipError) {
        console.warn('IP geolocation error:', ipError);
        userContext.geography.source = 'unavailable';
      }
    }
  } catch (error) {
    console.error('Error detecting user context:', error);
  }
  
  // Log detailed context information to console with formatting
  console.group('%c📊 User Context Information', 'color: #0066cc; font-size: 14px; font-weight: bold;');
  
  // Browser Information
  console.group('%c🌐 Browser', 'color: #009933; font-weight: bold;');
  console.log(
    '%cName: %c' + userContext.browser.name + ' ' + userContext.browser.version,
    'font-weight: bold;',
    'color: #333; font-weight: normal;'
  );
  console.log(
    '%cEngine: %c' + userContext.browser.engine,
    'font-weight: bold;',
    'color: #333; font-weight: normal;'
  );
  console.log(
    '%cUser Agent: %c' + userContext.browser.userAgent,
    'font-weight: bold;',
    'color: #666; font-size: 11px; font-weight: normal;'
  );
  console.groupEnd();
  
  // Device Information
  console.group('%c📱 Device', 'color: #cc6600; font-weight: bold;');
  console.log(
    '%cType: %c' + userContext.device.type.charAt(0).toUpperCase() + userContext.device.type.slice(1),
    'font-weight: bold;',
    'color: #333; font-weight: normal;'
  );
  console.log(
    '%cDimensions: %c' + userContext.device.width + 'px × ' + userContext.device.height + 'px',
    'font-weight: bold;',
    'color: #333; font-weight: normal;'
  );
  console.log(
    '%cOrientation: %c' + userContext.device.orientation.charAt(0).toUpperCase() + userContext.device.orientation.slice(1),
    'font-weight: bold;',
    'color: #333; font-weight: normal;'
  );
  console.log(
    '%cTouch Capable: %c' + (userContext.device.touchCapable ? 'Yes' : 'No'),
    'font-weight: bold;',
    `color: ${userContext.device.touchCapable ? '#009933' : '#cc0000'}; font-weight: normal;`
  );
  console.groupEnd();
  
  // Geography Information
  console.group('%c🌎 Geography', 'color: #9900cc; font-weight: bold;');
  if (userContext.geography.source === 'unavailable') {
    console.log(
      '%cLocation: %cUnavailable (User denied permission or API failed)',
      'font-weight: bold;',
      'color: #cc0000; font-weight: normal;'
    );
  } else {
    console.log(
      '%cSource: %c' + (userContext.geography.source === 'geolocation' ? 'Browser Geolocation API' : 'IP-based Geolocation'),
      'font-weight: bold;',
      'color: #333; font-weight: normal;'
    );
    
    if (userContext.geography.country) {
      console.log(
        '%cLocation: %c' + 
        (userContext.geography.city ? userContext.geography.city + ', ' : '') +
        (userContext.geography.region ? userContext.geography.region + ', ' : '') +
        (userContext.geography.country ? userContext.geography.country : ''),
        'font-weight: bold;',
        'color: #333; font-weight: normal;'
      );
    }
    
    if (userContext.geography.latitude && userContext.geography.longitude) {
      console.log(
        '%cCoordinates: %c' + 
        userContext.geography.latitude.toFixed(6) + ', ' + userContext.geography.longitude.toFixed(6),
        'font-weight: bold;',
        'color: #666; font-size: 11px; font-weight: normal;'
      );
    }
  }
  console.groupEnd();
  
  // Summary table
  console.groupCollapsed('%c📋 Summary Table', 'color: #666; font-weight: bold;');
  console.table({
    Browser: {
      Name: userContext.browser.name,
      Version: userContext.browser.version,
      Engine: userContext.browser.engine
    },
    Device: {
      Type: userContext.device.type,
      Width: userContext.device.width + 'px',
      Height: userContext.device.height + 'px',
      TouchCapable: userContext.device.touchCapable,
      Orientation: userContext.device.orientation
    },
    Geography: {
      Available: userContext.geography.source !== 'unavailable',
      Source: userContext.geography.source,
      Country: userContext.geography.country || 'N/A'
    }
  });
  console.groupEnd();
  
  console.groupEnd(); // End main group
  
  return userContext;
}

// eslint-disable-next-line no-unused-vars
export default async function init(html) {
  await loadCSS('/styles/context.css');
  
  // Get user context information
  await getUserContext();
  
  // Handle editables
  const editables = document.body.querySelectorAll(EDITABLE_SELECTORS);
  editables.forEach((editable) => { handleEditable(editable); });
}
