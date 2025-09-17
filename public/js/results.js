// results.html 用
(async () => {
    const params = new URLSearchParams(location.search);
    const lat = params.get('lat');
     const lng = params.get('lng');
    const range = params.get('range') || '3';
    const genre = params.get('genre') || '';
    const keyword = params.get('keyword') || '';
    const budget = params.get('budget') || '';
    const count = params.get('count') || '30';

    const infoEl = document.getElementById('info');
    const area = document.getElementById('resultArea');
    const anotherBtn = document.getElementById('another');

  infoEl.textContent = '検索中...';

  try {
    const query = new URLSearchParams({ range, genre, count, keyword, budget });
    if (lat && lng) { query.set('lat', lat); query.set('lng', lng); }

    const res = await fetch(`/api/search?${query.toString()}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'API error');

    const shops = json.shops || [];
    if (shops.length === 0) {
      infoEl.textContent = '該当する店舗が見つかりませんでした。';
      return;
    }

    infoEl.textContent = '';
    //infoEl.textContent = `全 ${shops.length} 件からランダムに1件を表示します。`;

    function renderShop(shop) {
      area.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'card';

      const name = shop.name || '店名不明';
      const address = shop.address || '';
      const url = shop.urls && shop.urls.pc ? shop.urls.pc : '';
      const lat = shop.lat;
      const lng = shop.lng;

      div.innerHTML = `
      <div class="inner">
        <h2 class="head">ここに行こ！</h2>
        <p class="name">${name}</１>
        <p class="address">${address}</p>
        <!-- <p>ジャンル: ${shop.genre?.name || '不明'}</p> -->
        <!-- <p>予算: ${shop.budget?.name || '不明'}</p> -->
        <p class="open">営業時間: ${shop.open || '不明'}</p> 
        <!-- <p>おすすめ: ${shop.catch || ''}</p> -->
        <!-- <p><a href="${url}" target="_blank">店舗ページ（Hot Pepper）</a></p> -->
      </div>
      `;

      if (lat && lng) {
        const mapA = document.createElement('a');
        mapA.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        mapA.target = '_blank';
        mapA.textContent = '地図で見る';
        div.appendChild(mapA);
      }

      area.appendChild(div);
    }

    function showRandom() {
      const idx = Math.floor(Math.random() * shops.length);
      renderShop(shops[idx]);
    }

    showRandom();
    anotherBtn.style.display = 'inline-block';
    anotherBtn.onclick = () => showRandom();

  } catch (err) {
    console.error(err);
    infoEl.textContent = 'エラーが発生しました: ' + (err.message || err);
  }
})();