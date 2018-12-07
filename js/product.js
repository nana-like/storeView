const itemContainer = document.querySelector(".item-container");
const filterContainer = document.querySelector(".filter-container");
const filterButton = document.querySelectorAll(".filter-button");
let products = [];

const makeItemList = (value, index) => {
  const item = `
    <div class="item">
      <div class="item-top">
        <div class="item-image">
          <img src="../images/${value.category}/${value.img}.png" />
        </div>
        <div class="item-name">${value.name}</div>
        <div class="item-price">${value.price} Gold</div>
      </div>
      <div class="item-bottom">
        <div class="item-quantity">
         <div class="item-quantity-buttons">
            <button class="item-quantity-up">▲</button>
            <button class="item-quantity-down">▼</button>
          </div>
          <input type="text" id="item-quantity-${value.name}" name="item-quantity-${value.name}" class="item-quantity-input" placeholder="0"/>
        </div>
        
        <button class="button-purchase">Add Item</button>
      </div>
    </div>
  `;
  itemContainer.innerHTML += item;
};


{
  /* <div class="item-quantity">
  <button class="item-quantity-up">◀︎</button>
  <input type="text" id="item-quantity-input" name="item-quantity-input" class="item-quantity-input"/>
  <button class="item-quantity-down">▶</button>
  </div> */
}

// 이름 오름차로 정렬
const sortByNameAsc = array => {
  array.sort(function (a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
  });
  itemContainer.innerHTML = "";
  array.forEach(makeItemList);
};

// 이름 내림차로 정렬
const sortByNameDesc = array => {
  array.sort(function (a, b) {
    if (a.name > b.name) {
      return -1;
    }
    if (a.name < b.name) {
      return 1;
    }
  });
  itemContainer.innerHTML = "";
  array.forEach(makeItemList);
};

// 가격 오름차로 정렬
const sortByPriceAsc = array => {
  array.sort(function (a, b) {
    return a.price - b.price;
  });
  itemContainer.innerHTML = "";
  array.forEach(makeItemList);
};

// 가격 내림차로 정렬
const sortByPriceDesc = array => {
  array.sort(function (a, b) {
    return b.price - a.price;
  });
  itemContainer.innerHTML = "";
  array.forEach(makeItemList);
};

const makeAllProductsArray = (result) => {

  const keyNames = Object.keys(result);
  let productsAll = [];

  // data길이만큼 반복문을 돌려서, 배열 내에 배열을 넣습니다
  for (let i = 0; i < keyNames.length; i++) {
    let category = keyNames[i];
    let categoryResult = result[`${category}`];
    productsAll.push(categoryResult);
  }

  products = []; //배열 초기화

  // productsAll 내 내용을 새로운 배열에다 합칩니다
  for (let i = 0; i < keyNames.length; i++) {
    products = products.concat(productsAll[i]);
  }

  // 최종적으로 모든 아이템이 들어가 있는 products를 화면에 뿌립니다
  products.forEach(makeItemList);

}


// ---------
// 이하 코드는 모두 함수로 묶고
// ajax 이후에 실행되도록 처리
// (필터버튼 눌렀을 때도 발생해야 함)
// ---------

const commonFunc = () => {

  const QuantityButtons = document.querySelectorAll(".item-quantity-buttons");
  const QuantityInput = document.querySelectorAll(".item-quantity-input");

  console.log(QuantityInput.length);
  // QuantityInput.value = 1;
  for (let i = 0; i < QuantityInput.length; i++) {
    QuantityInput[i].value = 1;
  }
  for (let i = 0; i < QuantityButtons.length; i++) {
    QuantityButtons[i].addEventListener('click', function (e) {
      const input = this.parentElement.querySelector(".item-quantity-input");
      console.log(input);

      if (e.target.className === 'item-quantity-up') {
        if (input.value >= 99) {
          return false;
        } else {
          input.value++;
        }
      }
      if (e.target.className === 'item-quantity-down') {
        if (input.value <= 1) {
          return false;
        } else {
          input.value--;
        }
      }
    });

  }



  // 아래 정규식 체크는 인풋에 입력 중일때만 작동하게
  // const regex = /[^0-9]/g;
  // if (!regex.test(QuantityInput.value)) {
  //   console.log("숫자아님");
  //   QuantityInput.value.replace(/[^0-9]/gi);
  // }

}

