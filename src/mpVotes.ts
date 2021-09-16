import { JSDOM } from "jsdom";
import { getUrl, getDom } from "./util";

const getMPVotesDom = async (url: string) => {
  const response = await getUrl(`${url}/votes`);
  return getDom(response);
}

const cleanTextEnvironmentVote = (textContent: string | null) => {
  const split = textContent?.split('\n').map(str => str.replace('Show votes', '').trim()).filter(Boolean);
  if (split)
    return [split[0] + '.', split[1]];
  else
    return ['', ''];
}

const getEnvironmentVotes = (dom: JSDOM) => {
  const votes: string[][] = [];
  let title = '';
  const environmentElement = dom.window.document.getElementById('environment');
  const parentElement = environmentElement?.parentElement;
  if (environmentElement && parentElement) {
    title = environmentElement.textContent?.replace('#', '').trim() || '';
    const votesList = parentElement?.querySelectorAll('li');
    if (votesList.length) {
      votesList.forEach(elem => votes.push(cleanTextEnvironmentVote(elem.textContent)));
    }
  }
  return {
    title,
    votes,
  };
}

export const getEnvironmentVotesMPByPostcode = async (postcode: string) => {
  const mpUrlResponse = await getUrl(`https://www.theyworkforyou.com/postcode/?pc=${postcode}`)
  const mpVotesDom = await getMPVotesDom(mpUrlResponse.url);
  return getEnvironmentVotes(mpVotesDom)
}
