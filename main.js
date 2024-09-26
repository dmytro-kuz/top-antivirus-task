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

class OfferCardList {
  constructor(listElement) {
    this.listElement = listElement; // Store the list element
  }

  // Method to fetch offers from the server
  async fetchOffers(url) {
    try {
      const response = await fetch(url); // Perform the AJAX request
      if (!response.ok) {
        throw new Error('Network response was not ok'); // Handle errors
      }
      const offers = await response.json(); // Parse JSON response
      this.renderOfferCards(offers); // Render offers on the page
    } catch (error) {
      console.error('Failed to fetch offers:', error); // Log errors
    }
  }

  // Method to render offer cards
  renderOfferCards(offers) {
    const html = offers.map((offer) => this.createOfferCard(offer)).join(''); // Generate HTML for each offer
    this.listElement.innerHTML = html; // Set inner HTML of the list
  }

  // Method to create HTML for a single offer card
  createOfferCard(offer) {
    const { name_display, license_name, amount, is_best, price_key, link } = offer;

    // Determine license period for display
    const licensePeriod = license_name.toLowerCase().includes('month') ? 'mo' : 'per year';
    const splitElement = name_display.split('Protection')[1];
    const nameProd = name_display.split(splitElement)[0];
    // Check if price_key is a valid number
    const priceKeyNumber = parseInt(price_key, 10);
    const isNumber = !isNaN(priceKeyNumber);

    let fullPrice;
    if (isNumber) {
      fullPrice = (amount / priceKeyNumber) * 100 + 0.01;
    }

    // Check if the discount class should be applied
    const discountClass = price_key === '50%' ? 'discount' : ''; // Add discount class if price_key is 50%

    // Create HTML for the offer card
    return `
      <li class="mcafee-list__item ${is_best ? 'best' : ''} ${discountClass}">
        <div class="item-price">$${amount} <span>/ ${licensePeriod}</span></div>
  ${isNumber ? `<div class="item-price-old">$${fullPrice.toFixed(2)}</div>` : ''}
        <div class="item-description">
          <div class="description-title">${nameProd}</div>
          <div class="description-period">${license_name}</div>
          <div class="item-button">
            <a href="${link}" download="${name_display}"><span>Download</span> <img src="./assets/download-icon.svg" alt="download"></a>
          </div>
        </div>
      </li>
    `;
  }
}

// Main class to initialize the application
class App {
  constructor(apiUrl, refs) {
    this.offerApiService = new OfferApiService(apiUrl); // Create instance of OfferApiService
    this.offerCardList = new OfferCardList(refs.list); // Create instance of OfferCardList
  }

  // Method to initialize the app
  async init() {
    try {
      const offers = await this.offerApiService.fetchOffers(); // Fetch offers from API
      this.offerCardList.renderOfferCards(offers);
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
