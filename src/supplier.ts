import got, { Response } from 'got';
import { getUrl, getDom } from "./util";

export const getSuppliers = async () => {
  const response = await getUrl('https://electricityinfo.org/carbon-calculator/');
  let codes = [];
  const dom = getDom(response)
  const select = dom.window.document.querySelector('[name=s_code]') as HTMLSelectElement | null
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      const option = select.options[i];
      const code = option.value;
      const name = option.text;
      codes.push({
        code,
        name
      });
    }
  }
  return codes;
}

interface Emissions {
  emissionsKg: number | null;
  nuclearWasteG: number | null;
}

export const getSupplierEnergy = async (supplier: string, usage: string | number) => {
  const response = await got("https://electricityinfo.org/carbon-calculator/", {
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
    },
    "body": `s_code=${supplier}&units=${usage}&Submit=Calculate`,
    "method": "POST",
    followRedirect: true,
  });
  
  const result: Emissions = {
    emissionsKg: null,
    nuclearWasteG: null
  }
  
  const dom = getDom(response);
  
  const box = dom.window.document.querySelector('.calculatorbox');
  
  if (box) {
    const p = box.querySelectorAll('p');
    p.forEach(elem => {
      const text = elem.textContent;
      if (text?.includes('Your annual household carbon dioxide emissions from electricity use are')) {
        result.emissionsKg = +text.replace(/[^\d.]/g, '').slice(0, -1)
      }
      if (text?.includes('high-level nuclear waste per year')) {
        result.nuclearWasteG = +text.replace(/[^\d.]/g, '').slice(0, -1)
      }
    })
  }
  
  return result;
}

