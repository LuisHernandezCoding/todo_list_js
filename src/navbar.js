export default function CreateNavbar() {
  const navbar = document.createElement('nav');
  navbar.classList.add('navbar', 'is-fixed-top', 'has-background-success');
  navbar.setAttribute('role', 'navigation');
  navbar.setAttribute('aria-label', 'main navigation');
  navbar.setAttribute('id', 'navbar');
  navbar.innerHTML = `
    <div class="navbar-start">
      <a class="navbar-item" href="#">
        <p class="title is-4">ToDo - List</p>
      </a>
    </div>
    <div class="navbar-end">
      <a class="navbar-item" href="https://github.com/LuisHernandezCoding/" target="_blank">
        Created with &nbsp;<i class="fa fa-heart"></i>&nbsp; by Luis Hernandez &nbsp;<i class="fa fa-github"></i>
      </a>
    </div>`;

  return navbar;
}
