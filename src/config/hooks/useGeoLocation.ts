import { useCallback, useEffect, useState } from "react";
import Country from "../../@types/general/Country";

export const useGeoLocationData = ({countryList} : {countryList: Country[]}) => {
  const [countryName, setCountryName] = useState<string | null>(null);
  const [dialCode, setDialCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const findCountryInList = useCallback((name: string) => {
    const normalizedName = name.toLowerCase().trim();
    return countryList.find(c => c.name!.toLowerCase().trim() === normalizedName);
  }, [countryList]);

  const fetchIpLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.reason || 'Could not determine IP location.');
      }

      const detectedCountryName = data.country_name;
      const matchingCountry = findCountryInList(detectedCountryName);

      if (matchingCountry) {
        setCountryName(matchingCountry.name);
        setDialCode(matchingCountry.dialcode);
      } else {
        setCountryName(detectedCountryName || 'Unknown Country');
        setDialCode(data.country_calling_code || 'N/A');
        console.warn(`IP detected country "${detectedCountryName}" not found in provided list.`);
      }
    } catch (err) {
      console.error('Error fetching IP location:', err);
      setError(`Failed to get IP location: ${err instanceof Error ? err.message : String(err)}`);
      setCountryName('Unknown');
      setDialCode('N/A');
    } finally {
      setLoading(false);
    }
  }, [findCountryInList]);

  const fetchBrowserLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
        console.log("navigator");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log(position);
            const { latitude, longitude } = position.coords;

            const openCageApiKey = 'c5c12bb710d04463ba04780928cfca28';

            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${openCageApiKey}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const detectedCountry = data.results[0].components.country;
              const matchingCountry = findCountryInList(detectedCountry);

              if (matchingCountry) {
                setCountryName(matchingCountry.name);
                setDialCode(matchingCountry.dialcode);
              } else {
                setCountryName(detectedCountry || 'Unknown Country');
                const dialCodeFromOpenCage = data.results[0].annotations?.callingcode ? `+${data.results[0].annotations.callingcode}` : null;
                setDialCode(dialCodeFromOpenCage || 'N/A');
              }
            } else {
              setCountryName('Unknown');
              setDialCode('N/A');
            }
          } catch (err) {
            setError(`Failed to get country from coordinates: ${err instanceof Error ? err.message : String(err)}`);
            fetchIpLocation();
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          let errorMessage = '';
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              errorMessage = 'User denied geolocation permission. Falling back to IP location.';
              break;
            case geoError.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Falling back to IP location.';
              break;
            case geoError.TIMEOUT:
              errorMessage = 'Geolocation request timed out. Falling back to IP location.';
              break;
            default:
              errorMessage = 'An unknown geolocation error occurred. Falling back to IP location.';
              break;
          }
          console.warn(errorMessage, geoError);
          setError(errorMessage);
          fetchIpLocation();
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError('Browser Geolocation is not supported.');
      fetchIpLocation();
    }
  }, [fetchIpLocation, findCountryInList]);

  useEffect(() => {
    fetchBrowserLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { countryName, dialCode, loading, error };
};