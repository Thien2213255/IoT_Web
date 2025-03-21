const axios = require('axios');

// Replace with your Adafruit IO credentials and feed name
// const ADAFRUIT_IO_USERNAME = 'Thienhcmut3255';
// const ADAFRUIT_IO_KEY = 'aio_KGUb52xbzzTuyd97JYBcJh9htvaW';
// const FEED_NAME = 'bbc-led';

// Construct the base URL
const BASE_URL = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}`;

async function fetchFeedData(feedName) {
  const url = `${BASE_URL}/feeds/${feedName}/data`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'X-AIO-Key': ADAFRUIT_IO_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log('Feed Data:', response.data);
    return response.data
  } catch (error) {
    console.error('Error fetching data from Adafruit IO:', error.message);
  }
}

async function postDataToFeed(feedName, value) {
    const url = `${BASE_URL}/feeds/${feedName}/data`;
    
    try {
      const response = await axios.post(url, { value }, {
        headers: {
          'X-AIO-Key': ADAFRUIT_IO_KEY,
          'Content-Type': 'application/json'
        }
      });
      console.log('Data posted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error posting data to Adafruit IO:', error.message);
    }
  }
  
  // Function to update existing feed data
async function updateFeedData(feedName, dataId, newValue) {
    const url = `${BASE_URL}/feeds/${feedName}/data/${dataId}`;

    try {
        const response = await axios.patch(url, { value: newValue }, {
        headers: {
            'X-AIO-Key': ADAFRUIT_IO_KEY,
            'Content-Type': 'application/json'
        }
        });
        console.log('Data updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating data in Adafruit IO:', error.message);
    }
    }

// Function to delete data from a feed
async function deleteFeedData(feedName, dataId) {
    const url = `${BASE_URL}/feeds/${feedName}/data/${dataId}`;

    try {
        const response = await axios.delete(url, {
        headers: {
            'X-AIO-Key': ADAFRUIT_IO_KEY,
            'Content-Type': 'application/json'
        }
        });
        console.log('Data deleted:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting data from Adafruit IO:', error.message);
    }
}

// Example usage:
// Post new data
fetchFeedData(FEED_NAME);
postDataToFeed(FEED_NAME, '25');
console.log(`Fetching from: ${BASE_URL}/feeds/${FEED_NAME}/data`);


// Update existing data (replace 'DATA_ID' with the actual data point ID)
// updateFeedData(FEED_NAME, 3010267, 30);
// Delete data (replace 'DATA_ID' with the actual data point ID)
// deleteFeedData(FEED_NAME, '0FV4P8CEXZ3C7ZJJTR8YDFRG3M');
//fetchFeedData(FEED_NAME);
