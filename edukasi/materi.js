/* Gozali Corp Technology — tombol produk di halaman materi.
   Tombol [data-product="Nama Produk"] otomatis memakai checkout_url dari products.json.
   Kalau link checkout belum diisi, tombol diarahkan ke bagian Produk Digital di beranda. */
(function(){
  function safeCheckout(u){ var t=String(u==null?'':u).trim(); return /^https:\/\/[^\s"'<>]+$/i.test(t) ? t : ''; }
  function fmtRp(v){ var t=String(v==null?'':v).trim(); return /^\d+$/.test(t) ? 'Rp ' + (+t).toLocaleString('id-ID') : t; }
  function norm(s){ return String(s||'').trim().toLowerCase(); }

  function getProducts(){
    try{ var ls=localStorage.getItem('gct_products'); if(ls){ var a=JSON.parse(ls); if(Array.isArray(a)&&a.length) return Promise.resolve(a); } }catch(e){}
    return fetch('../products.json',{cache:'no-store'})
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(d){ return Array.isArray(d) ? d : (d.products||[]); })
      .catch(function(){ return []; });
  }

  getProducts().then(function(list){
    document.querySelectorAll('[data-product]').forEach(function(btn){
      var p=list.find(function(x){ return norm(x.nama)===norm(btn.dataset.product); });
      if(!p) return;
      var url=safeCheckout(p.checkout_url||p.checkout);
      if(url){ btn.href=url; btn.target='_blank'; btn.rel='noopener'; }
      var priceEl=btn.closest('.cta') && btn.closest('.cta').querySelector('[data-price]');
      if(priceEl && p.harga){ priceEl.textContent=fmtRp(p.harga); }
    });
  });

  // nomor WhatsApp mengikuti pembayaran.json (sama seperti beranda)
  fetch('../pembayaran.json',{cache:'no-store'}).then(function(r){ return r.ok ? r.json() : null; }).then(function(d){
    if(d && d.wa){ document.querySelectorAll('a[href*="wa.me/"]').forEach(function(a){ a.href=a.href.replace(/wa\.me\/\d+/,'wa.me/'+d.wa); }); }
  }).catch(function(){});
})();