const categoryMenu = document.querySelector(".category-menu");
const categoryMenuItem = categoryMenu.children;
const categoryPageChange = (elem, menuIndex) => {
  elem[menuIndex].addEventListener("click", function (e) {
    if (e.target.classList.contains("active")) {
      return false;
    }

    for (var i = 0; i < filterButton.length; i++) {
      filterButton[i].classList.remove("active");
    }
    filterButton[0].classList.add("active");

    for (var i = 0; i < categoryMenuItem.length; i++) {
      categoryMenuItem[i].classList.remove("active");
    }
    e.target.classList.add("active");

    $.ajax({
      type: "GET",
      url: "../data/products.json",
      success: function (result) {
        if (result) {
          const keyNames = Object.keys(result);
          if (menuIndex < 1) {
            itemContainer.innerHTML = ""; //다른 메뉴에 있다가 all을 눌렀을 때 모두 지우고 다시 뿌려줌
            makeAllProductsArray(result);
          } else {
            let category = "";
            category = keyNames[menuIndex - 1];
            products = result[`${category}`];
            sortByNameAsc(products);
          }
          commonFunc();
        }
      }
    });
  });
};



for (let i = 0; i < categoryMenuItem.length; i++) {
  categoryPageChange(categoryMenuItem, i);
}

// 최초 아이템 로드
$.ajax({
  type: "GET",
  url: "../data/products.json",
  success: function (result) {
    if (result) {
      makeAllProductsArray(result);
    }

    commonFunc();




  }
});

filterContainer.addEventListener("click", function (e) {
  const data = e.target.dataset.filter;

  if (data) {
    for (var i = 0; i < filterButton.length; i++) {
      filterButton[i].classList.remove("active");
    }
    e.target.classList.add("active");

    switch (data) {
      case "price-asc":
        sortByPriceAsc(products);
        break;
      case "price-desc":
        sortByPriceDesc(products);
        break;
      case "name-asc":
        sortByNameAsc(products);
        break;
      case "name-desc":
        sortByNameDesc(products);
        break;
    }
    commonFunc();
  }
});

// itemContainer.innerHTML = "";
// for (let i = 0; i < keyNames.length; i++) {
//   category = keyNames[i];
//   const currentProducts = result[`${category}`];
//   currentProducts.forEach(makeItemList);
//   products.concat(currentProducts);
// }
// result['potion'].concat(result['etc'])
// console.log("products", products);
// console.log(typeof (products));
// console.log("result['potion']", result['potion']);
// products = [result['equipment'], result['potion']]
// console.log("products", products);
// console.log(typeof (result['equipment']));
// products = [];
// for (var i in result['equipment']) {
//   products.push(result['equipment'][i]);
//   console.log("products", products);
// }
// var stringEquip = JSON.parse(JSON.stringify(result['equipment']));
// var stringEtc = JSON.parse(JSON.stringify(result['etc']));
// let merged = { ...result['equipment'],
//   ...result['etc']
// };
// console.log(stringEquip)
// console.log(stringEtc)
// console.log(merged)
//ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ
//기존에 있던 result['equipment'], result['potion'], result['etc']내 배열들을 합쳐야 하는데;;;;;
//기존엔 그냥 뿌려주기만 했어서 필터 버튼 누르면
//products에 들어가있는 건 마지막 카테고리인 etc뿐이라
//다른 아이템들 다 사라지고 etc만 정렬된다;;;
//즉 sortByNameAsc({배열}) <-여기에 들어가는 배열이
//모든 카테고리내 아이템을 다 담은 새로운 배열이여야 함ㅠㅠ
// products = result;
// console.log(products);
// console.log(typeof products);
// products.forEach(makeItemList);
// + + + + + + + + + + + + + + + + + + + + + + + + + + + +
// var potionList = result["potion"];
// var etcList = result["etc"];
// var newArray = potionList.concat(etcList);
// console.log(potionList);
// console.log(etcList);
// console.log(newArray);
// console.log(Array.isArray(potionList));
// console.log(Array.isArray(etcList));
// console.log(Array.isArray(newArray));
// console.log(products);