const supplierFuelMixPercentage = [
  {
    "supplier": "Angelic Energy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Avro Energy",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "Beam Energy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Boost",
    "coal": 0,
    "gas": 48.1,
    "nuclear": 0,
    "renewable": 51.9,
    "other": 0,
    "CO2": 178,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Breeze",
    "coal": 8.9,
    "gas": 60.3,
    "nuclear": 18.1,
    "renewable": 8.9,
    "other": 3.8,
    "CO2": 327,
    "nuclear waste": 0.00126,
    "year": 2019
  },
  {
    "supplier": "Bristol Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "British Gas",
    "coal": 0,
    "gas": 0,
    "nuclear": 24,
    "renewable": 76,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0.0017,
    "year": 2020
  },
  {
    "supplier": "Bulb",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "CitizEn",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "E",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "E.ON",
    "coal": 2.6,
    "gas": 30.5,
    "nuclear": 3.5,
    "renewable": 61.2,
    "other": 2.2,
    "CO2": 159,
    "nuclear waste": 0.00025,
    "year": 2020
  },
  {
    "supplier": "EBICo",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Economy 7 Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "Ecotricity",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "EDF Energy",
    "coal": 3.5,
    "gas": 9.3,
    "nuclear": 66.6,
    "renewable": 20.5,
    "other": 0.1,
    "CO2": 70,
    "nuclear waste": 0.0047,
    "year": 2020
  },
  {
    "supplier": "Energy SW",
    "coal": 0,
    "gas": 61,
    "nuclear": 0,
    "renewable": 39,
    "other": 0,
    "CO2": 212,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "Engie",
    "coal": 4,
    "gas": 44,
    "nuclear": 5,
    "renewable": 44,
    "other": 3,
    "CO2": 231,
    "nuclear waste": 0.00035,
    "year": 2020
  },
  {
    "supplier": "Enstroga",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "Entice Energy",
    "coal": 0.1,
    "gas": 1.4,
    "nuclear": 0.2,
    "renewable": 98,
    "other": 0.1,
    "CO2": 8,
    "nuclear waste": 0.00001,
    "year": 2020
  },
  {
    "supplier": "ESB Energy",
    "coal": 6,
    "gas": 67,
    "nuclear": 8,
    "renewable": 15,
    "other": 5,
    "CO2": 349,
    "nuclear waste": 0.00056,
    "year": 2020
  },
  {
    "supplier": "Fairer Power",
    "coal": 0,
    "gas": 61,
    "nuclear": 0,
    "renewable": 39,
    "other": 0,
    "CO2": 212,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "Fosse Energy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Foxglove Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "Glide",
    "coal": 0,
    "gas": 48.1,
    "nuclear": 0,
    "renewable": 51.9,
    "other": 0,
    "CO2": 178,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Good Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Goto Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Great North Energy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Green",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Green Energy UK",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Green Network Energy",
    "coal": 0.8,
    "gas": 9.1,
    "nuclear": 1,
    "renewable": 88.5,
    "other": 0.7,
    "CO2": 47,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Green Star Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "HUB energy (Gulf Gas & Power)",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Igloo Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "iSupplyEnergy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "Leccy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "London Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Lumo",
    "coal": 0,
    "gas": 60.8,
    "nuclear": 0,
    "renewable": 39.2,
    "other": 0,
    "CO2": 212,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "Nabuh Energy",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "npower",
    "coal": 4.8,
    "gas": 54.4,
    "nuclear": 6.2,
    "renewable": 30.7,
    "other": 3.9,
    "CO2": 285,
    "nuclear waste": 0.0004,
    "year": 2020
  },
  {
    "supplier": "npower Northern",
    "coal": 6,
    "gas": 69,
    "nuclear": 7.9,
    "renewable": 12.1,
    "other": 5,
    "CO2": 362,
    "nuclear waste": 0.0006,
    "year": 2020
  },
  {
    "supplier": "npower Yorkshire",
    "coal": 6.2,
    "gas": 71.2,
    "nuclear": 8.1,
    "renewable": 9.3,
    "other": 5.1,
    "CO2": 373,
    "nuclear waste": 0.0006,
    "year": 2020
  },
  {
    "supplier": "Octopus Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Orbit Energy",
    "coal": 1.7,
    "gas": 19,
    "nuclear": 2.2,
    "renewable": 75.9,
    "other": 1.4,
    "CO2": 99,
    "nuclear waste": 0.00015,
    "year": 2020
  },
  {
    "supplier": "Outfox the Market",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "OVO Energy",
    "coal": 0,
    "gas": 48.1,
    "nuclear": 0,
    "renewable": 51.9,
    "other": 0,
    "CO2": 178,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "People's Energy",
    "coal": 0.2,
    "gas": 3,
    "nuclear": 0.3,
    "renewable": 97,
    "other": 0.2,
    "CO2": 15,
    "nuclear waste": 0.00002,
    "year": 2020
  },
  {
    "supplier": "Peterborough Energy",
    "coal": 0,
    "gas": 61,
    "nuclear": 0,
    "renewable": 39,
    "other": 0,
    "CO2": 212,
    "nuclear waste": 0,
    "year": 2019
  },
  {
    "supplier": "Places for People Energy",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "Powershop",
    "coal": 4.8,
    "gas": 54.4,
    "nuclear": 6.2,
    "renewable": 30.7,
    "other": 3.9,
    "CO2": 285,
    "nuclear waste": 0.0004,
    "year": 2020
  },
  {
    "supplier": "Pure Planet",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "RAM Energy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Robin Hood Energy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Sainsbury Energy",
    "coal": 4.8,
    "gas": 54.4,
    "nuclear": 6.2,
    "renewable": 30.7,
    "other": 3.9,
    "CO2": 285,
    "nuclear waste": 0.0004,
    "year": 2020
  },
  {
    "supplier": "ScottishPower",
    "coal": 4,
    "gas": 50,
    "nuclear": 6,
    "renewable": 36,
    "other": 4,
    "CO2": 264,
    "nuclear waste": 0.0004,
    "year": 2020
  },
  {
    "supplier": "Shell Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Simplicity",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "So Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Southend Energy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Spark Energy",
    "coal": 0,
    "gas": 48.1,
    "nuclear": 0,
    "renewable": 51.9,
    "other": 0,
    "CO2": 178,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "SSE",
    "coal": 4,
    "gas": 67,
    "nuclear": 4,
    "renewable": 23,
    "other": 2,
    "CO2": 289,
    "nuclear waste": 0.0003,
    "year": 2019
  },
  {
    "supplier": "Symbio",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Together Energy",
    "coal": 5.7,
    "gas": 64.9,
    "nuclear": 7.4,
    "renewable": 17.4,
    "other": 4.7,
    "CO2": 340,
    "nuclear waste": 0.00052,
    "year": 2020
  },
  {
    "supplier": "Tonik Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Utilita",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "Utility Point",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "Utility Warehouse",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.0006,
    "year": 2020
  },
  {
    "supplier": "White Rose Energy",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Yorkshire Energy",
    "coal": 0,
    "gas": 0,
    "nuclear": 0,
    "renewable": 100,
    "other": 0,
    "CO2": 0,
    "nuclear waste": 0,
    "year": 2020
  },
  {
    "supplier": "Your Energy Sussex",
    "coal": 0.6,
    "gas": 3.8,
    "nuclear": 1.1,
    "renewable": 94.3,
    "other": 0.2,
    "CO2": 20,
    "nuclear waste": 0.00008,
    "year": 2019
  },
  {
    "supplier": "Zebra Power",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "Residual Fuel Mix",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020
  },
  {
    "supplier": "UK Average",
    "coal": 3.9,
    "gas": 39.4,
    "nuclear": 16.6,
    "renewable": 37.9,
    "other": 2.2,
    "CO2": 198,
    "nuclear waste": 0.00116,
    "year": 2020
  }
]
 
export const getSupplierFuelMixPercentage = async (code?: string) => {
  const suppliers = await getSuppliers();
  
  const supplierFuelMixPercentageWithCode = supplierFuelMixPercentage.map(supplierFuelMix => ({
    ...supplierFuelMix,
    code: suppliers.find(supplier => supplier.name === supplierFuelMix.supplier)?.code
  }))
  
  if (code) {
    return supplierFuelMixPercentageWithCode.find(supplierFuelMix => supplierFuelMix.code === code)
  }
  
  return supplierFuelMixPercentageWithCode;
}