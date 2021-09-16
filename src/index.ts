import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import { getEnvironmentVotesMPByPostcode } from './mpVotes.js';
import { getCarbonIntensityForPostcode } from './carbonIntensity.js';
import { getSupplierEnergy, getSuppliers, getSupplierFuelMixPercentage } from './supplier.js';

const router: Express = express();

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
router.get('/mp/:postcode', async (req, res) => {
  const { postcode } = req.params;
  try {
    const votes = await getEnvironmentVotesMPByPostcode(postcode);
    return res.status(200).json(votes)
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.get('/carbon-intensity/:postcode', async (req, res) => {
  try {
    const { postcode } = req.params;
    const carbonIntensity = await getCarbonIntensityForPostcode(postcode)
    return res.status(200).json(carbonIntensity);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
})

router.get('/suppliers', async (_, res) => {
  try {
    const suppliers = await getSuppliers();
    return res.status(200).json({ suppliers });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
})

router.get('/suppliers/fuel-mix', async (_, res) => {
  const fuelMix = await getSupplierFuelMixPercentage()
  return res.status(200).json(fuelMix);
})

router.get('/suppliers/fuel-mix/:code', async (req, res) => {
  const { code } = req.params;
  const fuelMix = await getSupplierFuelMixPercentage(code)
  return res.status(200).json(fuelMix);
})

router.get('/suppliers/usage/:code/:usage', async (req, res) => {
  try {
    const { code, usage } = req.params;
    const emissions = await getSupplierEnergy(code, usage);
    return res.status(200).json({ emissions });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
})

/** Error handling */
router.use((_, res,) => {
    const error = new Error('Not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));