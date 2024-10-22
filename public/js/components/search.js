import axios from 'axios';
import { createshortcutQ } from './booking';
import Swal from 'sweetalert2';

export const HomeSearch = async keyword => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/patient/homeSearch',
      params: { keyword },
    });
    const container = document.querySelector('.main-content');
    container.innerHTML = '';
    res.data.patients.forEach((item, index) => {
      container.innerHTML += `<div class="card col-sm-12 col-3 m-2">
      <div class="card-items">
        <h3>${item.name}</h3>
        <div class="card-list">
          <div class="card-item1">
            <i class="ph ph-phone"></i>
            <span>Phone:${item.phoneNumber}</span>
          </div>
          <div class="card-item1">
            <i class="ph ph-calendar"></i>
            <span>DOB:${item.birthDate}</span>
          </div>
          <div class="card-item1">
            <i class="ph ph-calendar"></i>
            <span>Age :${item.age}</span>
          </div>
          <div class="card-item1">
            <i class="ph ph-barcode"></i>
            <span>Serial:${item.serial}</span>
          </div>
        </div>
        <a href="/patientMedicalView/${item._id}" class="btn btn-outline-info px-4">Go</a>
      </div>
    </div>`;
    });
  } catch (err) {
    console.log(err);
  }
};

export const smlSearch = async keyword => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/patient/homeSearch',
      params: { keyword },
    });

    console.log(res.data);
    const container = document.querySelector('.patient-items-container');
    container.innerHTML = '';
    res.data.patients.forEach((item, index) => {
      container.innerHTML += `
      <div class="row pb-2 border rounded-3 my-2">
      <div class="col-12 d-flex flex-column p-3 gap-1 fs-5">
        <span>Name:${item.name}</span>
        <span>Phone:${item.phoneNumber}</span>
        <span>Serial:${item.serial}</span>
      </div>
      <div class="col-12">
        <button class="btn btn-outline-success w-100 AddToQueue" patient-id="${item._id}">Book</button>
      </div>
    </div>`;
    });

    const AddToQueue = document.querySelectorAll('.AddToQueue');
    AddToQueue.forEach(button => {
      button.addEventListener('click', e => {
        const patient = e.currentTarget.getAttribute('patient-id');
        const datetimeString = document.querySelector('.nq-date').value;
        const note = document.querySelector('#notes').value;
        const status = document.querySelector('#status').value;
        const branch = document.querySelector('#Branch').value;
        const service = document.querySelector('#Booking').value;
        const forWhichDoctor = document.querySelector('#DoctorName').value;
        // Check if datetimeString is empty
        if (!datetimeString) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Date is required',
          });
        } else {
          const date = new Date(datetimeString);
          const form = { patient, date, branch, service, forWhichDoctor, note, status };
          sendinqueue(form);
        }
      });
    });
    async function sendinqueue(serial) {
      try {
        const response = await axios({
          method: 'POST',
          url: '/api/v1/booking/',
          data: serial,
        });

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 2500,
        }).then(() => {
          location.reload();
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.message,
        });
      }
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.response.data.message,
    });
  }
};

export const searchPatientForInvoice = async keyword => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/patient/get-patient',
      data: { keyword },
    });
    const container = document.getElementById('patientTable');
    container.innerHTML = '';
    res.data.patients.forEach((item, index) => {
      container.innerHTML += `
      <tr>
      <td class="patient-name">${item.name}</td>
      <td>${item.phoneNumber}</td>
      <td>${item.age}</td>
      <td>${item.sex}</td>
      <td><a  class="btn btn-outline-info SelectPatient" patient-id="${item._id}">Select</a></td>
    </tr>`;
    });
    const SelectPatient = document.getElementsByClassName('SelectPatient');

    Array.from(SelectPatient).forEach(button => {
      button.addEventListener('click', e => {
        const patientId = e.currentTarget.getAttribute('patient-id');
        const patientName = e.currentTarget.parentNode.parentNode.querySelector('.patient-name').innerHTML;
        const invoicePatientSearch = document.querySelector('.invoicePatientSearch');
        invoicePatientSearch.setAttribute('patient-id', patientId);
        invoicePatientSearch.value = patientName;
      });
    });
  } catch (err) {
    console.log(err);
  }
};
