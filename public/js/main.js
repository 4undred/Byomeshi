// index.html 用
const status = document.getElementById('locStatus');
const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');
const useBtn = document.getElementById('useLocation');

document.addEventListener('DOMContentLoaded', () => {
  const latInput = document.getElementById('lat');
  const lngInput = document.getElementById('lng');
  const status = document.getElementById('locStatus');

  if (navigator.geolocation && latInput && lngInput) {
    //status.textContent = '位置情報を自動取得中...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        latInput.value = latitude;
        lngInput.value = longitude;
        //status.textContent = `取得済: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      },
      (err) => {
        status.textContent = '位置情報取得失敗: ' + err.message;
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }
});

useBtn.addEventListener('click', () => {
  //status.textContent = '位置情報を取得中...';
  if (!navigator.geolocation) {
    status.textContent = 'このブラウザは位置情報に対応していません';
    return;
  }
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    latInput.value = latitude;
    lngInput.value = longitude;
    //status.textContent = `取得済: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }, (err) => {
    status.textContent = '位置情報取得失敗: ' + err.message;
  }, { enableHighAccuracy: false, timeout: 10000 });
});

document.getElementById('searchForm').addEventListener('submit', function() {
  updateSelected();
});

/*document.addEventListener('DOMContentLoaded', () => {
  const genreSelect = document.getElementById('genre');
  if (!genreSelect) return;

  fetch('/api/genres')
    .then(res => res.json())
    .then(data => {
      data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.code;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error('ジャンル取得失敗:', err);
    });

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      let countInput = document.getElementById('count');
      if (!countInput) {
        countInput = document.createElement('input');
        countInput.type = 'hidden';
        countInput.name = 'count';
        countInput.id = 'count';
        searchForm.appendChild(countInput);
      }
      countInput.value = 50;
    });
  }

  const budgetSelect = document.getElementById('budget');
  if (budgetSelect) {
    fetch('/api/budgets')
      .then(res => res.json())
      .then(data => {
        // budgetSelect.innerHTML = '<option value="">選択しない</option>';
        // data.budgets.forEach(budget => {
        //   const option = document.createElement('option');
        //   option.value = budget.code;
        //   option.textContent = budget.name;
        //   budgetSelect.appendChild(option);
        // });
      })
      .catch(err => {
        console.error('予算取得失敗:', err);
      });
  }
});*/


// swiper
const mySwiper01 = new Swiper('.swiper01', {
  loop: false,
  spaceBetween: 12,
  centeredSlides: true,
  navigation: {
    nextEl: '.swiper-button-next01',
    prevEl: '.swiper-button-prev01',
  },
});

const mySwiper02 = new Swiper('.swiper02', {
  loop: false,
  spaceBetween: 12,
  centeredSlides: true,
  navigation: {
    nextEl: '.swiper-button-next02',
    prevEl: '.swiper-button-prev02',
  },
});


function updateGenre() {
  // 表示用
  let selectedTextGenre = $(".genre-input:checked + .genre-label").text();
  $("#genre").text(selectedTextGenre);
}

function updateBudget() {
  // スライダーのインデックスからHotPepper予算コード
  const budgetCodes = ["B001", "B002", "B009", "B010"];
  const activeIndex = mySwiper01.activeIndex || 0;
  $("#budget-hidden").val(budgetCodes[activeIndex]);
  // 表示用
  let selectedText = document.querySelector(".swiper01 .swiper-slide-active .budget-input").textContent;
  $("#budget").text(selectedText);
}

function updateRange() {
  // スライダーのインデックスからHotPepper range値
  const rangeValues = [1, 2, 3, 4];
  const activeIndex = mySwiper02.activeIndex || 0;
  $("#range-hidden").val(rangeValues[activeIndex]);
  // 表示用
  let selectedText = document.querySelector(".swiper02 .swiper-slide-active .distance-input").textContent;
  $("#range").text(selectedText);
}

// 初期表示
updateGenre();
updateBudget();
updateRange();

// イベント登録
$(".genre-input").on("change", updateGenre);
mySwiper01.on('slideChangeTransitionEnd', updateBudget);
mySwiper02.on('slideChangeTransitionEnd', updateRange);

// フォーム送信時にもhidden値を再セット
document.getElementById('searchForm').addEventListener('submit', function() {
  updateGenre();
  updateBudget();
  updateRange();
});
