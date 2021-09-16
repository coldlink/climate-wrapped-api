import got from 'got';
import mem from 'mem';

export const getCarbonIntensityForPostcode = mem(async (postcode: string) => {
  const response = await got(`https://api.carbonintensity.org.uk/regional/postcode/${postcode}`, {
    headers: {
      Accept: 'application/json'
    }
  });
  return JSON.parse(response.body).data[0];
});