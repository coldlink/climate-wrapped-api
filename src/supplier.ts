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
