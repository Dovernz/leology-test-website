/*
  META PIXEL PRACTICE
  ====================
  Sau khi tạo Pixel trong Meta, thay YOUR_PIXEL_ID bằng Pixel ID thật.
  Website này là static site nên có thể chạy trên GitHub Pages.
*/

const META_PIXEL_ID = "1095959689843566";

if (META_PIXEL_ID !== "YOUR_PIXEL_ID") {
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

function track(eventName, params = {}) {
  console.log("[META SIMULATION]", eventName, params);
  if (typeof fbq === "function") fbq("track", eventName, params);
}

// Course page: ViewContent
if (location.pathname.endsWith("course.html")) {
  const params = new URLSearchParams(location.search);
  const course = params.get("course") || "performance-101";
  const data = {
    "marketing-101": ["Marketing Fundamentals", 499000],
    "performance-101": ["Performance Marketing 101", 699000],
    "analytics-101": ["Marketing Analytics 101", 599000]
  }[course] || ["Performance Marketing 101", 699000];

  document.getElementById("courseTitle").textContent = data[0];
  document.getElementById("coursePrice").textContent = data[1].toLocaleString("vi-VN") + "đ";

  track("ViewContent", {
    content_name: data[0],
    content_ids: [course],
    content_type: "product",
    value: data[1],
    currency: "VND"
  });

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    localStorage.setItem("selectedCourse", course);
    localStorage.setItem("selectedPrice", data[1]);
    track("AddToCart", {
      content_name: data[0],
      content_ids: [course],
      content_type: "product",
      value: data[1],
      currency: "VND"
    });
    alert("Đã thêm khóa học vào giỏ hàng (simulation).");
  });
}

// Checkout: InitiateCheckout + Purchase
if (location.pathname.endsWith("checkout.html")) {
  const select = document.getElementById("courseSelect");
  const updateTotal = () => {
    const price = Number(select.selectedOptions[0].dataset.price);
    document.getElementById("total").textContent = price.toLocaleString("vi-VN") + "đ";
  };
  updateTotal();
  select.addEventListener("change", updateTotal);

  track("InitiateCheckout", {
    content_type: "product",
    value: Number(select.selectedOptions[0].dataset.price),
    currency: "VND"
  });

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const option = select.selectedOptions[0];
    const price = Number(option.dataset.price);
    const course = option.value;

    track("Purchase", {
      content_ids: [course],
      content_type: "product",
      value: price,
      currency: "VND"
    });

    localStorage.setItem("lastPurchase", JSON.stringify({
      course, price, orderId: "LH-" + Date.now()
    }));
    window.location.href = "success.html";
  });
}

// Success page
if (location.pathname.endsWith("success.html")) {
  const order = JSON.parse(localStorage.getItem("lastPurchase") || "{}");
  if (order.orderId) document.getElementById("orderId").textContent = order.orderId;
}
