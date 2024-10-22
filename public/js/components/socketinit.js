import openSocket from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode from jwt-decode
import Swal from 'sweetalert2';

const queueNumber = document.getElementById('notificationCount');
const notificationshake = document.querySelector('.notificationshake');
const quelistsmall = document.querySelector('.quelistsmall');
const sendmessagethrowinternet = document.querySelector('.sendmessagethrowinternet');
export const socket = () => {
  const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage or wherever it's stored
  if (token) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      didOpen: toast => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    const decodedToken = jwtDecode(token); // Decode the token to get user information
    // http://127.0.0.1:8000
    const socket = openSocket('http://127.0.0.1:8000', {
      extraHeaders: {
        Authorization: `Bearer ${token}`, // Include the token in the authorization header
      },
    });
    // socket.on('connect', () => {

    // });
    if (sendmessagethrowinternet) {
      sendmessagethrowinternet.addEventListener('click', e => {
        e.preventDefault();
        const message = document.querySelector('#messagethrowinternet').value;
        socket.emit('chat message', message);
      });
    }
    socket.on('chat message', msg => {
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
      chatHistory.push(msg);
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

      const chatbodyinsert = document.querySelector('.chatbodyinsert');
      chatbodyinsert.innerHTML += `<span class="row text-left text-wrap">${msg.user}: ${msg.message}</span>`;

      Toast.fire({
        title: `${msg.user}:${msg.message}`,
      });
    });

    socket.on('queueLength', data => {
      queueNumber.textContent = data.ql;
      notificationshake.classList.add('shake');
      setTimeout(() => {
        notificationshake.classList.remove('shake');
      }, 2000);
      if (data.action === 'post') {
        quelistsmall.innerHTML += `
        <li class="d-flex align-items-center w-100 justify-content-between p-2 my-3 fw-bold border-bottom deletedclass">
        <div class="details">
          <div class="inf-data gap-1 d-flex align-items-center">
            <span>Name:</span>
            <span>${data.data.patient.name}</span>
          </div>
          <div class="inf-data gap-1 d-flex align-items-center">
            <span>Age:</span>
            <span>${data.data.patient.age}</span>
          </div>
          <div class="inf-data gap-1 d-flex align-items-center">
            <span>Serial:</span>
            <span>${data.data.patient.serial}</span>
          </div>
          <div class="inf-data gap-1 d-flex align-items-center">
            <span>حجز:</span>
            <span>${data.data.HAGZ}</span>
          </div>
        </div>
        <div class="ph-cont">
          <a href="#" class="ph-x goToPatientAndDelete" patientId="${data.data.patient.id}" queueId="${data.data._id}" >GO</a>
        </div>
      </li>
        `;
        const goToPatientAndDelete = quelistsmall.getElementsByClassName('goToPatientAndDelete');
        if (goToPatientAndDelete) {
          Array.from(goToPatientAndDelete).forEach(item => {
            item.addEventListener('click', e => {
              e.preventDefault();
              const patientId = item.getAttribute('patientId');
              const queueId = item.getAttribute('queueId');
              fetch(`/api/v1/queue/delete/${queueId}`, {
                method: 'DELETE',
              }).then(() => {
                window.location.href = `/newView/${patientId}`;
              });
            });
          });
        }
        Toast.fire({
          icon: 'success',
          title: `${data.user} added a new patient to the queue!`,
        });
      }
      if (data.action === 'delete') {
        const x = quelistsmall.getElementsByClassName('goToPatientAndDelete');
        Array.from(x).forEach(item => {
          const queueId = item.getAttribute('queueId');
          if (queueId === data.data._id) {
            item.parentNode.parentNode.remove();
          }
        });
      }
    });
  }
};
