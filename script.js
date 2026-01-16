// Data for the 6 Visual Outcomes
// Order: 5.1 -> 5.6
// Images are mapped: 5.1 = "final project 6.png" down to 5.6 = "final project 1.png"
const panelsData = [
  {
    id: "5.1",
    img: "final%20project%206.png",
    title: "The Empty Stage and Performed Authority",
    context: "UN / Netanyahu",
    desc: "Emptiness as atmosphere: harsh lighting, a lone figure, and a podium that stays authoritative even when engagement fractures."
  },
  {
    id: "5.2",
    img: "final%20project%205.png",
    title: "Media Control and the Puppet Stage",
    context: "Trump / Media",
    desc: "Symbolic interpretation: how repeated messaging can feel guided and staged, swinging between entertainment and crisis."
  },
  {
    id: "5.3",
    img: "final%20project%204.png",
    title: "Voting, Approval, and the Performance of Participation",
    context: "Mamdani",
    desc: "Approval staged through simplified symbols. Checkmarks compress complex decisions into visible legitimacy."
  },
  {
    id: "5.4",
    img: "final%20project%203.png",
    title: "The Veto and Distant Power",
    context: "UN / Gaza",
    desc: "Procedure above, destruction below. A raised hand under “VETO” becomes a small gesture with huge consequences."
  },
  {
    id: "5.5",
    img: "final%20project%202.png",
    title: "Promises, Redaction, and Performed Transparency",
    context: "Epstein Files",
    desc: "Promise versus access: information exists, but visibility is controlled through redaction and restriction."
  },
  {
    id: "5.6",
    img: "final%20project%201.png",
    title: "Removal from the Stage and Loss of Authority",
    context: "Maduro",
    desc: "The scene leaves the public stage for a controlled interior—surveillance, containment, and unsettling normalcy."
  }
];

const track = document.getElementById("track");
const container = document.getElementById("gallery-container");
const sticky = document.querySelector(".gallery-sticky");

// Modal Elements
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");
const closeBtn = document.querySelector(".modal-close");

// Initialize Gallery
function initGallery() {
  // Clear existing
  track.innerHTML = "";

  // Build DOM
  panelsData.forEach(item => {
    const panel = document.createElement("article");
    panel.className = "panel";
    
    // Image
    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.title;
    img.loading = "eager"; // Load early for smoother scroll
    
    // Caption Overlay
    const overlay = document.createElement("div");
    overlay.className = "caption-overlay";
    
    // Updated HTML structure for the new styling
    overlay.innerHTML = `
      <span class="caption-number">${item.id}</span>
      <h3 class="caption-title">${item.title}</h3>
      <p class="caption-text">${item.desc}</p>
    `;
    
    // Click to Open Modal
    panel.addEventListener("click", () => openModal(item));
    
    panel.appendChild(img);
    panel.appendChild(overlay);
    track.appendChild(panel);
  });
  
  // After DOM build, calculate sizes
  requestAnimationFrame(updateScrollDimensions);
}

// Modal Logic
function openModal(item) {
  modalImg.src = item.img;
  modalImg.alt = item.title;
  modalCaption.textContent = `${item.id} • ${item.title}`;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  // Wait for transition to finish before clearing src to avoid flicker
  setTimeout(() => {
    if (!modal.classList.contains("active")) {
       modalImg.src = ""; 
    }
  }, 300);
}

// Modal Event Listeners
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.closest('.modal-content') === null) {
      if (e.target !== closeBtn && !e.target.closest('img')) {
         closeModal();
      }
  }
});

// Close on background click (handled above) or specific elements
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});


// Scroll Logic
// We want to map the vertical scroll distance of the container to the horizontal translation of the track.
function updateScrollDimensions() {
  if (!track || !container) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate the total width of the track (scrolling content)
  // scrollWidth is accurate including gaps
  const trackWidth = track.scrollWidth;
  
  // The distance we need to translate horizontally
  // We stop when the right edge of the track hits the right edge of the screen
  // So total travel = trackWidth - viewportWidth
  const totalTravel = trackWidth - viewportWidth;
  
  // We want the user to scroll vertically by 'totalTravel' pixels to see the whole thing.
  // Plus we add 'viewportHeight' so there's a moment of static before/after or just for feel.
  // Actually, usually Height = Travel + ViewportHeight.
  // This means as the top of container hits top of viewport (start), we are at 0.
  // As bottom of container hits bottom of viewport (end), we are at max travel.
  container.style.height = `${totalTravel + viewportHeight}px`;
}

// Animation Loop
let currentScroll = 0;
let targetScroll = 0;

function animate() {
  if (!container || !sticky) return;

  // Get container position relative to viewport
  const rect = container.getBoundingClientRect();
  
  // Calculate how far we've scrolled into the container
  // -rect.top is 0 when container top is at viewport top
  const offset = -rect.top;
  
  const viewportWidth = window.innerWidth;
  const trackWidth = track.scrollWidth;
  const totalTravel = trackWidth - viewportWidth;
  
  // Clamped progress between 0 and totalTravel
  // We use the same 'totalTravel' logic as height to ensure 1:1 mapping
  const rawProgress = Math.max(0, Math.min(offset, totalTravel));
  
  // Apply transform
  // Translate negative X to move content left
  track.style.transform = `translate3d(${-rawProgress}px, 0, 0)`;
  
  requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener("load", () => {
  initGallery();
  updateScrollDimensions();
  animate();
});

window.addEventListener("resize", updateScrollDimensions);

// Initial Call
initGallery();
