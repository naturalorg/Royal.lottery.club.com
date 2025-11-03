// === Royal Lottery Club Frontend Script ===

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzAp14MGg9cga7atDRlS2vCwMMPjjnHM_Mb_8irQwVf61Hp3weGqVGTYALzMHWA3CiCOg/exec";

// === Banner Carousel ===
const banners = [
  "assets/banner1.jpg",
  "assets/banner2.jpg",
  "assets/banner3.jpg",
  "assets/banner4.jpg",
];
let bannerIndex = 0;
setInterval(() => {
  bannerIndex = (bannerIndex + 1) % banners.length;
  const banner = document.getElementById("banner");
  banner.style.opacity = 0;
  setTimeout(() => {
    banner.src = banners[bannerIndex];
    banner.style.opacity = 1;
  }, 400);
}, 1500);

// === Elements ===
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const popupMessage = document.getElementById("popupMessage");
const popupText = document.getElementById("popupText");
const dashboard = document.getElementById("dashboard");

// === Popup Controls ===
registerBtn.onclick = () => registerForm.classList.remove("hidden");
loginBtn.onclick = () => loginForm.classList.remove("hidden");
document.getElementById("closeRegister").onclick = () =>
  registerForm.classList.add("hidden");
document.getElementById("closeLogin").onclick = () =>
  loginForm.classList.add("hidden");
document.getElementById("closePopup").onclick = () =>
  popupMessage.classList.add("hidden");
document.getElementById("closeDashboard").onclick = () =>
  dashboard.classList.add("hidden");

// === Registration ===
document.getElementById("submitBtn").onclick = async () => {
  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !mobile || !address || !email) {
    alert("Please fill all fields!");
    return;
  }

  const data = { name, mobile, address, email };

  await fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  registerForm.classList.add("hidden");
  popupText.innerText =
    "Our Royal Lottery Club team will get back to you soon and allot your lottery ticket. Please wait while we process your details.";
  popupMessage.classList.remove("hidden");
};

// === Login ===
document.getElementById("loginSubmit").onclick = async () => {
  const name = document.getElementById("loginName").value.trim();
  const ticket = document.getElementById("ticketNumber").value.trim();
  if (!name || !ticket) {
    alert("Please enter both Name and Ticket Number!");
    return;
  }

  const res = await fetch(
    `${scriptURL}?name=${encodeURIComponent(name)}&ticket=${encodeURIComponent(ticket)}`
  );
  const user = await res.json();

  if (user.name) {
    loginForm.classList.add("hidden");
    document.getElementById(
      "userInfo"
    ).innerHTML = `<strong>Name:</strong> ${user.name}<br>
      <strong>Mobile:</strong> ${user.mobile}<br>
      <strong>Address:</strong> ${user.address}<br>
      <strong>Email:</strong> ${user.email}<br>
      <strong>Ticket:</strong> ${user.ticket}`;
    dashboard.classList.remove("hidden");

    // === JOIN GROUP LINK ===
    document.getElementById("joinGroup").href =
      "https://chat.whatsapp.com/your-group-link";

    // === PDF Download ===
    document.getElementById("downloadTicket").onclick = async () => {
      console.log("Generating ticket for:", user.name);
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Load logo as base64
      const logoBase64 = await toBase64("assets/logo.png");

      // --- Header Box ---
      doc.setFillColor(20, 33, 61); // navy
      doc.rect(0, 0, 210, 40, "F");
      doc.addImage(logoBase64, "PNG", 15, 5, 25, 25);
      doc.setTextColor(255, 215, 0);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Royal Lottery Club", 60, 22);

      // --- Customer Info Box ---
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${user.name}`, 20, 55);
      doc.text(`Mobile: ${user.mobile}`, 20, 65);
      doc.text(`Address: ${user.address}`, 20, 75);
      doc.text(`Email: ${user.email}`, 20, 85);
      doc.text(`Ticket No: ${user.ticket}`, 20, 95);

      // --- Table ---
      doc.setDrawColor(0);
      doc.rect(15, 110, 180, 40);
      doc.text("Item", 25, 120);
      doc.text("Quantity", 90, 120);
      doc.text("Price", 150, 120);
      doc.line(15, 125, 195, 125);
      doc.text("Lottery Ticket", 25, 135);
      doc.text("1", 95, 135);
      doc.text("₹150", 150, 135);
      doc.line(15, 145, 195, 145);
      doc.text("Grand Total: ₹150", 130, 155);

      // --- Terms ---
      doc.setFontSize(11);
      doc.text("Terms & Conditions:", 20, 175);
      const terms = [
        "1. Ticket once sold cannot be refunded.",
        "2. Winners will be notified via registered mobile/email.",
        "3. Keep your ticket safe until the official draw.",
        "4. Misuse of details may lead to disqualification.",
        "5. Royal Lottery Club decisions are final.",
        "6. Must be 18 years or older to participate.",
      ];
      doc.text(terms.join("\n"), 20, 185);

      // --- Footer ---
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        "Thank you for joining Royal Lottery Club. Best of luck!",
        20,
        270
      );

      doc.save(`Royal_Lottery_Ticket_${user.ticket}.pdf`);
      console.log("PDF saved successfully!");
    };
  } else {
    popupText.innerText = "Invalid login. Please check your details.";
    popupMessage.classList.remove("hidden");
  }
};

// === Helper: Convert Image to Base64 ===
function toBase64(url) {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    )
    .catch((err) => {
      console.error("Error converting logo:", err);
      return "";
    });
}

// === ✅ Testimonials Carousel ===
const testimonials = document.querySelectorAll(".testimonial");
const navButtons = document.querySelectorAll(".testimonial-nav button");
let currentTestimonial = 0;

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.toggle("active", i === index);
    if (navButtons[i]) navButtons[i].classList.toggle("active", i === index);
  });
}

if (testimonials.length && navButtons.length) {
  // Auto rotate every 4s
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 4000);

  // Allow manual control
  navButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      currentTestimonial = index;
      showTestimonial(currentTestimonial);
    });
  });
}
