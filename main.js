// Class for fetching data from the API
class OfferApiService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl; // Store the API URL
  }

  // Method to fetch offers from the API
  fetchOffers() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.apiUrl, true);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          if (data.state === 'ok') {
            resolve(data.result.elements); // Resolve with offers
          } else {
            reject(new Error('Failed to fetch offers'));
          }
        } else {
          reject(new Error('Request failed. Status: ' + xhr.status));
        }
      };
      xhr.onerror = () => reject(new Error('Request failed.'));
      xhr.send(); // Send the request
    });
  }
}

// Main class to initialize the application
class App {
  constructor(apiUrl, refs) {
    this.offerApiService = new OfferApiService(apiUrl); // Create instance of OfferApiService
  }

  // Method to initialize the app
  async init() {
    try {
      const offers = await this.offerApiService.fetchOffers(); // Fetch offers from API
      console.log('offers', offers);
    } catch (error) {
      console.error('Error fetching offers:', error); // Log any errors
    }
  }
}

// Run the application after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://veryfast.io/t/front_test_api.php';
  const refs = {
    list: document.querySelector('.mcafee-list'),
    arrowWrapper: document.querySelector('.arrow-indicator'),
  };
  const app = new App(apiUrl, refs); // Create instance of App with API URL
  app.init(); // Initialize the app
});
