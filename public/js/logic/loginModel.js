import {
  login,
  logout,
  verifyEmail,
  updateMe,
  updatePassword,
  createNewUser,
  DeleteUser,
  updateuserHorzantel,
  restartEmail,
  confrestartEmail,
  refreshToken,
} from '../components/login.js';
import Swal from 'sweetalert2';

const formlogin = document.querySelector('.form-login-loglog');
const Logout = document.querySelector('.Logoutbtn');
const verifyEmailBtn = document.querySelector('.veryfyEmailBtn');
const UserSettings = document.querySelector('.UserSettings');
const UserSettingspasword = document.querySelector('.UserSettingspasword');
const creatingUser = document.querySelector('.creating-user');
const deleteUser = document.getElementsByClassName('Delete-user');
const changehorazintal = document.querySelector('.checkingofhorzontal');
const btnEmailRester = document.getElementById('E-mail_restertbtn');
const btnconfemailresert = document.getElementById('btnconfresetpassword');

if (formlogin) {
  formlogin.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (Logout) {
  Logout.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });
}

if (verifyEmailBtn) {
  verifyEmailBtn.addEventListener('click', e => {
    e.preventDefault();

    verifyEmail();
  });
}
if (UserSettings) {
  UserSettings.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#docName').value;
    const email = document.querySelector('#docEmail').value;
    const photo = document.querySelector('#docPhoto').files;
    const branch = document.querySelector('#Branch');
    const formData = new FormData();
    const fd = {
      name: name,
      email: email,
    };
    if (branch) fd.branch = branch.value;

    console.log(fd);
    if (photo.length > 0) {
      formData.append('photo', photo[0]);
      formData.append('data', JSON.stringify(fd));
    } else {
      formData.append('data', JSON.stringify(fd));
    }
    const userId = document.querySelector('#docName').getAttribute('data-user-id');
    updateMe(formData, userId);
  });
}
if (UserSettingspasword) {
  UserSettingspasword.addEventListener('submit', e => {
    e.preventDefault();
    const passwordCurrent = document.querySelector('#oldPassword').value;
    const password = document.querySelector('#newPassword').value;
    const passwordConfirm = document.querySelector('#confirmPassword').value;

    const formdata = {
      passwordCurrent,
      password,
      passwordConfirm,
    };
    const userId = document.querySelector('#oldPassword').getAttribute('data-user-id');

    updatePassword(formdata, userId);
  });
}
if (creatingUser) {
  creatingUser.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#userName').value;
    const email = document.querySelector('#userEmail').value;
    const role = document.querySelector('#userRoleId').value;
    const branch = document.querySelector('#Branch').value;
    const isDoctor = document.querySelector('.isDoctor').checked;
    const password = document.querySelector('#userPassword').value;
    const passwordConfirm = document.querySelector('#userConfirmPassword').value;

    const fd = {
      name: name,
      email: email,
      password: password,
      role: role,
      branch: branch,
      isDoctor: isDoctor,
      passwordConfirm: passwordConfirm,
    };
    console.log(fd);
    createNewUser(fd);
  });
}
if (deleteUser) {
  Array.from(deleteUser).forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const id = item.getAttribute('data-user-id');
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(result => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          }).then(() => {
            DeleteUser(id);
          });
        }
      });
    });
  });
}
if (changehorazintal) {
  changehorazintal.addEventListener('change', e => {
    e.preventDefault();
    const elementToConvert = document.querySelector('.checkingofhorzontal').checked;
    updateuserHorzantel(elementToConvert);
  });
}
if (btnEmailRester) {
  btnEmailRester.addEventListener('click', e => {
    e.preventDefault();
    const email = document.getElementById('E-mail_restert').value;
    console.log(email);
    const fd = { email: email };
    restartEmail(fd);
  });
}
if (btnconfemailresert) {
  btnconfemailresert.addEventListener('click', e => {
    e.preventDefault();
    const password = document.getElementById('passwordreset').value;
    const passwordConfirm = document.getElementById('confPasswordreset').value;
    const body = { password, passwordConfirm };
    const url = window.location.href;
    const token = url.split('/').pop();
    confrestartEmail(token, body);
  });
}
setInterval(refreshToken, 59 * 60 * 1000);

// Call refreshToken once immediately to start the cycle
refreshToken();