// newnewnew = productsList[0].concat(productsList[1], productsList[2]);

// console.log(newnewnew);
// const category = keyNames[0];
// const productsEquip = result["equipment"];
// const productsPotion = result["potion"];
// const productsEtc = result["etc"];

// const myNewArray = productsEquip.concat(productsPotion, productsEtc);
// console.log(newnew);

// console.log("category", console.log(category));
// console.log("products", console.log(products));
// console.log("Array.isArray(products)", Array.isArray(products));

// 181204
// 아낰ㅋㅋㅋㅋㅋㅋㅠㅠㅠㅠㅠㅠ
// 배열을 합치는 데는 성공함;; newArray = newArray.concat(oldArray); <- 일케하면 되거든
// 근데 문제는ㅋㅋㅋㅋㅋㅋ 필터를 눌렀을 때임ㅋㅋㅋㅋㅋ
// 필터를 누르면 products를 가지고 sort하는데 카테고리가 계속 etc로남기 때문에
// 이미지 경로가 이상해짐;;

// 그럼 논리적으로 어케 짜야할까.
// 1) 사용자가 필터를 눌렀다
// 2) array내 아이템을 재배열한다
// 3) 근데 문제는 이 재배열이 돔을 재배열하는 게 아니라 array만 재배열 후, 그걸 돔으로 다시 그려내는 거임(ㅠㅠ)
// 4) 그래서 돔이 그려질 때마다 makeItemList()가 실행되는데 이때 이미지 경로를 매번 새로 찾아야 함

// 그럼 방법
// 1) 돔을 새로 그릴 때 조건문을 쓴다(?)
//  만약 all을 눌렀다, 그러면 equip, potion, etc 전체를 새로 그림
//  만약 etc를 눌렀다, 그러면 etc 전체를 새로 그림

// 아냐;; 이건 아닌 듯;;;;
// 2) 돔을 새로 그리지 마!!

// 루이까또즈 보니까 필터 누를 때마다 페이지를 새로 그림;;
// 네이버 쇼핑은 goods_list 밑을 새로 그림
// 으아규ㅠㅠㅠㅠㅠall 카테고리가 문제구먼

// data = [ equipment, potion, etc ] <- 이 형태임
// equpment 눌렀을 때 : 상품 = [1,2,3] 이고 이미지 경로는 images/equipment/
// potion 눌렀을 때 : 상품 = [4,5] 이고 이미지 경로는 images/potion/
// etc 눌렀을 때 : 상품 = [6] 이고 이미지 경로는 images/etc/
// all 눌렀을 때 : 상품 = [1,2,3,4,5,6]이고 이미지 경로는 ....? <- 이게 됌;
//방법1) 상품[1],상품[2],상품[3]의 이미지 경로는 /equipment
//      상품[4],상품[5]의 이미지 경로는 /potion
//      상품[6]의 이미지 경로는 /etc가 되도록 한다.

//그럼 문제는
// 상품 = [5,3,1,6,2]가 되면 어쩌짘ㅋㅋㅋㅋㅋㅋ

//아아ㅠㅠㅠㅠ그냥 데이터에 카테고리를 박던가  ㅠㅠㅠㅠㅠㅠㅠㅠ