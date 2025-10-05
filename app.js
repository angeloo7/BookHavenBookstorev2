
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);

  const CART_KEY = 'cartItems';
  const NEWSLETTER_KEY = 'newsletterSubscribers';
  const FEEDBACK_KEY = 'feedbackSubmissions';

  function load(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch(e){ return fallback; } }
  function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

  const catalog = [
  {
    "id": "bh-001",
    "title": "Brie Mine 4Ever",
    "desc": "Witty culinary romance.",
    "price": 14.99,
    "img": "assets/Client3_Book1.png",
    "category": "Books"
  },
  {
    "id": "bh-002",
    "title": "Glory Riders",
    "desc": "Epic sports underdog tale.",
    "price": 16.5,
    "img": "assets/Client3_Book2.png",
    "category": "Books"
  },
  {
    "id": "bh-003",
    "title": "Sorcerer's Shadowed Chronicles",
    "desc": "Dark fantasy adventure.",
    "price": 18.25,
    "img": "assets/Client3_Book3.png",
    "category": "Books"
  },
  {
    "id": "bh-004",
    "title": "BALL Magazine",
    "desc": "Pickleball issue \u2014 gear & drills.",
    "price": 7.99,
    "img": "assets/Client3_Magazine1.png",
    "category": "Magazines"
  },
  {
    "id": "bh-005",
    "title": "TRAVEL Magazine",
    "desc": "Top 10 places to visit this year.",
    "price": 8.99,
    "img": "assets/Client3_Magazine2.png",
    "category": "Magazines"
  },
  {
    "id": "bh-006",
    "title": "EAT Magazine",
    "desc": "The breakfast issue.",
    "price": 9.49,
    "img": "assets/Client3_Magazine3.png",
    "category": "Magazines"
  },
  {
    "id": "bh-007",
    "title": "Book Haven Notebook",
    "desc": "Lined pages, soft-touch cover.",
    "price": 4.99,
    "img": "assets/Client3_Notebook.png",
    "category": "Accessories"
  },
  {
    "id": "bh-008",
    "title": "Sticker Pack",
    "desc": "Read Local, smiley, and emblems.",
    "price": 3.99,
    "img": "assets/Client3_Stickers.png",
    "category": "Accessories"
  },
  {
    "id": "bh-009",
    "title": "Canvas Tote",
    "desc": "All I Do Is Read \u2014 eco cotton.",
    "price": 12.99,
    "img": "assets/Client3_ToteBag.png",
    "category": "Accessories"
  }
];

  function renderGallery(){
    const tbody = $('#galleryTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    catalog.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="width:160px"><img src="${item.img}" alt="${item.title}"/></td>
        <td><strong>${item.title}</strong><br/><small>${item.desc}</small></td>
        <td>$${item.price.toFixed(2)}</td>
        <td><button class="btn" data-add="${item.id}">Add to Cart</button></td>
      `;
      tbody.appendChild(tr);
    });
    tbody.addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-add]');
      if(!btn) return;
      const id = btn.getAttribute('data-add');
      const item = catalog.find(i=>i.id===id);
      addToCart(item);
    });
  }

  function addToCart(item){
    const cart = load(CART_KEY, []);
    const existing = cart.find(c => c.id === item.id);
    if(existing){ existing.qty += 1; } else { cart.push({id:item.id, title:item.title, price:item.price, qty:1}); }
    save(CART_KEY, cart);
    alert('Item added.');
    renderCart();
  }

  function renderCart(){
    const container = document.querySelector('#cartContents');
    if(!container) return;
    const cart = load(CART_KEY, []);
    if(cart.length === 0){ container.innerHTML = `<p>Your cart is empty.</p>`; return; }
    const rows = cart.map(item => `
      <div style="display:flex;justify-content:space-between;gap:1rem;padding:.4rem 0;border-bottom:1px dashed #e5e7eb">
        <div><strong>${item.title}</strong><br/><small>Qty: ${item.qty}</small></div>
        <div>$${(item.price * item.qty).toFixed(2)}</div>
      </div>
    `).join('');
    const total = cart.reduce((s,i)=>s + i.price*i.qty, 0);
    container.innerHTML = rows + `<div style="text-align:right;margin-top:.5rem"><strong>Total:</strong> $${total.toFixed(2)}</div>`;
  }

  function openCart(){
    renderCart();
    document.querySelector('#cartBackdrop')?.classList.add('show');
    document.querySelector('#cartModal')?.focus();
  }
  function closeCart(){
    document.querySelector('#cartBackdrop')?.classList.remove('show');
  }

  function wireCartButtons(){
    document.querySelector('#btnViewCartTop')?.addEventListener('click', openCart);
    document.querySelector('#btnViewCart')?.addEventListener('click', openCart);
    document.querySelector('#btnCloseCart')?.addEventListener('click', closeCart);
    document.querySelector('#cartBackdrop')?.addEventListener('click', (e)=>{ if(e.target.id === 'cartBackdrop') closeCart(); });
    document.querySelector('#btnClearCart')?.addEventListener('click', ()=>{ save(CART_KEY, []); renderCart(); });
    document.querySelector('#btnProcessOrder')?.addEventListener('click', ()=>{ alert('Thank you for your order.'); save(CART_KEY, []); renderCart(); });
  }

  function wireNewsletter(){
    const form = document.querySelector('#newsletterForm');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.querySelector('#newsletterEmail')?.value.trim();
      if(!email) return;
      const list = load(NEWSLETTER_KEY, []); list.push({email, ts: Date.now()}); save(NEWSLETTER_KEY, list);
      alert('Subscribed!'); form.reset();
    });
  }

  function wireFeedbackForm(){
    const form = document.querySelector('#feedbackForm');
    const notice = document.querySelector('#feedbackNotice');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const record = {
        name: document.querySelector('#name')?.value.trim(),
        email: document.querySelector('#email')?.value.trim(),
        type: document.querySelector('#type')?.value,
        message: document.querySelector('#message')?.value.trim(),
        ts: Date.now()
      };
      const items = load(FEEDBACK_KEY, []); items.push(record); save(FEEDBACK_KEY, items);
      form.reset(); if(notice) notice.textContent = 'Thanks! Your submission was saved locally (web storage demo).';
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    renderGallery(); wireCartButtons(); wireNewsletter(); wireFeedbackForm();
  });
})();
