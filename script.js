/*
  META PIXEL PRACTICE
  ====================
  Meta Pixel ID: 1095959689843566
*/

const META_PIXEL_ID = "1095959689843566";

/* =========================
   META PIXEL BASE CODE
   ========================= */

!function(f,b,e,v,n,t,s){
  if(f.fbq)return;
  n=f.fbq=function(){
    n.callMethod ?
    n.callMethod.apply(n,arguments) :
    n.queue.push(arguments)
  };

  if(!f._fbq)f._fbq=n;
  n.push=n;
  n.loaded=!0;
  n.version='2.0';
  n.queue=[];

  t=b.createElement(e);
  t.async=!0;
  t.src=v;

  s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s);

}(window, document, 'script',
  'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', META_PIXEL_ID);
fbq('track', 'PageView');


/* =========================
   TRACKING HELPER
   ========================= */

function track(eventName, params = {}) {

  console.log("[META SIMULATION]", eventName, params);

  if (typeof fbq === "function") {
    fbq("track", eventName, params);
  }
}


/* =========================
   COURSE PAGE
   ViewContent + AddToCart
   ========================= */

if (location.pathname.endsWith("course.html")) {

  const params = new URLSearchParams(location.search);

  const course =
    params.get("course") || "performance-101";

  const data = {
    "marketing-101": [
      "Marketing Fundamentals",
      499000
    ],

    "performance-101": [
      "Performance Marketing 101",
      699000
    ],

    "analytics-101": [
      "Marketing Analytics 101",
      599000
    ]

  }[course] || [
    "Performance Marketing 101",
    699000
  ];


  document.getElementById("courseTitle").textContent =
    data[0];

  document.getElementById("coursePrice").textContent =
    data[1].toLocaleString("vi-VN") + "đ";


  /* ViewContent */

  track("ViewContent", {

    content_name: data[0],

    content_ids: [course],

    content_type: "product",

    value: data[1],

    currency: "VND"

  });


  /* AddToCart */

  document
    .getElementById("addToCartBtn")
    .addEventListener("click", () => {

      localStorage.setItem(
        "selectedCourse",
        course
      );

      localStorage.setItem(
        "selectedPrice",
        data[1]
      );


      track("AddToCart", {

        content_name: data[0],

        content_ids: [course],

        content_type: "product",

        value: data[1],

        currency: "VND"

      });


      alert(
        "Đã thêm khóa học vào giỏ hàng (simulation)."
      );

    });

}


/* =========================
   CHECKOUT PAGE
   InitiateCheckout + Purchase
   ========================= */

if (location.pathname.endsWith("checkout.html")) {

  const select =
    document.getElementById("courseSelect");


  /* Update total */

  const updateTotal = () => {

    const price =
      Number(
        select.selectedOptions[0].dataset.price
      );

    document.getElementById("total").textContent =
      price.toLocaleString("vi-VN") + "đ";

  };


  updateTotal();


  select.addEventListener(
    "change",
    updateTotal
  );


  /* InitiateCheckout */

  track("InitiateCheckout", {

    content_type: "product",

    value:
      Number(
        select.selectedOptions[0].dataset.price
      ),

    currency: "VND"

  });


  /* Purchase */

  document
    .getElementById("checkoutForm")
    .addEventListener("submit", (e) => {

      e.preventDefault();


      const option =
        select.selectedOptions[0];

      const price =
        Number(option.dataset.price);

      const course =
        option.value;


      /* Send Purchase */

      track("Purchase", {

        content_ids: [course],

        content_type: "product",

        value: price,

        currency: "VND"

      });


      /* Save purchase */

      localStorage.setItem(
        "lastPurchase",
        JSON.stringify({

          course: course,

          price: price,

          orderId:
            "LH-" + Date.now()

        })
      );


      /*
        Give Meta Pixel a moment
        to send the Purchase event
        before redirecting.
      */

      setTimeout(() => {

        window.location.href =
          "success.html";

      }, 1000);

    });

}


/* =========================
   SUCCESS PAGE
   ========================= */

if (location.pathname.endsWith("success.html")) {

  const order =
    JSON.parse(
      localStorage.getItem(
        "lastPurchase"
      ) || "{}"
    );


  if (order.orderId) {

    document.getElementById(
      "orderId"
    ).textContent =
      order.orderId;

  }

}
