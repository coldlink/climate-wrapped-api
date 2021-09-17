import { JSDOM } from "jsdom";
import mem from "mem";
import { getUrl, getDom } from "./util.js";

const getMPVotesDom = mem(async (url: string) => {
  const response = await getUrl(`${url}/votes`);
  return getDom(response);
});

interface EnvironmentVote {
  general: string | null,
  votes: string | null,
  party: string | null
}

const cleanTextEnvironmentVote = mem((textContent: string | null): EnvironmentVote => {
  const split = textContent?.split('\n').flatMap(str => str.replace('Show votes', '').split('Most current').map(s => s.trim())).filter(Boolean);
  if (split)
    return {
      general: split[0] + '.',
      votes: split[1],
      party: split[2],
    }
  else
    return {
      general: null,
      votes: null,
      party: null,
    };
});

const getEnvironmentVotes = (dom: JSDOM) => {
  const votes: EnvironmentVote[] = [];
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

export const getEnvironmentVotesMPByPostcode = mem( async (postcode: string) => {
  const mpUrlResponse = await getUrl(`https://www.theyworkforyou.com/postcode/?pc=${postcode}`)
  const mpVotesDom = await getMPVotesDom(mpUrlResponse.url);
  return getEnvironmentVotes(mpVotesDom)
});
