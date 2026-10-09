const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const toast = document.getElementById("toast");
let toastTimer;

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3800);
}

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".vehicle-card");
filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(button => button.classList.remove("active"));
    filter.classList.add("active");
    const type = filter.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle("hidden", type !== "All" && card.dataset.type !== type);
    });
  });
});

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const pickup = document.getElementById("pickupDate");
const returned = document.getElementById("returnDate");
pickup.min = localDate;
returned.min = localDate;
pickup.value = localDate;
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
returned.value = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

pickup.addEventListener("change", () => {
  returned.min = pickup.value || localDate;
  if (returned.value && pickup.value && returned.value < pickup.value) returned.value = pickup.value;
});

document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  const start = pickup.value;
  const end = returned.value;
  const type = document.getElementById("vehicleType").value;
  if (!start || !end) {
    showToast("Please choose both pickup and return dates.");
    return;
  }
  if (end < start) {
    showToast("Return date must be on or after the pickup date.");
    returned.focus();
    return;
  }
  const count = [...cards].filter(card => !card.classList.contains("hidden") &&
    (type === "Any vehicle" || card.dataset.type === type)).length;
  // Show the matching category and direct the visitor to the available vehicle cards.
  filters.forEach(button => button.classList.toggle("active", button.dataset.filter === (type === "Any vehicle" ? "All" : type)));
  cards.forEach(card => card.classList.toggle("hidden", type !== "Any vehicle" && card.dataset.type !== type));
  document.getElementById("vehicles").scrollIntoView({ behavior: "smooth" });
  showToast(`${count} vehicle option${count === 1 ? "" : "s"} shown for ${type.toLowerCase()}. Contact RideEase to confirm availability.`);
});

document.querySelectorAll(".card-book").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("vehicleType").value = button.dataset.vehicle;
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    showToast(`${button.dataset.vehicle} selected. Choose your dates to continue.`);
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
