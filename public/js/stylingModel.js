document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-btn');
  const customsidebar = document.getElementById('custom-sidebar');

  function togglecustomsidebar() {
    customsidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
    closeAllSubMenus();
  }

  function toggleSubMenu(button) {
    if (!button.nextElementSibling.classList.contains('show')) {
      closeAllSubMenus();
    }
    button.nextElementSibling.classList.toggle('show');
    button.classList.toggle('rotate');
    if (customsidebar.classList.contains('close')) {
      customsidebar.classList.toggle('close');
      toggleButton.classList.toggle('rotate');
    }
  }

  function closeAllSubMenus() {
    Array.from(customsidebar.getElementsByClassName('show')).forEach(ul => {
      ul.classList.remove('show');
      ul.previousElementSibling.classList.remove('rotate');
    });
  }

  toggleButton.addEventListener('click', togglecustomsidebar);
  // Attach event listeners to dropdown buttons
  Array.from(customsidebar.getElementsByClassName('dropdown-btn')).forEach(button => {
    button.addEventListener('click', function () {
      toggleSubMenu(this);
    });
  });
});
