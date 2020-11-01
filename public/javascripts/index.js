// Form Register
const formRegister = document.getElementById("form-register");

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("user").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const password = document.getElementById("password").value;
  const data = {
    username: username,
    fullname: name,
    email: email,
    phone: phone,
    address: address,
    password: password,
  };
  const result = await fetch("http://localhost:3000/api/user", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POSt",
    body: JSON.stringify(data),
  });
  const res = await result.json();
  if (res.status === 500) {
    const spanUser = document.getElementById("error-user");
    const spanEmail = document.getElementById("error-email");
    spanUser.style.display = "block";
    spanUser.innerHTML = res.body;
    spanEmail.style.display = "block";
    spanEmail.innerHTML = res.body;
  }
  if (res.status === 201) {
    const inputs = formRegister.querySelectorAll("input");
    notie.alert({ type: "success", text: "User created!", time: 3 });
    inputs.forEach((item) => (item.value = ""));
  }
});
