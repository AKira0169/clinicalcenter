import axios from 'axios'
import Swal from 'sweetalert2'

export const findRefdr = async keyword => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/REFDR/',
      data: { keyword },
    })
    console.log(res.data)
    if (res.data.status === 'success') {
      const container = document.querySelector('.main-content')
      container.innerHTML = ''
      res.data.data.forEach((item, index) => {
        container.innerHTML += `
        <div class="card col-sm-12 col-3 m-2 refCard">
        <div class="card-items">
          <h4>${item.name}</h4>
          <div class="card-list overflow-y-auto w-100">
            <div class="card-item1 cd-flex flex-column gap-1">
              <div class="d-flex gap-1 align-items-center">
                <i class="ph ph-barcode"></i>
                <span>description:</span>
              </div>
              <span>${item.description}</span>
            </div>
            ${item.phoneNumber
              .map(phone => {
                return `
                <div class="card-item1 d-flex align-items-center gap-1">
                <i class="ph ph-phone"></i>
                <span>${phone}</span>
              </div>`
              })
              .join('')}
            <div class="card-item1 d-flex align-items-center gap-1">
              <i class="ph ph-envelope-simple"></i>
              <span>${item.email}</span>
            </div>
          </div>
        </div>
        <div class="row  mt-auto">
          <div class="col-9 text-center">
            <button class="btn btn-danger  my-2 card-btnREFDR" type="button" data-serial="${item._id}">Delete</button>
          </div>
          <div class="col-3 d-flex align-items-center justify-content-start addtocartprint">
            <i class="ph ph-plus  my-2 fs-2 pointer cart-add"></i>
          </div>
        </div>
      </div>`
      })

      function updateCartDisplay() {
        const cartt = JSON.parse(localStorage.getItem('cart')) || []
        const elementToConvert = document.getElementById('elementToConvert')
        elementToConvert.innerHTML = ''
        cartt.forEach(htmlString => {
          elementToConvert.innerHTML += htmlString
        })
      }
      const addtocartprint = document.getElementsByClassName('addtocartprint')
      Array.from(addtocartprint).forEach(item => {
        item.addEventListener('click', e => {
          e.preventDefault()
          const htmll = item.parentNode.parentNode
          const htmllCopy = htmll.cloneNode(true)
          htmllCopy.classList.add('cardPrintAdd')
          const mtAutoDiv = htmllCopy.querySelector('.mt-auto')
          if (mtAutoDiv) {
            mtAutoDiv.parentNode.removeChild(mtAutoDiv)
          }
          const modifiedHTMLString = htmllCopy.outerHTML

          // Retrieve existing cart from localStorage or initialize as an empty array
          let cart = JSON.parse(localStorage.getItem('cart')) || []

          // Add the modified HTML string to the cart array
          cart.push(modifiedHTMLString)

          // Store the updated cart back into localStorage
          localStorage.setItem('cart', JSON.stringify(cart))

          // Update the cart display
          updateCartDisplay()

          Swal.fire({
            icon: 'success',
            title: 'Added to cart successfully!',
            showConfirmButton: false,
            timer: 500,
          })
        })
      })
      const DeleteREFBtn = document.getElementsByClassName('card-btnREFDR')
      Array.from(DeleteREFBtn).forEach(item => {
        item.addEventListener('click', e => {
          e.preventDefault()
          const id = item.getAttribute('data-serial')
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
              DeleteREFDR(id)
            }
          })
        })
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const CreateREFDR = async formData => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/REFDR/createRefDr',
      data: formData,
    })
    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.assign('/ViewRefDR2')
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const DeleteREFDR = async data => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: '/api/v1/REFDR/deleteRefDr/' + data,
    })

    if (res.data.status === 'success') {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.reload()
      })
    }
  } catch (err) {
    console.log(err)
  }
}
