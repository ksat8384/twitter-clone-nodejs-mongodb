import Search from "./modules/search";
import Chat from "./modules/chat";
import RegistrationForm from "./modules/registrationForm";

if (document.querySelector("#registration-form")) {
  new RegistrationForm();
}

//To show chat only if we are logged in
if (document.querySelector("#chat-wrapper")) {
  new Chat();
}

//To show search only if we are logged in
if (document.querySelector(".header-search-icon")) {
  new Search();
}
