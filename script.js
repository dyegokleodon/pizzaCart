let cart = [];
let modalQtd = 1;
let modalKey = 0;

const qs = (e) =>document.querySelector(e);
const qsa = (e) =>document.querySelectorAll(e);

//lista todas as pizzas
pizzaJson.map( (item, index) => {
  let pizzaItem = qs('.models .pizza-item').cloneNode(true);

  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img

  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$: ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

  //modal pizza escolhida
  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();

    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQtd = 1;
    modalKey = key;
  
    qs('.pizzaBig img').src = pizzaJson[key].img;

    qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    qs('.pizzaInfo--actualPrice').innerHTML = `R$: ${pizzaJson[key].price.toFixed(2)}`;
    qs('.pizzaInfo--size.selected').classList.remove('selected');
    //parte do tamanho da pizza
    qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if(sizeIndex === 2){
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    qs('.pizzaInfo--qt').innerHTML = modalQtd;

    qs('.pizzaWindowArea').style.opacity = 0;
    qs('.pizzaWindowArea').style.display = 'flex';

    setTimeout(() => {
      qs('.pizzaWindowArea').style.opacity = 1;
    }, 200)
  });

  //carrega div modelo das pizzas
  qs('.pizza-area').append(pizzaItem);
});

//ações do modal

function closeModal() {
  qs('.pizzaWindowArea').style.opacity = 0;

  setTimeout(() => {
    qs('.pizzaWindowArea').style.display = 'none';
  }, 500);
}

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => {
  item.addEventListener('click', closeModal);
});

// adiciona e remove quantidade da pizza
qs('.pizzaInfo--qtmais').addEventListener('click',() => {
  modalQtd++;
  qs('.pizzaInfo--qt').innerHTML = modalQtd;
});

qs('.pizzaInfo--qtmenos').addEventListener('click',() => {
  if(modalQtd > 1 ){
    modalQtd--;
    qs('.pizzaInfo--qt').innerHTML = modalQtd;
  } 
});
// selciona tamanho da pizza
qsa('.pizzaInfo--size').forEach((size) => {
  size.addEventListener('click', (e) => {
    qs('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  })
});

//adicionar pedido no carrinho

qs('.pizzaInfo--addButton').addEventListener('click',() => {
  let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

  let identifier = `${pizzaJson[modalKey].id}@${size}`  
  
  let key = cart.findIndex((item) => {
    return item.identifier === identifier;
  })

  if(key > -1){
    cart[key].qtd += modalQtd;
  }else
  {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qtd: modalQtd,
    });
  }
  updateCart();
  closeModal();
});

//botão carrinho mobile para
qs('.menu-openner').addEventListener('click', () => {
  if(cart.length > 0){
    qs('aside').style.left = '0';
  }
})

qs('.menu-closer').addEventListener('click', () => {
  qs('aside').style.left = '100vw';
})

//atualizar e mostrar carrinho 
function updateCart() {

  qs('.menu-openner span').innerHTML = cart.length;

  if(cart.length > 0){
    qs('aside').classList.add('show');
    qs('.cart').innerHTML = '';
    
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for(let i in cart){
      let pizzaItem = pizzaJson.find((item) =>{
        return item.id === cart[i].id;
      });

      subtotal += pizzaItem.price * cart[i].qtd;

      let cartItem = qs('.models .cart--item').cloneNode(true);
      let pizzaSizeName;
      switch(cart[i].size){
        case 0:
            pizzaSizeName = 'P'
            break;
        case 1:
            pizzaSizeName = 'M'
            break;
         case 2:
            pizzaSizeName = 'G'
            break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
        cart[i].qtd++;
        updateCart();
        //cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
      });

      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{   
        if(cart[i].qtd > 1){
          cart[i].qtd--;  
        }else{
          cart.splice(i, 1);
        }
        updateCart();
      });


      qs('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    qs('.subtotal span:last-child').innerHTML = `R$: ${subtotal.toFixed(2)}`
    qs('.desconto span:last-child').innerHTML = `R$: ${desconto.toFixed(2)}`
    qs('.total span:last-child').innerHTML = `R$: ${total.toFixed(2)}`

  }else{
    qs('aside').classList.remove('show');
    qs('aside').style.left = '100vw';
  }
}