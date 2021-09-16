import got, { Response } from 'got';
import { JSDOM } from 'jsdom';

export const getUrl = async (url: string) => got(url, { followRedirect: true });

export const getDom = (response: Response<string>) => new JSDOM(response.body);