import Search from "./modules/search";

//To show search only if we are logged in
if (document.querySelector(".header-search-icon")) {
  new Search();
}
