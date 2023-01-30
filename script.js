'use strict';

class MobileNav {
  _parentEl = document.querySelector('.header');
  _nav = document.querySelector('.nav');

  constructor() {
    this._parentEl.addEventListener('click', this._openMenu.bind(this));
    this._nav.addEventListener('click', this._closeMobileMenu.bind(this));
  }

  _openMenu(e) {
    const target = e.target.closest('.mobile-navbtn');

    if (!target) return;

    this._nav.classList.toggle('nav-open');
  }

  _closeMobileMenu(e) {
    const target = e.target.closest('.nav-link');

    if (!target) return;

    this._nav.classList.remove('nav-open');
  }
}

class Gallery {
  _mainGallery = document.querySelector('.main-gallery');
  _lightboxGallery = document.querySelector('.lightbox-gallery');
  _gallery = document.querySelectorAll('.gallery');
  _lightbox = document.querySelector('.lightbox-bg');
  _sliderEl = document.querySelector('.slider');
  _slides = document.querySelectorAll('.slide');
  _btnClose = document.querySelector('.btn-close');
  _imgActive = document.querySelector('.img-active');
  _btnLightbox = document.querySelector('.btn-lightbox--container');
  _btnNext = document.querySelector('.btn-next');
  _btnPrev = document.querySelector('.btn-prev');

  _curSlide = 0;
  _maxSlide = this._slides.length;

  constructor() {
    this._mainGallery.addEventListener('click', this._openModal.bind(this));
    this._mainGallery.addEventListener('mouseover', this._hover.bind(this));
    this._gallery.forEach((g) =>
      g.addEventListener('click', this._goToSlide.bind(this))
    );

    this._lightbox.addEventListener('click', this._closeModal.bind(this));
    this._btnLightbox.addEventListener(
      'click',
      this._lightboxBtnController.bind(this)
    );

    this._slider();
  }

  _openModal(e) {
    if (!e.target.src) return;

    this._lightbox.style.display = 'grid';
  }

  _closeModal(e) {
    const target =
      e.target.closest('.btn-close') || !e.target.closest('.lightbox');

    if (!target) return;

    this._lightbox.style.display = 'none';
  }

  _hover(e) {
    if (!e.target.classList.contains('gallery-img')) return;

    this._imgActive.src = e.target.dataset.src;
    this._imgActive.dataset.src = e.target.dataset.src;
  }

  _slider(s = this._curSlide) {
    this._slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${200 * (i - s)}%)`;
    });
  }

  _goToSlide(e) {
    if (!e.target.src) return;

    this._curSlide = e.target.dataset.src?.at(-5) - 1;
    this._slider(this._curSlide);
  }

  _nextSlide() {
    if (this._curSlide === this._maxSlide - 1) {
      this._curSlide = 0;
    } else {
      this._curSlide++;
    }

    this._slider(this._curSlide);
  }

  _prevSlide() {
    if (this._curSlide > 0) {
      this._curSlide--;
    } else {
      this._curSlide = this._maxSlide - 1;
    }

    this._slider(this._curSlide);
  }

  _lightboxBtnController(e) {
    if (e.target.closest('.btn-next')) this._nextSlide();

    if (e.target.closest('.btn-prev')) this._prevSlide();
  }
}

class ShoppingCart extends Gallery {
  _productOverlay = document.querySelector('.product--button-box');
  _quantityText = document.querySelector('.quantity-text');

  _headerMiscBox = document.querySelector('.header-misc--box');
  _cart = document.querySelector('.cart');
  _cartDropdown = document.querySelector('.cart-dropdown');
  _cartItemsContainer = document.querySelector('.cart-items--container');

  _productName = document.querySelector('.product-title');
  _productPrice = document.querySelector('.price');

  _item = [];

  constructor() {
    super();

    this._productOverlay.addEventListener(
      'click',
      this._productController.bind(this)
    );

    this._headerMiscBox.addEventListener('mouseover', this._hover.bind(this));

    this._cartDropdown.addEventListener(
      'mouseleave',
      this._hoverOut.bind(this)
    );

    this._cartItemsContainer.addEventListener(
      'click',
      this._productController.bind(this)
    );

    this._getLocal();
  }

  _hover(e) {
    const target = e.target.closest('.cart');

    if (!target) return;

    this._cartDropdown.style.display = 'grid';
  }

  _hoverOut() {
    this._cartDropdown.style.display = 'none';
  }

  _productController(e) {
    if (e.target.closest('.btn--addtocart')) this._addToCart();

    if (e.target.closest('.btn--minus')) this._editRemoveQuantity();

    if (e.target.closest('.btn--plus')) this._editAddQuantity();

    if (e.target.closest('.cart-delete--btn')) this._removeItem(e);

    return;
  }

  _addToCart(i = 0) {
    if (!+this._quantityText.textContent) return;

    this._createProductObj();

    const index = this._item.length ? this._item.indexOf(this._item.at(-1)) : 0;
    i = index;

    this._clearQuantity();

    this._renderCart(i);

    this._setLocal();
  }

  _editAddQuantity() {
    +this._quantityText.textContent++;
  }

  _editRemoveQuantity() {
    if (!+this._quantityText.textContent) return;

    +this._quantityText.textContent--;
  }

  _removeItem(e) {
    const items = Array.from(this._cartItemsContainer.children);
    const index = items.indexOf(e.target.closest('.cart-items--box'));

    this._cartItemsContainer.children[index].remove();
    this._item.splice(index, 1);

    this._setLocal();

    if (!this._item.length) this._renderMsg();
  }

  _createProductObj() {
    this._item.push({
      name: this._productName.textContent,
      img: this._imgActive.dataset.src,
      price: this._productPrice.textContent,
      quantity: this._quantityText.textContent,
      totalPrice: `${(
        +this._productPrice.textContent.slice(1) *
        +this._quantityText.textContent
      ).toFixed(2)}`,
    });
  }

  _clearQuantity() {
    this._quantityText.textContent = '0';

    if (this._item.length === 1) this._cartItemsContainer.innerHTML = '';
  }

  _renderMsg() {
    this._cartItemsContainer.innerHTML =
      '<p class="cart-message">Cart is currently empty! 📦</p>';
  }

  _renderCart(i = 0) {
    const html = `
          <div class="cart-items--box">
            <div class="cart-img">
              <img src="${this._item[i].img}" alt="Your choice of product" class="cart-item" />
            </div>

            <div class="cart-text"> 
              <p>${this._item[i].name}</p>
              <p>${this._item[i].price}$ x ${this._item[i].quantity}  <span>${this._item[i].totalPrice}</span></p>
            </div>

            <div class="cart-delete--btn">
              <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use fill="" fill-rule="nonzero" xlink:href="#a"/></svg>
            </div>
          </div>
    `;

    this._cartItemsContainer.insertAdjacentHTML('beforeend', html);
  }

  _setLocal() {
    localStorage.setItem('cart', JSON.stringify(this._item));
  }

  _getLocal() {
    const cart = localStorage.getItem('cart');
    this._item = JSON.parse(cart) || [];

    if (!this._item.length) return;

    this._cartItemsContainer.children[0].remove();

    this._item.forEach((_, i) => {
      this._renderCart(i);
    });
  }

  clearStorage() {
    localStorage.clear();
  }
}

new MobileNav();
new Gallery();
new ShoppingCart();
