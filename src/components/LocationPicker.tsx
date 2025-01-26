import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { Location } from '../types';

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
}

// Center on India
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

// Map of Indian states to their primary languages
const stateToLanguage: { [key: string]: string } = {
  'Andhra Pradesh': 'Telugu',
  'Telangana': 'Telugu',
  'Tamil Nadu': 'Tamil',
  'Kerala': 'Malayalam',
  'Karnataka': 'Kannada',
  'Maharashtra': 'Marathi',
  'Gujarat': 'Gujarati',
  'Punjab': 'Punjabi',
  'West Bengal': 'Bengali',
  'Bihar': 'Bhojpuri',
  'Assam': 'Assamese',
  'Odisha': 'Odia',
  'Delhi': 'Hindi',
  'Uttar Pradesh': 'Hindi',
  'Madhya Pradesh': 'Hindi',
  'Rajasthan': 'Hindi',
  'Haryana': 'Hindi',
  'Himachal Pradesh': 'Hindi',
  'Uttarakhand': 'Hindi',
  'Jharkhand': 'Hindi',
  'Chhattisgarh': 'Hindi',
};

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);

  const getStateFromAddress = (address: string): string => {
    for (const state of Object.keys(stateToLanguage)) {
      if (address.includes(state)) {
        return state;
      }
    }
    return 'Unknown';
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ location: { lat, lng } });
      
      if (result.results[0]) {
        const address = result.results[0].formatted_address;
        const state = getStateFromAddress(address);
        const language = stateToLanguage[state] || 'Hindi'; // Default to Hindi if state not found

        const location = {
          lat,
          lng,
          address,
          state,
          language
        };
        setSelectedLocation(location);
        onLocationSelect(location);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={defaultCenter}
            zoom={5}
            onClick={handleMapClick}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              minZoom: 4,
              restriction: {
                latLngBounds: {
                  north: 35.513327,
                  south: 6.4626999,
                  west: 68.1766451,
                  east: 97.395561,
                },
                strictBounds: true,
              },
            }}
          >
            {selectedLocation && (
              <Marker
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                icon={{
                  url: 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-orange-500">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  `),
                  scaledSize: new google.maps.Size(30, 30)
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      {selectedLocation && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <p className="text-gray-700">{selectedLocation.address}</p>
              <p className="text-sm text-orange-600 mt-1">
                Primary Language: <span className="font-semibold">{selectedLocation.language}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;