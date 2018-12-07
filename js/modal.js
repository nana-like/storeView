const modal = document.getElementById("modal");

let showModal = () => {
  if (!modal.classList.contains("active")) {
    modal.classList.add("active");
  }
};

let hideModal = e => {
  if (modal.classList.contains("active")) {
    modal.classList.remove("active");
  }
};

// 네비게이션 메뉴 클릭 시 모달 보임
document.getElementById("nav").addEventListener("click", showModal);
// 모달 닫기버튼 클릭으로 모달 숨김
document.getElementById("btn-close-modal").addEventListener("click", hideModal);

// 모달 딤영역 클릭으로 모달 숨김
document.getElementById("modal").addEventListener("click", function(e) {
  //딤 영역 외 클릭 시 hide modal 방지
  if (e.target !== this) {
    return false;
  }
  hideModal();
});

// --------------

let validateForm = e => {
  let loginForm = document.forms["loginForm"];
  let email = loginForm["loginEmail"];
  let password = loginForm["loginPassword"];
  var emailPattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

  e.preventDefault();

  const showErrorMessage = (elem, message) => {
    elem.nextElementSibling.innerHTML = message;
    elem.focus();
  };

  if (email.value === "") {
    let message = "Please enter your email address.";
    showErrorMessage(email, message);
    return false;
  }

  if (!emailPattern.test(email.value)) {
    let message = "Please enter a valid email address.";
    showErrorMessage(email, message);
    return false;
  }

  if (password.value === "") {
    let message = "Please enter your password.";
    showErrorMessage(password, message);
    return false;
  }

  alert("Welcome, " + email.value + "!");
};

modal
  .getElementsByClassName("btn-submit")[0]
  .addEventListener("click", validateForm);
