const API_ENDPOINT = 'https://api.github.com/repos/mdyd-dev/nearme-documentation/commits';
const filePath = () => `?path=marketplace_builder/views/pages${window.location.pathname}.liquid`;
const container = () => document.querySelector('[data-contributors]');
const homepage = () => window.location.pathname.length === 1;

const getLastUpdateTime = data => {
  const commitDate = new Date(data[0].commit.committer.date);

  // prettier-ignore
  return commitDate.toLocaleString('en-ENG', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const getHtml = ({ author, item }) => {
  const authorName = item.commit.author.name;
  return `<a href="${author.html_url}" target="_blank">
    <img src="${author.avatar_url}&s=20"
      alt="${authorName} (${author.login})"
      width="20" height="20" />
    </a>`;
};

const getContributors = data => {
  const uniqueAuthors = [];

  return data
    .filter(item => item && item.author)
    .map(item => {
      if (uniqueAuthors.indexOf(item.author.id) < 0) {
        uniqueAuthors.push(item.author.id);
        return getHtml({
          author: item.author,
          item: item
        });
      }
    })
    .join('');
};

const getHTML = data => {
  return `
    <p class="mb-0 d-flex align-items-center">
      <span>Last edit:</span>&nbsp; ${getLastUpdateTime(data)}
    </p>
    <p class="mb-0 d-flex align-items-center">
      <span>Contributors:</span>&nbsp; ${getContributors(data)}
    </p>
  `;
};

const updateHtml = data => (container().innerHTML = getHTML(data));

const initialize = () => {
  if (container() && !homepage()) {
    fetch(`${API_ENDPOINT}${filePath()}`, {
      method: 'get'
    })
      .then(response => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(data => (data.length ? updateHtml(data) : undefined))
      .catch(response =>
        response.then(err => console.log('Github API fetch resulted in an error: ', err))
      );
  }
};

document.addEventListener('turbolinks:load', initialize);
