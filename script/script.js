document.addEventListener('DOMContentLoaded', () => {

    //Settings
    const DbPath = 'db/db.json';

    //Collect elements for work
    const
        elSearchField = document.querySelector('#searchGoods'),
        elBasketTotal = document.querySelector('.cart-total'),
        elBasketButton = document.querySelector('#cart'),
        elBasketButtonCounter = elBasketButton.querySelector('.counter'),
        elWishlistButton = document.querySelector('#wishlist'),
        elWishlistCounter = elWishlistButton.querySelector('.counter');
    const
        elGoodsWrapper = document.querySelector('.goods-wrapper'),
        elBasketWrapper = document.querySelector('.cart'),
        elCartWrapper = elBasketWrapper.querySelector('.cart-wrapper');

    //Object with customer data
    const customerStorage = {
        wishlist: [],
        basket: {},
        total: 0,

        readStorage: function (keyName) {
            if (localStorage.getItem(keyName) !== null) {
                JSON.parse(localStorage.getItem(keyName)).forEach(id => this.wishlist.push(id));
            }
            cookieBasket = document.cookie.replace(/(?:(?:^|.*;\s*)basket\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            if (cookieBasket) {
                this.basket = JSON.parse(cookieBasket);
            }
        },

        updateCounters: function () {
            if (this.wishlist.length > 0) {
                localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
            } else {
                localStorage.clear('wishlist');
            }
            if (Object.keys(this.basket).length > 0) {
                cookie = JSON.stringify(this.basket);
                document.cookie = 'basket = ' + cookie;
            } else {
                document.cookie = 'basket =; expires=Mon, 07 May 1985 16:37:55 GMT; ';
            }

            if (Object.keys(this.basket).length > 0) {
            } else {
                //localStorage.clear('wishlist');
            }


            elWishlistCounter.textContent = this.wishlist.length;
            elBasketButtonCounter.textContent = Object.keys(this.basket).length;
            //elBasketTotal.textContent = this.total;

        },
        addBasket: function (id) {
            if (this.basket[id]) {
                this.basket[id] += 1;
            } else {
                this.basket[id] = 1;
            }
        },
        removeBasket: function (id) {
            if (this.basket[id]) {
                delete this.basket[id];
            }
        },
    }

    //Object output data on page
    const RenderHTML = function (area, template, filter, filterExample) {
        this.area = area;
        this.template = template;
        this.mode = filter;
        this.Select = filterExample;

        this.busy = function () {
            let template = `
                <div id="spinner">
                    <div class="spinner-loading">
                        <div>
                            <div><div></div></div>
                            <div><div></div></div>
                            <div><div></div></div>
                            <div><div></div></div>
                        </div>
                    </div>
                </div>`;
            area.innerHTML = template;
        };

        this.renderByTemplate = function (items) {
            area.textContent = '';
            let noItemsMessage = '';
            if (items.length) {
                items.forEach((item) => {
                        const {id, imgMin, price, title} = item;
                        const card = document.createElement('div');
                        let templateCode = '';
                        switch (template) {
                            case 'catalogItem':
                                card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';

                                templateCode = `
                                    <div class="card">
                                        <div class="card-img-wrapper">
                                            <img class="card-img-top" src="${imgMin}" alt="">
                                            <button class="card-add-wishlist${(customerStorage.wishlist.includes(id)) ? ' active' : ''}" data-goods-id="${id}"></button>
                                        </div>
                                        <div class="card-body justify-content-between">
                                            <a href="#" class="card-title">${title}</a>
                                            <div class="card-price">${price} ₽</div>
                                            <div>
                                                <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                                            </div>
                                        </div>
                                    </div>`;
                                noItemsMessage = `Нет товаров соответствющих заданным условиям.`;

                                break;
                            case 'basketItem':
                                elBasketTotal.innerHTML = `Общая сумма: <span>${customerStorage.total}</span> руб`;
                                card.className = 'goods';
                                templateCode = `
                                        <div class="goods-img-wrapper">
                                            <img class="goods-img" src="${imgMin}" alt="${title}">
                        
                                        </div>
                                        <div class="goods-description">
                                            <h2 class="goods-title">${title}</h2>
                                            <p class="goods-price">${price} ₽</p>
                        
                                        </div>
                                        <div class="goods-price-count">
                                            <div class="goods-trigger">
                                                <button class="goods-add-wishlist${(customerStorage.wishlist.includes(id)) ? ' active' : ''}" data-goods-id="${id}"></button>
                                                <button class="goods-delete" data-goods-id="${id}"></button>
                                            </div>
                                            <div class="goods-count">${customerStorage.basket[id]}</div>
                                        </div>`;
                                noItemsMessage = `<div id="cart-empty">Ваша корзина пока пуста</div>`;
                                break;
                        }
                        card.innerHTML = templateCode;
                        area.append(card);
                    }
                )
            } else {
                switch (template) {
                    case 'catalogItem':
                        noItemsMessage = `Нет товаров соответствющих заданным условиям.`;
                        break;
                    case 'basketItem':
                        elBasketTotal.innerHTML = `Общая сумма: <span>${customerStorage.total}</span> руб`;
                        noItemsMessage = `<div id="cart-empty">Ваша корзина пока пуста</div>`;
                        break;
                }
                area.innerHTML = noItemsMessage;
            }
        };

        this.filter = function (items) {
            switch (filter) {
                case 'category':
                    if (filterExample) {
                        items = items.filter(item => item.category.includes(filterExample));
                    }
                    break;
                case 'inWishlist':
                    items = items.filter(item => customerStorage.wishlist.includes(item.id));
                    break;
                case 'inBasket':
                    items = items.filter(item => customerStorage.basket.hasOwnProperty(item.id));
                    let total = 0;
                    items.forEach((item) => {
                        total += item.price * customerStorage.basket[item.id];
                    });
                    customerStorage.total = total;
                    break;
                case 'random':
                    items.sort(function (a, b) {
                        return 0.5 - Math.random()
                    });
                    break;
                case 'find':
                    items = items.filter(item => item.title.toLowerCase().includes(filterExample.toLowerCase()));
                    break;
                default:
                    console.log('фильтр по-умолчанию');
            }
            return items;
        };

        this.run = function () {
            this.busy();
            const render = () => {
                fetch(DbPath)
                    .then(response => response.json())
                    .then(this.filter)
                    .then(this.renderByTemplate);
            };
            setTimeout(render, 500);
        };
    };

    const clickHandler = (clickEvent) => {
        //вывод товаров из категрии
        if (clickEvent.target.classList.contains('category-item')) {
            const choise = clickEvent.target.dataset.category;
            new RenderHTML(elGoodsWrapper, 'catalogItem', 'category', choise).run();
        }
        //обновить содержимое wishlist и состояние индикатора карточки товара
        if (clickEvent.target.classList.contains('card-add-wishlist') || clickEvent.target.classList.contains('goods-add-wishlist')) {
            id = clickEvent.target.dataset.goodsId;
            if (customerStorage.wishlist.includes(id)) {
                customerStorage.wishlist.splice(customerStorage.wishlist.indexOf(id), 1);
                clickEvent.target.classList.remove('active');
            } else {
                customerStorage.wishlist.push(id);
                clickEvent.target.classList.add('active');
            }
            customerStorage.updateCounters();
        }
        //добавить товар в корзину
        if (clickEvent.target.classList.contains('card-add-cart')) {
            customerStorage.addBasket(clickEvent.target.dataset.goodsId);
            customerStorage.updateCounters();
        }
        //вывести товары присутствующие в wishlist
        if (clickEvent.target.id === 'wishlist') {
            new RenderHTML(elGoodsWrapper, 'catalogItem', 'inWishlist').run();
        }
        //отобразить корзину
        if (clickEvent.target.id === 'cart') {
            elBasketWrapper.style.display = 'flex';
            new RenderHTML(elCartWrapper, 'basketItem', 'inBasket').run();
            customerStorage.updateCounters();
        }
        //скрыть корзину
        if (clickEvent.target.classList.contains('cart-close') || clickEvent.target.classList.contains('cart')) {
            elBasketWrapper.style.display = '';
        }
        //убрать товар из корзины
        if (clickEvent.target.classList.contains('goods-delete')) {
            customerStorage.removeBasket(clickEvent.target.dataset.goodsId);
            customerStorage.updateCounters();
            new RenderHTML(elCartWrapper, 'basketItem', 'inBasket').run();
        }
        //вывести товары с искомой строкой в описании
        if (clickEvent.target.id === 'search-btn') {
            clickEvent.preventDefault();
            new RenderHTML(elGoodsWrapper, 'catalogItem', 'find', elSearchField.value).run();
            elSearchField.value = '';
        }

    };
    document.addEventListener('click', clickHandler);

    customerStorage.readStorage('wishlist');
    customerStorage.updateCounters();
    new RenderHTML(elGoodsWrapper, 'catalogItem', 'random').run();

});