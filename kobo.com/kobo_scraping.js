const bookFields = [
  {
    name: 'title',
    koboQuerySelector: 'span.title.product-field',
    koboFieldSelector: 'textContent',
    goodreadsFormId: 'book_title',
    defaultValue: ''
  },
  {
    name: 'author',
    koboQuerySelector: 'a.contributor-name:nth-child(1)',
    koboFieldSelector: 'textContent',
    goodreadsFormId: 'author_name',
    defaultValue: ''
  },
  {
    name: 'isbn',
    koboQuerySelector: '.bookitem-secondary-metadata > ul:nth-child(2) > li:nth-child(4) > span:nth-child(1)',
    koboFieldSelector: 'textContent',
    goodreadsFormId: 'book_isbn13',
    defaultValue: ''
  },
  {
    name: 'format',
    koboQuerySelector: '',
    koboFieldSelector: '',
    goodreadsFormId: 'book_format',
    defaultValue: 'ebook'
  },
  {
    name: 'page count',
    koboQuerySelector: '.sp-bookStats .col1 .stat-desc strong',
    koboFieldSelector: '',
    goodreadsFormId: 'book_num_pages',
    defaultValue: ''
  },
  {
    name: 'date published',
    koboQuerySelector: 'body > div.kobo-main > div.inner-wrap.content-main > div.BookItemDetailSecondaryMetadataWidget > div > div:nth-child(1) > div > ul > li:nth-child(2) > span',
    koboFieldSelector: 'textContent',
    goodreadsFormId: ['book_publication_year', 'book_publication_month', 'book_publication_day'],
    defaultValue: ''
  },
  {
    name: 'publisher',
    koboQuerySelector: 'body > div.kobo-main > div.inner-wrap.content-main > div.BookItemDetailSecondaryMetadataWidget > div > div:nth-child(1) > div > ul > li:nth-child(3) > a > span',
    koboFieldSelector: 'textContent',
    goodreadsFormId: 'book_publisher',
    defaultValue: ''
  },
  {
    name: 'language',
    koboQuerySelector: 'body > div.kobo-main > div.inner-wrap.content-main > div.BookItemDetailSecondaryMetadataWidget > div > div:nth-child(1) > div > ul > li:nth-child(5) > span',
    koboFieldSelector: 'textContent',
    goodreadsFormId: 'book_language_code',
    defaultValue: ''
  },
  {
    name: 'cover image',
    koboQuerySelector: '.instantpreview-hitbox > div:nth-child(1) > div:nth-child(1) > img:nth-child(1)',
    koboFieldSelector: 'src',
    goodreadsFormId: 'book_photo',
    defaultValue: ''
  },
  {
    name: 'description',
    koboQuerySelector: '.synopsis-description',
    koboFieldSelector: 'textContent',
    goodreadsFormId: 'book_description_defaulted',
    defaultValue: ''
  }
];

const languageMapping = {
  'English': 'eng',
  'Anglais': 'eng',
  'French': 'fre',
  'Français': 'fre'
};

function toTitleCase(str) {
	str = str.toLowerCase().split(' ');
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
};

const KOBO_BOOK_URL = 'https://cors-anywhere.herokuapp.com/https://www.kobo.com/us/en/ebook/tentative-d-evasion-fiscale';

fetch(KOBO_BOOK_URL)
  .then(response => response.text())
  .then(respHtml => {
    // parse kobo HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(respHtml, "text/html");
    // loop on our selecor list
    bookFields.forEach(bookField => {
      if (bookField.koboQuerySelector && doc.body.querySelector(bookField.koboQuerySelector)) {
        // extract from kobo
        const koboFieldValue = doc.body.querySelector(bookField.koboQuerySelector)[bookField.koboFieldSelector];
        console.log('found:', bookField.name, koboFieldValue);
        // populate form
        if (bookField.name === 'author') {
          document.querySelector(`#${bookField.goodreadsFormId}`).value = toTitleCase(koboFieldValue);
        } else if (bookField.name === 'date published') {
          const book_date_published = new Date(koboFieldValue);
          document.querySelector(`#${bookField.goodreadsFormId[0]}`).value = book_date_published.getFullYear();
          document.querySelector(`#${bookField.goodreadsFormId[1]}`).value = book_date_published.getMonth() + 1;
          document.querySelector(`#${bookField.goodreadsFormId[2]}`).value = book_date_published.getDate();
        } else if (bookField.name === 'language') {
          document.querySelector(`#${bookField.goodreadsFormId}`).value = languageMapping[koboFieldValue];
        } else if (bookField.name === 'cover image') {
          // would need to download the image first, and then select the file
          // doing it manually for now
        } else {
          document.querySelector(`#${bookField.goodreadsFormId}`).value = koboFieldValue;
        }
      } else {
        // query selector absent or not found on the Kobo page
        console.log('not found:', bookField.name);
        if (bookField.goodreadsFormId) {
          document.querySelector(`#${bookField.goodreadsFormId}`).value = bookField.defaultValue;
        }
      }
    })
});




















