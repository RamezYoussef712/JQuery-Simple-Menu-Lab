let totalAmount = 0;
$.get("items.js", function (data) {
  const items = JSON.parse(data);

  for (const item of items) {
    let menu_html = `
        <div data-itemID="${item.id}" class="col draggable">
          <div class="card h-100 border-primary mb-3 p-0">
            <div class="d-grid">
            <span class="py-1 text-white text-center bg-warning" type="button">
            Drag Here
            </span>
            </div>
            <img src="./img/${item.photo}" class="card-img-top" alt="..." />
            <span class="py-1 text-white text-center bg-danger mx-0" type="button">
              ${item.price} EGP
            </span>
            <div class="card-body">
              <h5 class="card-title fs-4">${item.name}</h5>
              <p class="card-text">
                ${item.description}
              </p>
            </div>
            <div class="d-grid">
              <button class="btn btn-primary m-0 addItem" data-itemID="${item.id}" type="button">
                Add item
              </button>
            </div>
          </div>
        </div>
      `;
    $("#menu-items").append(menu_html);
  }

  const addItemFromMenu = (currentItemID) => {
    let cartItem = $(`#cart-items [data-itemID="${currentItemID}"]`);
    if (cartItem.length > 0) {
      cartItem.find(".add").click();
    } else {
      let currentItem;
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === currentItemID) {
          currentItem = items[i];
          let totalSpan = $("#total");
          totalAmount += currentItem.price;
          totalSpan.text(totalAmount.toFixed(2));
          break;
        }
      }
      let item_card_html = `
      <div data-itemID="${currentItem.id}" class="card m-0 pb-0 draggable">
        <div class="row g-0 w-100 pe-2">
          <div class="col-md-4 pb-0 me-0 pe-0">
            <img
              src="./img/${currentItem.photo}"
              class="img-fluid rounded-start"
              alt="..."
              width="180" height="155"
            />
          </div>
          <div class="col-md-8 pb-0 mb-0">
            <div class="card-body pb-0 mb-0 ps-0">
              <h4 class="card-title">${currentItem.name}</h4>
              <span class="d-block">
              Price: 
              ${currentItem.price} EGP
              </span>
              <span class="d-block mb-0">
              Quantity: <span class="quantity">1</span>
              </span>
              </div>
              <div class="d-flex justify-content-end gap-2 me-2">
              <button class="btn btn-success btn-sm add col-3" data-itemID="${currentItem.id}">Add</button>
              <button class="btn btn-danger btn-sm remove col-3" data-itemID="${currentItem.id}"">Remove</button>
              </div>
          </div>
        </div>
      </div>
    `;
      $("#cart-items")
        .append(item_card_html)
        .children(".draggable")
        .draggable({ revert: true });
        
        $("#cart-items .draggable").draggable({
          stop: (e) => {
            const element = $(e.target);
            let currentItemID = element.attr("data-itemID");
            if (Math.abs(e.offsetX) > element.width() * 0.75) {
                console.log(element);
              removeItemFromCartDrag(currentItemID, element);
            }
          },
          revert: true,
        });

      $(`#cart-items [data-itemID="${currentItem.id}"] .add`).click(
        function (event) {
            let currentItemID = $(this).attr("data-itemID");
            addItemFromCart(currentItemID, this);
      });

      $(`#cart-items [data-itemID="${currentItem.id}"] .remove`).click(
        function (event) {
            let currentItemID = $(this).attr("data-itemID");
            removeItemFromCart(currentItemID, this);
        }
      );
    }
  };

  const removeItemFromCart = (currentItemID, itemCard) => {
    let currentItemQuant;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === currentItemID) {
        let currentItem = items[i];
        let currentItemQuantSpan = $(itemCard)
          .parentsUntil(".card")
          .parent()
          .find(".quantity");
        currentItemQuant = parseInt(currentItemQuantSpan.text());
        currentItemQuant--;
        if (currentItemQuant === 0) {
          let itemDiv = $(itemCard).parentsUntil(".card").parent()
          itemDiv.toggle("fade", 1000, () => {
              itemDiv.remove();
          });
        } else {
          currentItemQuantSpan.text(currentItemQuant);
        }
        let totalSpan = $("#total");
        totalAmount -= currentItem.price;
        if (totalAmount < 0) {
          totalAmount = 0;
        }
        totalSpan.text(totalAmount.toFixed(2));
        break;
      }
    }
  };

  const removeItemFromCartDrag = (currentItemID, itemCard) => {
    let currentItemQuant;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === currentItemID) {
        let currentItem = items[i];
        let currentItemQuantSpan = $(itemCard)
          .find(".quantity");
        currentItemQuant = parseInt(currentItemQuantSpan.text());
        currentItemQuant--;
        if (currentItemQuant === 0) {
          $(itemCard).remove();
        } else {
          currentItemQuantSpan.text(currentItemQuant);
        }
        let totalSpan = $("#total");
        totalAmount -= currentItem.price;
        if (totalAmount < 0) {
          totalAmount = 0;
        }
        totalSpan.text(totalAmount.toFixed(2));
        break;
      }
    }
  };

  const addItemFromCart = (currentItemID, itemCard) => {
    let currentItemQuant;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === currentItemID) {
        let currentItem = items[i];
        currentItemPrice = items[i].price;
        let currentItemQuantSpan = $(itemCard)
          .parentsUntil(".card")
          .parent()
          .find(".quantity");
        currentItemQuant = parseInt(currentItemQuantSpan.text());
        currentItemQuant++;
        currentItemQuantSpan.text(currentItemQuant);
        let totalSpan = $("#total");
        totalAmount += currentItem.price;
        totalSpan.text(totalAmount.toFixed(2));
        break;
      }
    }
  }

  $(".addItem").click(function (event) {
    let currentItemID = $(this).attr("data-itemID");
    addItemFromMenu(currentItemID);
  });

  $(".draggable").draggable({ handle: ".bg-warning", revert: true });
  $(".droppable").droppable({
    drop: function (event, ui) {
      $(this);
      let currentItemID = $(ui.draggable).attr("data-itemID");
      addItemFromMenu(currentItemID);

    },
  });
});
