import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import './styles.scss';

// loads the Icon plugin
UIkit.use(Icons);

console.log('api url', process.env.API_BASE_URL);

const urlInput = document.getElementById('url');
const ipsum = document.getElementById('ipsum');
const parSize = document.querySelectorAll('[type="radio"]');
const form = document.querySelector('form');
const toClipboard = document.getElementById('to-clipboard');
console.log('submit', form);

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
  console.log('url', e.target.url);
  if (e.target.url.value !== '') {
    makeSkeleton();
    console.log('subm', e);
    e.target.submit.innerText = 'Making Ipsum';
    setTimeout(() => {
      e.target.submit.innerText = 'Make Ipsum';
      e.target.submit.classList.remove('success');
    }, 1200);

    // get paragraph size
    let paraSize = 10;
    parSize.forEach((i) => {
      if (i.checked) {
        paraSize = i.id;
      }
    });
    const url = `${process.env.API_BASE_URL}/make-ipsum/?url=${urlInput.value}&number-para=${e.target.paragraphs.value}&para-size=${paraSize}`;
    // const url = `http://127.0.0.1:5000/get-ipsum/`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Methods': 'POST,GET,PATCH,DELETE',
        'Content-Type': 'application/json, charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then(({ data }) => {
        makeIpsumParagraphs(data.ipsum);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log('error');
    const missingUrl = document.createElement('div');
    missingUrl.setAttribute('class', 'uk-alert-warning');

    missingUrl.innerHTML =
      '<a class="uk-alert-close" uk-close></a><p>Hey! We need a url to make ipsum!</p>';
    e.target.url.parentElement.appendChild(missingUrl);
  }
});

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
