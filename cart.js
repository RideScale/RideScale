function getCart(){return JSON.parse(localStorage.getItem("ridescaleCart")||"[]");}
function saveCart(cart){localStorage.setItem("ridescaleCart",JSON.stringify(cart));}

function setupSizePicker(productName){
  const buttons=document.querySelectorAll(".size-option");
  const imageButtons=document.querySelectorAll(".image-choice");
  const fidgetRadios=document.querySelectorAll('input[name="fidgetType"]');
  const keychainRadios=document.querySelectorAll('input[name="keychainType"]');
  const deskToyRadios=document.querySelectorAll('input[name="deskToyType"]');

  const customFidgetBox=document.getElementById("customFidgetBox");
  const customFidgetText=document.getElementById("customFidgetText");
  const customKeychainBox=document.getElementById("customKeychainBox");
  const customKeychainText=document.getElementById("customKeychainText");
  const nameKeychainBox=document.getElementById("nameKeychainBox");
  const keychainNameInput=document.getElementById("keychainNameInput");
  const keychainQuantityInput=document.getElementById("keychainQuantityInput");
  const customDeskToyBox=document.getElementById("customDeskToyBox");
  const customDeskToyText=document.getElementById("customDeskToyText");

  const priceText=document.getElementById("selectedPrice");
  const modelText=document.getElementById("selectedModel");
  const addBtn=document.getElementById("addToCartBtn");

  let selected=null;
  let selectedModel=imageButtons.length?imageButtons[0].dataset.model:"";

  function showMessage(message,isWarning=false){
    let box=document.getElementById("cartMessage");
    if(!box){
      box=document.createElement("p");
      box.id="cartMessage";
      box.className="cart-message";
      addBtn.parentElement.insertAdjacentElement("afterend",box);
    }
    box.textContent=message;
    box.classList.toggle("small-quality-warning",isWarning);
  }

  function getQuantity(){
    if(productName!=="Keychains"||!keychainQuantityInput)return 1;
    const qty=Number(keychainQuantityInput.value);
    return qty&&qty>0?qty:1;
  }

  function checkedValue(name){
    const checked=document.querySelector(`input[name="${name}"]:checked`);
    return checked?checked.value:"";
  }

  function getFidgetType(){
    const value=checkedValue("fidgetType");
    if(value==="Custom Fidget"){
      const text=customFidgetText?customFidgetText.value.trim():"";
      return text?`Custom Fidget: ${text}`:"Custom Fidget";
    }
    return value;
  }

  function getKeychainType(){
    const value=checkedValue("keychainType");
    if(value==="Name Keychain"){
      const name=keychainNameInput?keychainNameInput.value.trim():"";
      return name?`Name Keychain: ${name}`:"Name Keychain";
    }
    if(value==="Custom Keychain"){
      const text=customKeychainText?customKeychainText.value.trim():"";
      return text?`Custom Keychain: ${text}`:"Custom Keychain";
    }
    return value;
  }

  function getDeskToyType(){
    const value=checkedValue("deskToyType");
    if(value==="Custom Desk Toy"){
      const text=customDeskToyText?customDeskToyText.value.trim():"";
      return text?`Custom Desk Toy: ${text}`:"Custom Desk Toy";
    }
    return value;
  }

  function getCurrentModel(){
    if(productName==="Fidgets")return getFidgetType();
    if(productName==="Keychains")return getKeychainType();
    if(productName==="Desk Toys")return getDeskToyType();
    return selectedModel;
  }

  function updateKeychainBoxes(){
    const value=checkedValue("keychainType");
    if(nameKeychainBox)nameKeychainBox.style.display=value==="Name Keychain"?"block":"none";
    if(customKeychainBox)customKeychainBox.style.display=value==="Custom Keychain"?"block":"none";
  }

  function updateDeskToyBoxes(){
    const value=checkedValue("deskToyType");
    if(customDeskToyBox)customDeskToyBox.style.display=value==="Custom Desk Toy"?"block":"none";
  }

  function showSmallQualityWarning(size){
    if((productName==="Fidgets"||productName==="Keychains")&&size==="Small"){
      showMessage("Note: Small size is cheaper, but it may be lower quality and more likely to break because it is very small.",true);
    }else{
      showMessage("");
    }
  }

  imageButtons.forEach(button=>{
    button.addEventListener("click",()=>{
      imageButtons.forEach(b=>b.classList.remove("active"));
      button.classList.add("active");
      selectedModel=button.dataset.model;
      if(modelText)modelText.innerHTML=`Selected Model: <strong>${selectedModel}</strong>`;
      showMessage("");
    });
  });

  fidgetRadios.forEach(r=>r.addEventListener("change",()=>{
    if(customFidgetBox)customFidgetBox.style.display=r.value==="Custom Fidget"&&r.checked?"block":"none";
    if(selected&&productName==="Fidgets")selected.model=getFidgetType();
    showMessage("");
  }));

  keychainRadios.forEach(r=>r.addEventListener("change",()=>{
    updateKeychainBoxes();
    if(selected&&productName==="Keychains"){
      selected.model=getKeychainType();
      selected.quantity=getQuantity();
      selected.price=Number(selected.unitPrice||selected.price)*selected.quantity;
    }
    showMessage("");
  }));

  deskToyRadios.forEach(r=>r.addEventListener("change",()=>{
    updateDeskToyBoxes();
    if(selected&&productName==="Desk Toys")selected.model=getDeskToyType();
    showMessage("");
  }));

  [customFidgetText,customKeychainText,customDeskToyText,keychainNameInput].forEach(input=>{
    if(input)input.addEventListener("input",()=>{
      if(selected)selected.model=getCurrentModel();
    });
  });

  if(keychainQuantityInput){
    keychainQuantityInput.addEventListener("input",()=>{
      if(selected&&productName==="Keychains"){
        selected.quantity=getQuantity();
        selected.price=Number(selected.unitPrice)*selected.quantity;
        priceText.innerHTML=`Selected Size: <strong>${selected.size}</strong> - $${selected.unitPrice} each × ${selected.quantity} = $${selected.price}`;
      }
    });
  }

  buttons.forEach(button=>{
    button.addEventListener("click",()=>{
      buttons.forEach(b=>b.classList.remove("active"));
      button.classList.add("active");

      const unitPrice=Number(button.dataset.price);
      const qty=getQuantity();
      selected={
        product:productName,
        model:getCurrentModel(),
        size:button.dataset.size,
        dimensions:button.dataset.dimensions,
        unitPrice:unitPrice,
        quantity:qty,
        price:productName==="Keychains"?unitPrice*qty:unitPrice
      };

      if(productName==="Keychains"){
        priceText.innerHTML=`Selected Size: <strong>${selected.size}</strong> - $${unitPrice} each × ${qty} = $${selected.price}`;
      }else{
        priceText.innerHTML=`Selected Size: <strong>${selected.size}</strong> - $${selected.price}`;
      }

      addBtn.disabled=false;
      showSmallQualityWarning(selected.size);
    });
  });

  addBtn.addEventListener("click",()=>{
    if(!selected){showMessage("Choose a size first.");return;}
    selected.model=getCurrentModel();
    if(productName==="Keychains"){
      selected.quantity=getQuantity();
      selected.price=Number(selected.unitPrice)*selected.quantity;
    }
    const cart=getCart();
    cart.push(selected);
    saveCart(cart);
    const displayName=selected.model?`${selected.product} - ${selected.model}`:selected.product;
    const qtyText=selected.quantity&&selected.quantity>1?` Quantity: ${selected.quantity}.`:"";
    showMessage(`${displayName} ${selected.size} added to cart.${qtyText}`);
  });

  updateKeychainBoxes();
  updateDeskToyBoxes();
}

function renderCart(){
  const container=document.getElementById("cartItems");
  const totalEl=document.getElementById("cartTotal");
  const cart=getCart();
  if(!cart.length){
    container.innerHTML="<p>Your cart is empty.</p>";
    totalEl.textContent="$0";
    return;
  }
  let total=0;
  container.innerHTML=cart.map((item,index)=>{
    total+=Number(item.price);
    const modelLine=item.model?`<br>${item.model}`:"";
    const qtyLine=item.quantity&&item.quantity>1?`<br>Quantity: ${item.quantity}`:"";
    const unitLine=item.unitPrice&&item.quantity&&item.quantity>1?`<br>$${item.unitPrice} each`:"";
    return `<div class="cart-item"><div><strong>${item.product}</strong>${modelLine}<br>${item.size} - ${item.dimensions}${qtyLine}${unitLine}</div><div>$${item.price}</div><button class="remove-btn" onclick="removeFromCart(${index})">Remove</button></div>`;
  }).join("");
  totalEl.textContent=`$${total}`;
}

function removeFromCart(index){
  const cart=getCart();
  cart.splice(index,1);
  saveCart(cart);
  renderCart();
}

function clearCart(){
  saveCart([]);
  renderCart();
}