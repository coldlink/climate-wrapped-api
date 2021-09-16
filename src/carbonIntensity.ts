import got from 'got';

export const getCarbonIntensityForPostcode = async (postcode: string) => {
    const response = await got(`https://api.carbonintensity.org.uk/regional/postcode/${postcode}`, {
      headers: {
        Accept: 'application/json'
      }
    });
    return JSON.parse(response.body).data[0];
}