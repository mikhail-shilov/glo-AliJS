document.addEventListener('DOMContentLoaded', () => {
    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const cardCounter = cartBtn.querySelector('.counter');
    const wishlistCounter = wishlistBtn.querySelector('.counter');
    console.log(wishlistCounter);

    let wishlist = [];
    let goodsBasket = {};

 //   console.log(fetch('db/db.json'));
/*    fetch('db/db.json')
        .then((response) => {
        return response.json();
        })
        .then((goods) => {
            console.log(goods);
        })
*/


    const createCardGoods = (id, title, price, img) => {

        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `
        <div class="card">
            <div class="card-img-wrapper">
                <img class="card-img-top" src="${img}" alt="">
                <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
                data-goods-id="${id}"></button>
            </div>
            <div class="card-body justify-content-between">
                <a href="#" class="card-title">${title}</a>
                <div class="card-price">${price} ₽</div>
                <div>
                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                </div>
            </div>
        </div>`;
        return card;
    }

    const openCart = () => {
        cart.style.display = 'flex';
    };
    const closeCart = (event) => {
        const target = event.target;
        if (target === cart || target.classList.contains('cart-close') || event.code == 'Escape') {
            cart.style.display = '';
        };
    };

    const renderCard = (items) => {
        goodsWrapper.textContent='';
        if(items.length) {
            items.forEach((item) => {
                //const {id, title,price,imgMin} = item; деструкция - разобраться позже
                goodsWrapper.append(createCardGoods(item.id, item.title, item.price, item.imgMin));
            })
        }
        else {
            goodsWrapper.textContent = 'Извините - ничего не найдено. Увы. Нам жаль. Правда(нет).';
        }
    }

    //отображение товаров в корзине

    const createCartGoods = (id, title, price, img) => {

        const card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = `
            <div class="goods-img-wrapper">
                <img class="goods-img" src="${img}" alt="">

            </div>
            <div class="goods-description">
                <h2 class="goods-title">${title}</h2>
                <p class="goods-price">${price}</p>

            </div>
            <div class="goods-price-count">
                <div class="goods-trigger">
                    <button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
                        data-goods-id="${id}"></button>
                    <button class="goods-delete" data-goods-id="${id}"></button>
                </div>
                <div class="goods-count">1</div>
            </div>`;
        return card;
    }



    const renderCart = (items) => {
        cartWrapper.textContent='';
        if(items.length) {
            items.forEach((item) => {
                //const {id, title,price,imgMin} = item; деструкция - разобраться позже
                cartWrapper.append(createCartGoods(item.id, item.title, item.price, item.imgMin));
            })
        }
        else {
            cartWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div>';
        }
    }


    const getGoods = (handler, filter) => {
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };

    const randomSort = (item) => {
        //return item.reverse();
        return item;
    };

    const searchGoods = event => {
        event.preventDefault();
        const input = event.target.elements.searchGoods;
        const inputContain = input.value.trim();
        if (inputContain.toLowerCase() !== "") {
            getGoods(renderCard, goods => goods.filter(item => item.title.toLowerCase().includes(inputContain.toLowerCase())));
            console.log(inputContain.toLowerCase());
            console.log(item.title.toLowerCase());
        }
    }

    const checkCount = () => {
        wishlistCounter.textContent = wishlist.length;
        cardCounter.textContent = Object.keys(goodsBasket).length;
    }

    const storageQuery = (get) => {
        if (get) {
            if (localStorage.getItem('wishlist')) {
                const wishlistStorage = JSON.parse(localStorage.getItem('wishlist'));
                console.log(wishlistStorage);
                wishlistStorage.forEach(id => wishlist.push(id));
            }
            //wishlist = localStorage.getItem(wishlist);
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
        checkCount();
    }

    const toggleWishList = (id, elem) => {
        if (wishlist.includes(id)) {
            wishlist.splice(wishlist.indexOf(id),1);
            elem.classList.remove('active');
        } else{
            wishlist.push(id);
            elem.classList.add('active');
        }
        console.log(wishlist);
        checkCount();
        storageQuery();
    };

    const addBasket = id => {
        if (goodsBasket[id]) {
            goodsBasket[id] += 1;
        } else {
            goodsBasket[id] = 1;
        }
        checkCount();
    };

    const handlerGoods = event => {
        const target = event.target;
        if (target.classList.contains('card-add-wishlist')) {
            //console.log(target.dataset.goodsId);
            toggleWishList(target.dataset.goodsId, target);
        };
        if (target.classList.contains('card-add-cart')) {
            addBasket(target.dataset.goodsId);
        }
    };

    const showWishlist = () => {
        getGoods(renderCard, goods => goods.filter(item => wishlist.includes(item.id)))
    };



    cartBtn.addEventListener('mouseup', openCart);
    cart.addEventListener('mouseup', closeCart);
    document.addEventListener('keyup', closeCart);
    
    //Домашнее задание 1 
    document.addEventListener('keyup', closeCart);
     /*   document.addEventListener('click', (event) => {
            //console.log(event);
            if (event.srcElement.href != undefined) {event.preventDefault();}
        });*/
    document.addEventListener('auxclick', (event) => {
        console.log(event);
        if (event.srcElement.href != undefined) {event.preventDefault();}
    });

    search.addEventListener('submit', searchGoods);
    wishlistBtn.addEventListener("click", showWishlist);


    const choiseCategory = () => {
        event.preventDefault();
        const target = event.target;
        if(target.classList.contains('category-item')) {
            const choisedCategory=target.dataset.category;
            getGoods(renderCard, goods => goods.filter(item => item.category.includes(choisedCategory)));
            console.log(choisedCategory);
        }
    };

    category.addEventListener('click', choiseCategory);
    goodsWrapper.addEventListener('click', handlerGoods);
    


    getGoods(renderCard, randomSort);

    storageQuery(true);

});