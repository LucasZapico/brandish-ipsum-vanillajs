import Icons from 'uikit/dist/js/uikit-icons.js';
import UIkit from 'uikit';

import './styles.scss';

// loads the Icon plugin
UIkit.use(Icons);

console.log('api url', process.env.API_BASE_URL);

const urlInput = document.getElementById('url');
const ipsum = document.getElementById('ipsum');
const root = document.getElementById('root');
const parSize = document.querySelectorAll('[type="radio"]');
const form = document.querySelector('form');

const toClipboard = document.getElementById('to-clipboard');
console.log('submit', form);

async function handleQuery(query) {
  const response = await fetch(query, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Methods': 'POST,GET,PATCH,DELETE',
      'Content-Type': 'application/json, charset=utf-8',
    },
  });
  const data = await response.json();
  return data;
}

test.addEventListener('click', (e) => {
  test.innerText = 'Testing';
  makeSkeleton();
  const query = `${process.env.API_BASE_URL}/make-ipsum/?url=https://roaveyewear.com/&number-para=2&para-size=150`;
  // const url = `http://127.0.0.1:5000/get-ipsum/`;
  handleQuery(query)
    .then(({ data }) => {
      test.innerText = 'Test it out';
      makeIpsumParagraphs(data.ipsum);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

toClipboard.addEventListener('click', (e) => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(ipsum);
  selection.removeAllRanges();
  selection.addRange(range);
  console.log('clip');
  try {
    document.execCommand('copy');
    selection.removeAllRanges();
    toClipboard.innerText = 'Copied!';
    toClipboard.classList.add('success');
    setTimeout(() => {
      toClipboard.innerText = 'Copy to Clipboard';
      toClipboard.classList.remove('success');
    }, 1200);
  } catch (e) {
    console.log(e);
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.url.value !== '') {
    makeSkeleton();
    e.target.submit.innerText = 'Making Ipsum';
    // get paragraph size
    let paraSize = 10;
    parSize.forEach((i) => {
      if (i.checked) {
        paraSize = i.id;
      }
    });
    const query = `${process.env.API_BASE_URL}/make-ipsum/?url=${urlInput.value}&number-para=${e.target.paragraphs.value}&para-size=${paraSize}`;
    // const url = `http://127.0.0.1:5000/get-ipsum/`;
    handleQuery(query)
      .then((response) => {
        console.log('response', response);
        if (response.data) {
          const { data } = response;
          e.target.submit.innerText = 'Make Ipsum';
          makeIpsumParagraphs(data.ipsum);
        } else if (response.error) {
          console.log('error in response');
          handleResponseError(response.error);
        }
      })
      .catch((error) => {
        e.target.submit.innerText = 'Make Ipsum';
        console.log('error running');
        console.log('error', error);
        return error;
      });
  } else {
    handleEmptyUrl();
  }
});

function handleEmptyUrl() {
  const missingUrl = document.createElement('div');
  missingUrl.innerHTML = `<div class="uk-alert-warning" uk-alert>
  <a class="uk-alert-close" uk-close></a> <p>Hey! We need a url to make ipsum!</p></div>`;
  root.insertBefore(missingUrl, form);
}

function handleResponseError(error) {
  const errorMessage = document.createElement('div');

  errorMessage.innerHTML = `<div class="uk-alert-danger" uk-alert><a class="uk-alert-close" uk-close></a><p>${error.message}</p></div>`;
  root.insertBefore(errorMessage, form);
  ipsum.innerHTML = '<br />';
}

function makeIpsumParagraphs(ipsumArr) {
  if (ipsum.childElementCount > 1) {
    ipsum.innerHTML = '<br />';
    ipsumArr.forEach((p) => {
      const para = document.createElement('p');
      para.setAttribute('class', 'uk-text');
      para.innerText = p;
      ipsum.appendChild(para);
    });
  } else {
    ipsumArr.forEach((p) => {
      const para = document.createElement('p');
      para.setAttribute('class', 'uk-text');
      para.innerText = p;
      ipsum.appendChild(para);
    });
  }
}

function makeSkeleton() {
  ipsum.innerHTML = '<br />';
  for (let i = 0; i < 5; i = i + 1) {
    const skeleton = document.createElement('div');
    skeleton.setAttribute('class', 'skeleton');
    ipsum.appendChild(skeleton);
  }
}
