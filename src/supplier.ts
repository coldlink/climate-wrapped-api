import { getUrl, getDom } from "./util";

export const getSuppliers = async () => {
  const response = await getUrl('https://electricityinfo.org/carbon-calculator/#calculator');
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