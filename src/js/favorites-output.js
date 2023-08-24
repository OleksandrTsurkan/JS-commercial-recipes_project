// ================================
// сторінка favorite =============

const screenWidth = window.innerWidth;
const categoryFilter = document.querySelector('.favorite-categories');
const recipeList = document.querySelector('.card-recipe-favorite');
const categorySelect = document.querySelector('.category-select');
const errorMessageEl = document.querySelector('.js-noone');
const paginationList = document.querySelector('.page-pagination-list');
const iconsUrl = new URL('../img/icons.svg', import.meta.url);

const refs = {
  btnBegin: document.querySelector('.btn-beginning'),
  btnPrev: document.querySelector('.btn-previous'),
  btnFirst: document.querySelector('.btn-first'),
  btnSecond: document.querySelector('.btn-second'),
  btnThird: document.querySelector('.btn-third'),
  btnOther: document.querySelector('.btn-show-others'),
  btnNext: document.querySelector('.btn-next'),
  btnEnd: document.querySelector('.btn-end'),
};

// FAVORITE_RECIPE сюди додавати після натискання кнопки додати в улюблені
const FAVORITE_RECIPE = JSON.parse(localStorage.getItem('FAVORITE_RECIPE'));
console.log(FAVORITE_RECIPE);

let currentPage = 1;
let itemsPerPage = 6;
console.log(screenWidth === 768);

function screenWidthFunct() {
  if (screenWidth >= 768) {
    itemsPerPage = 9;
  } else if (screenWidth >= 1280) {
    itemsPerPage = 12;
  }
  console.log(itemsPerPage);
}

let allElements;
let totalPages;

//запуск
function run() {

  if (FAVORITE_RECIPE && FAVORITE_RECIPE.length) {

    allElements = FAVORITE_RECIPE.length;
    totalPages = Math.ceil(allElements / itemsPerPage);
    if (allElements <= itemsPerPage) {
      paginationList.style.display = 'none';
    } else {
      refs.btnOther.textContent = totalPages;
    }
    if (totalPages <= 3) {
      refs.btnThird.style.display = 'none';
    }
    if (totalPages <= 2) {
      refs.btnSecond.style.display = 'none';
    }
    renderMarkup(sliceMarkupFun(FAVORITE_RECIPE)); //завантаження списку на сторінку з локал сторедж
  } else {
    paginationList.style.display = 'none';
    categoryFilter.style.display = 'none'; // приховує фільтр по категорії
    errorMessageEl.style.display = 'block'; //повідомлення про пустий список
  }
}

function sliceMarkupFun(markup) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedMarkup = markup.slice(startIndex, endIndex);
  return slicedMarkup;
}

// рендер html, відображає на сторінці
function renderMarkup(slicedMarkup) {
  recipeList.innerHTML = ' ';
  addCardsInHtml(slicedMarkup);
}

function addCardsInHtml(result) {
  recipeList.insertAdjacentHTML('beforeend', createMarkup(result));
}
// // створює список карток

function createMarkup(recipes) {
  return recipes
    .map(el => {
      const numStars = Math.round(el.rating);
      let stars = ``;

      for (let i = 0; i < numStars; i++) {
        stars += `<svg class="rat-icon act">
              <use href="${iconsUrl.pathname}#icon-Star"></use></svg>`;
      }

      if (numStars < 5) {
        for (let i = 0; i < 5 - numStars; i++) {
          stars += `<svg class="rat-icon ">
              <use href="${iconsUrl.pathname}#icon-Star"></use></svg>`;
        }
      }

      return `
    <li class="recipe-item">
      <div class="photo-recipe-card " style="background-image: linear-gradient( 1deg, rgba(5, 5, 5, 0.6) 50%, rgba(5, 5, 5, 0) 100% ), url('${
        el.preview
      }'); background-repeat: no-repeat; background-size: cover;">
      <button class="fav-btn" >
      <svg class="fav-icon activ" data-id="${el._id}">
          <use href="${iconsUrl.pathname}#icon-heart-full"></use>
        </svg>
      </button>

      <div class="info-recipe-card  " >
        <h2 class="title-recipe-card">
          ${el.title}
        </h2>
        <p class="descr-recipe-card">
          ${el.description.slice(0, 94)}...
        </p>
        <div class="thum-raying-card">
          <div class="rating-recipe-card">
          <span class="rating-value ">${el.rating.toFixed(1)}</span>
        ${stars}

        </div>
        <button class="see-recipe-card" data-id="${el._id}">See recipe</button>
        </div>
      </div>
    </div>
    </li>`;
    })
    .join('');
}

categorySelect.addEventListener('change', handlerCategorySelect);

// // фільтр
function handlerCategorySelect(event) {
  const selectedCategory = event.target.value;
  console.log(selectedCategory);
  if (selectedCategory === '0') {
    renderMarkup(sliceMarkupFun(FAVORITE_RECIPE));
  } else {
    const filteredRecipes = FAVORITE_RECIPE.filter(
      recipe => recipe.category === selectedCategory
    );
    console.log(filteredRecipes);
    renderMarkup(filteredRecipes);
  }
}

// //пагінація
paginationList.addEventListener('click', event => {
  if (event.target.classList.contains('btn-list')) {
    if (event.target.classList.contains('btn-first')) {
      currentPage = 1;
    } else if (event.target.classList.contains('btn-second')) {
      currentPage = 2;
    } else if (event.target.classList.contains('btn-third')) {
      currentPage = 3;
    } else if (event.target.classList.contains('btn-show-others')) {
      currentPage = totalPages;
    }
    renderingBtn();
  }
});

refs.btnNext.addEventListener('click', () => {
  if (currentPage === totalPages) {
    currentPage += 1;
  }
  renderingBtn();
});
refs.btnPrev.addEventListener('click', () => {
  if (currentPage < 1) {
    currentPage -= 1;
    renderingBtn();
  }
});

function renderingBtn() {
  deactiveBtn();
  activeBtn();
  renderMarkup(sliceMarkupFun(FAVORITE_RECIPE));
}

function activeBtn() {
  if (currentPage > 1) {
    refs.btnPrev.classList.add('act');
    refs.btnBegin.classList.add('act');
  }
  if (currentPage === 1) {
    refs.btnFirst.classList.add('act');
  }
  if (currentPage === 2) {
    refs.btnSecond.classList.add('act');
  }
  if (currentPage === 3) {
    refs.btnThird.classList.add('act');
  }
  if (currentPage === totalPages) {
    refs.btnOther.classList.add('act');
  }
}
function deactiveBtn() {
  refs.btnPrev.classList.remove('act');
  refs.btnBegin.classList.remove('act');
  refs.btnFirst.classList.remove('act');
  refs.btnSecond.classList.remove('act');
  refs.btnThird.classList.remove('act');
  if (currentPage >= totalPages) {
    refs.btnNext.classList.remove('act');
    refs.btnEnd.classList.remove('act');

    refs.btnNext.classList.add('bc');
    refs.btnEnd.classList.add('bc');
  }
  if (currentPage !== totalPages) {
    refs.btnOther.classList.remove('act');
  }
}

run();
