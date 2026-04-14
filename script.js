const STORAGE_KEYS = {
  cart: "athelgard_cart_v1"
};

const API_BASE = "/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const CATEGORY_META = {
  classic: {
    label: "Classic",
    accent: "#d7d1c4",
    dial: "#0e0e0e",
    dialSecondary: "#222222",
    strap: "#141414",
    tag: "Formal restraint",
    movement: "AG-02 automatic calibre regulated in five positions",
    materials: "316L steel, piano-black dial, polished dauphine hands, calfskin leather",
    story: "Designed for formal rooms and legacy settings where proportion matters more than spectacle."
  },
  sporty: {
    label: "Sporty",
    accent: "#c6ccd2",
    dial: "#090909",
    dialSecondary: "#1a1f24",
    strap: "#121212",
    tag: "Performance confidence",
    movement: "AG-Sport automatic calibre with reinforced rotor assembly",
    materials: "Brushed steel, high-contrast dial printing, articulated bracelet or technical strap",
    story: "Sharper shoulders, denser contrast, and a stronger stance for motion without visual noise."
  },
  vintage: {
    label: "Vintage",
    accent: "#d8cfb8",
    dial: "#15120f",
    dialSecondary: "#2a241d",
    strap: "#261d18",
    tag: "Patina-minded elegance",
    movement: "AG-Heritage automatic calibre with warm gilt detailing",
    materials: "Steel case, domed crystal effect, softened numerals, textured leather or woven strap",
    story: "References the romance of archival timing instruments while keeping the silhouette clean and current."
  }
};

const DEFAULT_WATCHES = [
  {
    id: "nocturne-classic",
    name: "Nocturne Classic",
    price: 12800,
    category: "classic",
    description: "A formal reference with deep black lacquer, knife-edge hands, and proportions tuned for evening wear.",
    tagline: "Architectural calm for the longest table in the room.",
    materials: "316L steel case, lacquer dial, diamond-polished dauphine hands, black calfskin strap",
    movement: "AG-02 automatic movement with a 38-hour reserve",
    designStory: "The Nocturne was drawn to look composed beneath low light. Its bezel is thin, its dial is quiet, and its silhouette leaves nothing competing with the wearer.",
    craftsmanship: "Each case is alternated between satin brushing and bright polished bevels, then hand-inspected for edge tension and dial alignment.",
    diameter: "39 mm",
    strap: "Black calfskin leather",
    reserve: "38 hours",
    waterResistance: "50 m",
    availability: "Private appointment"
  },
  {
    id: "regent-calendar",
    name: "Regent Calendar",
    price: 16800,
    category: "classic",
    description: "A composed calendar watch with sector-like balance, soft silver detailing, and quiet boardroom presence.",
    tagline: "Measured complication with the discipline of a dress reference.",
    materials: "Brushed steel, matte charcoal dial, silver calendar aperture, stitched alligator-grain strap",
    movement: "AG-08 automatic calendar calibre with semi-instant date change",
    designStory: "Regent Calendar places complication inside a calm visual field so the watch still reads as formal first and technical second.",
    craftsmanship: "The chapter ring, aperture frame, and applied indices are aligned by hand to preserve the symmetry that gives the dial its authority.",
    diameter: "40 mm",
    strap: "Alligator-grain leather",
    reserve: "42 hours",
    waterResistance: "50 m",
    availability: "Current house edit"
  },
  {
    id: "meridian-s",
    name: "Meridian S",
    price: 15400,
    category: "sporty",
    description: "A high-contrast sports watch with brushed shoulders, a compact bezel, and the confidence of a precision tool.",
    tagline: "Weekend energy without surrendering polish.",
    materials: "Brushed steel case, matte dial, luminous baton markers, integrated rubber-backed strap",
    movement: "AG-Sport automatic movement with anti-shock architecture",
    designStory: "Meridian S is tuned for acceleration. The hands are bolder, the contrast is cleaner, and the case sits with more forward pressure on the wrist.",
    craftsmanship: "The case features wide satin planes and disciplined polished breaks so the sporty stance remains refined rather than aggressive.",
    diameter: "41 mm",
    strap: "Hybrid performance strap",
    reserve: "44 hours",
    waterResistance: "200 m",
    availability: "Limited release"
  },
  {
    id: "apex-circuit",
    name: "Apex Circuit",
    price: 17900,
    category: "sporty",
    description: "An assertive chronograph-inspired silhouette defined by tension, traction, and grey-scale precision.",
    tagline: "Trackside rhythm, tailored for private clubs.",
    materials: "Steel case, layered anthracite dial, engraved rehaut, bracelet with brushed outer links",
    movement: "AG-Circuit automatic timing movement with reinforced crown system",
    designStory: "Apex Circuit nods to motorsport timing without falling into nostalgia. Its geometry is sharper, its dial depth is more technical, and its presence is unmistakably modern.",
    craftsmanship: "Multiple levels of dial finishing create depth without clutter, allowing the watch to feel engineered and ceremonial at once.",
    diameter: "42 mm",
    strap: "Brushed steel bracelet",
    reserve: "46 hours",
    waterResistance: "150 m",
    availability: "By allocation"
  },
  {
    id: "archive-1958",
    name: "Archive 1958",
    price: 13600,
    category: "vintage",
    description: "A warm, nostalgic reference with softened numerals, gilt accents, and the poise of a rediscovered heirloom.",
    tagline: "Memory in the metal, confidence in the proportions.",
    materials: "Steel case, warm charcoal dial, gilt minute track, tobacco leather strap",
    movement: "AG-Heritage automatic movement with decorated rotor",
    designStory: "Archive 1958 borrows the romance of old paddock chronographs while keeping the case thickness and stance crisp enough for contemporary wear.",
    craftsmanship: "Textured dial treatments and warm metallic detailing are balanced carefully so the watch feels storied rather than artificially distressed.",
    diameter: "38 mm",
    strap: "Tobacco calf leather",
    reserve: "40 hours",
    waterResistance: "100 m",
    availability: "Seasonal release"
  },
  {
    id: "monceau-sector",
    name: "Monceau Sector",
    price: 14700,
    category: "vintage",
    description: "A sector-dial study in restraint with domed cues, nuanced typography, and a gentleman-racer sensibility.",
    tagline: "Soft contrast for collectors who notice the smallest lines.",
    materials: "Steel case, sector dial, applied gilt signature, woven leather-backed strap",
    movement: "AG-Heritage automatic movement regulated for daily stability",
    designStory: "Monceau Sector is less about nostalgia and more about romance. It feels collected, kept, and passed on without ever appearing fragile.",
    craftsmanship: "Fine dial printing, softened chapter ring transitions, and careful crystal reflections give this reference its old-world dignity.",
    diameter: "39 mm",
    strap: "Espresso woven strap",
    reserve: "40 hours",
    waterResistance: "50 m",
    availability: "Current house edit"
  }
];

const state = {
  inventory: [],
  orders: [],
  adminSession: null
};

let revealObserver;

document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  setupRevealAnimations();
  bindGlobalEvents();
  updateCartCount();
  await initializeInventory();
  await routePage(document.body.dataset.page || "home");
});

async function initializeInventory() {
  try {
    state.inventory = await fetchWatches();
  } catch (error) {
    state.inventory = [];
    showToast("The catalogue could not be loaded from the server.");
  }
}

async function routePage(page) {
  switch (page) {
    case "home":
      renderHomeFeaturedProducts();
      break;
    case "collections":
      initializeCollectionsPage();
      break;
    case "product":
      initializeProductPage();
      break;
    case "cart":
      renderCartPage();
      break;
    case "checkout":
      initializeCheckoutPage();
      break;
    case "admin":
      await initializeAdminPage();
      break;
    case "login":
      await initializeLoginPage();
      break;
    default:
      break;
  }
}

function bindGlobalEvents() {
  document.addEventListener("click", async (event) => {
    const addToCartButton = event.target.closest("[data-add-to-cart]");
    if (addToCartButton) {
      addToCart(addToCartButton.dataset.addToCart);
      return;
    }

    const quantityButton = event.target.closest("[data-cart-qty]");
    if (quantityButton) {
      updateCartItemQuantity(quantityButton.dataset.cartQty, Number(quantityButton.dataset.delta));
      return;
    }

    const removeButton = event.target.closest("[data-remove-cart]");
    if (removeButton) {
      removeCartItem(removeButton.dataset.removeCart);
      return;
    }

    const removeInventoryButton = event.target.closest("[data-remove-watch]");
    if (removeInventoryButton) {
      await removeWatch(removeInventoryButton.dataset.removeWatch);
      return;
    }

    const resetInventoryButton = event.target.closest("[data-reset-inventory]");
    if (resetInventoryButton) {
      try {
        const response = await apiRequest("/admin/reset", { method: "POST" });
        state.inventory = response.watches || [];
        saveCart([]);
        refreshAllViews();
        renderAdminInventory();
        showToast("Inventory reset to the default house edit.");
      } catch (error) {
        handleAuthError(error);
        showToast(error.message || "Inventory reset failed.");
      }
      return;
    }

    const logoutButton = event.target.closest("[data-admin-logout]");
    if (logoutButton) {
      await logoutAdmin();
      saveCart([]);
      updateCartCount();
      return;
    }

    const updateStatusButton = event.target.closest("[data-update-order-status]");
    if (updateStatusButton) {
      await updateOrderStatus(updateStatusButton.dataset.updateOrderStatus);
    }
  });
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupRevealAnimations() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  syncRevealAnimations();
}

function syncRevealAnimations() {
  const targets = document.querySelectorAll(".reveal:not(.is-visible)");
  targets.forEach((target) => {
    if (revealObserver) {
      revealObserver.observe(target);
    } else {
      target.classList.add("is-visible");
    }
  });
}

function initializeCollectionsPage() {
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const urlFilter = (new URLSearchParams(window.location.search).get("filter") || "all").toLowerCase();
  let currentFilter = CATEGORY_META[urlFilter] ? urlFilter : "all";

  const applyFilter = (filter) => {
    currentFilter = filter;
    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === filter);
    });

    const query = new URLSearchParams(window.location.search);
    if (filter === "all") {
      query.delete("filter");
    } else {
      query.set("filter", filter);
    }

    const nextUrl = query.toString() ? `${window.location.pathname}?${query.toString()}` : window.location.pathname;
    window.history.replaceState({}, "", nextUrl);
    renderCollectionGrid(filter);
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });

  applyFilter(currentFilter);
}

function initializeProductPage() {
  const inventory = getInventory();
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");
  const currentWatch = inventory.find((watch) => watch.id === requestedId) || inventory[0];
  const detailContainer = document.querySelector("[data-product-detail]");
  const relatedContainer = document.querySelector("[data-related-products]");

  if (!detailContainer) {
    return;
  }

  if (!currentWatch) {
    detailContainer.innerHTML = createEmptyState(
      "No references are available.",
      "Use the private atelier to add watches back into the Athelgard catalogue.",
      "login.html",
      "Atelier Login"
    );
    return;
  }

  document.title = `${currentWatch.name} | Athelgard`;
  detailContainer.innerHTML = createProductDetailMarkup(currentWatch);

  const relatedWatches = inventory.filter((watch) => watch.id !== currentWatch.id).slice(0, 3);
  if (relatedContainer) {
    renderProductCards(relatedContainer, relatedWatches, {
      emptyTitle: "The rest of the house is still being prepared.",
      emptyBody: "Additional references will appear here as the catalogue grows."
    });
  }
}

function initializeCheckoutPage() {
  renderCheckoutSummary();
  const form = document.querySelector("[data-checkout-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const entries = buildCartEntries();
    if (!entries.length) {
      showToast("Your cart is empty. Add a reference before checkout.");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Processing...";
    }

    try {
      const formData = new FormData(form);
      const payload = buildOrderPayload(formData, entries);
      const response = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const fullName = String(formData.get("fullName") || "").trim();
      saveCart([]);
      updateCartCount();
      renderCheckoutSuccess(fullName || "Collector", response.orderId || "");
      showToast("Purchase confirmed. Athelgard concierge follow-up queued.");
    } catch (error) {
      showToast(error.message || "Checkout could not be completed.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Confirm Purchase";
      }
    }
  });
}

async function initializeAdminPage() {
  const session = await fetchAdminSession();
  if (!session.authenticated) {
    window.location.href = "/login.html?next=/admin.html";
    return;
  }

  state.adminSession = session;
  const sessionLabel = document.querySelector("[data-admin-session-label]");
  if (sessionLabel) {
    sessionLabel.textContent = session.username ? `Signed in as ${session.username}` : "Authenticated";
  }

  renderAdminInventory();
  await loadAdminOrders();
  renderAdminOrders();
  const form = document.querySelector("[data-admin-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(form);
      const payload = buildWatchFromAdminForm(formData);
      const response = await apiRequest("/admin/watches", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      state.inventory = [response.watch, ...state.inventory];
      form.reset();
      refreshAllViews();
      renderAdminInventory();
      showToast(`${response.watch.name} added to the catalogue.`);
    } catch (error) {
      handleAuthError(error);
      showToast(error.message || "The watch could not be saved.");
    }
  });
}

async function initializeLoginPage() {
  const session = await fetchAdminSession();
  if (session.authenticated) {
    window.location.href = "/admin.html";
    return;
  }

  const form = document.querySelector("[data-admin-login-form]");
  const feedback = document.querySelector("[data-login-feedback]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Entering...";
    }

    try {
      const formData = new FormData(form);
      const response = await apiRequest("/admin/login", {
        method: "POST",
        body: JSON.stringify({
          username: String(formData.get("username") || "").trim(),
          password: String(formData.get("password") || "")
        })
      });
      state.adminSession = response;
      if (feedback) {
        feedback.textContent = "Access granted. Redirecting to the private atelier...";
      }
      const nextPath = new URLSearchParams(window.location.search).get("next") || "/admin.html";
      window.location.href = nextPath;
    } catch (error) {
      if (feedback) {
        feedback.textContent = error.message || "The provided credentials were not accepted.";
      }
      showToast(error.message || "Login failed.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Enter Dashboard";
      }
    }
  });
}

function renderHomeFeaturedProducts() {
  const container = document.querySelector("[data-featured-products]");
  if (!container) {
    return;
  }
  renderProductCards(container, getInventory().slice(0, 3), {
    emptyTitle: "The house edit is currently empty.",
    emptyBody: "Add references through the private atelier to fill the showroom."
  });
}

function renderCollectionGrid(filter = "all") {
  const container = document.querySelector("[data-collection-grid]");
  if (!container) {
    return;
  }

  const inventory = getInventory();
  const filtered = filter === "all" ? inventory : inventory.filter((watch) => watch.category === filter);
  renderProductCards(container, filtered, {
    emptyTitle: "No references in this collection yet.",
    emptyBody: "Use the private atelier to add a watch in this category."
  });
}

function renderProductCards(container, watches, options = {}) {
  if (!watches.length) {
    container.innerHTML = createEmptyState(
      options.emptyTitle || "No watches available.",
      options.emptyBody || "The current catalogue has no references yet.",
      "login.html",
      "Atelier Login"
    );
    syncRevealAnimations();
    return;
  }

  container.innerHTML = watches.map((watch) => createProductCardMarkup(watch)).join("");
  syncRevealAnimations();
}

function renderCartPage() {
  const list = document.querySelector("[data-cart-items]");
  const summary = document.querySelector("[data-cart-summary]");
  if (!list || !summary) {
    return;
  }

  const entries = buildCartEntries();
  if (!entries.length) {
    list.innerHTML = createEmptyState(
      "Your selection tray is empty.",
      "Browse the current house edit and add the reference that feels most inevitable.",
      "collections.html",
      "Explore Collections"
    );
    summary.innerHTML = `
      <div class="summary-card">
        <h2>Order Summary</h2>
        <p class="summary-copy">Once you add a reference, pricing and the insured delivery total will appear here.</p>
      </div>
    `;
    syncRevealAnimations();
    return;
  }

  list.innerHTML = entries.map((entry) => createCartItemMarkup(entry)).join("");
  summary.innerHTML = createCartSummaryMarkup(entries);
  syncRevealAnimations();
}

function renderCheckoutSummary() {
  const container = document.querySelector("[data-checkout-summary]");
  if (!container) {
    return;
  }

  const entries = buildCartEntries();
  if (!entries.length) {
    container.innerHTML = `
      <div class="checkout-summary-card">
        <strong>Order Summary</strong>
        <h3>No references selected yet.</h3>
        <p>Return to the collections page, choose a watch, and the premium checkout summary will appear here.</p>
        <a class="button button-secondary" href="collections.html">Browse Collections</a>
      </div>
    `;
    return;
  }

  const { subtotal, totalItems } = calculateCartTotals(entries);
  const rows = entries.map((entry) => `
    <div class="checkout-summary-row">
      <span>${escapeHtml(entry.watch.name)} x ${entry.quantity}</span>
      <span>${formatPrice(entry.watch.price * entry.quantity)}</span>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="checkout-summary-card">
      <strong>Order Summary</strong>
      <h2>${totalItems} ${totalItems === 1 ? "Reference" : "References"}</h2>
      ${rows}
      <div class="checkout-summary-row">
        <span>Insured Delivery</span>
        <span>Included</span>
      </div>
      <div class="checkout-summary-row">
        <span>Total</span>
        <span class="summary-amount">${formatPrice(subtotal)}</span>
      </div>
      <p>Athelgard concierge confirms dispatch details immediately after purchase.</p>
    </div>
  `;
}

function renderCheckoutSuccess(fullName, orderId = "") {
  const form = document.querySelector("[data-checkout-form]");
  const summary = document.querySelector("[data-checkout-summary]");
  if (form) {
    form.innerHTML = `
      <div class="summary-card">
        <span class="summary-label">Order Confirmed</span>
        <h2>Thank you, ${escapeHtml(fullName.split(" ")[0] || fullName)}.</h2>
        <p class="summary-copy">
          Your order has been recorded. Athelgard concierge will follow up with insured delivery details and a final purchase confirmation.
        </p>
        ${orderId ? `<p class="summary-copy">Order reference: ${escapeHtml(orderId)}</p>` : ""}
        <div class="summary-actions">
          <a class="button button-primary" href="collections.html">Return to Collections</a>
          <a class="button button-secondary" href="about.html">Read the Craft Story</a>
        </div>
      </div>
    `;
  }
  if (summary) {
    summary.innerHTML = `
      <div class="checkout-summary-card">
        <strong>Next Step</strong>
        <h3>Concierge follow-up initiated.</h3>
        <p>Expect a tailored confirmation note with shipping timing, packaging details, and care guidance.</p>
      </div>
    `;
  }
}

function renderAdminInventory() {
  const container = document.querySelector("[data-admin-list]");
  if (!container) {
    return;
  }

  const inventory = getInventory();
  if (!inventory.length) {
    container.innerHTML = createEmptyState(
      "No catalogue references saved.",
      "Use the form to add the first Athelgard watch into the SQL catalogue.",
      "#",
      "Awaiting Inventory"
    );
    return;
  }

  container.innerHTML = inventory.map((watch) => `
    <article class="inventory-item">
      <div class="inventory-item-media">
        <img src="${getWatchImage(watch)}" alt="${escapeHtml(watch.name)} watch">
      </div>
      <div>
        <span class="inventory-badge">${escapeHtml(getCategoryLabel(watch.category))}</span>
        <h3>${escapeHtml(watch.name)}</h3>
        <p>${escapeHtml(watch.description)}</p>
      </div>
      <div class="inventory-item-footer">
        <strong>${formatPrice(watch.price)}</strong>
        <button type="button" data-remove-watch="${watch.id}">Remove</button>
      </div>
    </article>
  `).join("");
}

function renderAdminOrders() {
  const container = document.querySelector("[data-admin-orders]");
  if (!container) {
    return;
  }

  if (!state.orders.length) {
    container.innerHTML = createEmptyState(
      "No orders have been placed yet.",
      "Once a customer completes checkout, the order ledger and status controls will appear here.",
      "#",
      "Awaiting Orders"
    );
    return;
  }

  container.innerHTML = state.orders.map((order) => createOrderCardMarkup(order)).join("");
  syncRevealAnimations();
}

function refreshAllViews() {
  updateCartCount();
  const page = document.body.dataset.page;
  if (page === "home") {
    renderHomeFeaturedProducts();
  }
  if (page === "collections") {
    const activeFilter = document.querySelector(".filter-button.is-active")?.dataset.filter || "all";
    renderCollectionGrid(activeFilter);
  }
  if (page === "product") {
    initializeProductPage();
  }
  if (page === "cart") {
    renderCartPage();
  }
  if (page === "checkout") {
    renderCheckoutSummary();
  }
  if (page === "admin") {
    renderAdminInventory();
    renderAdminOrders();
  }
}

function addToCart(watchId) {
  const watch = getInventory().find((item) => item.id === watchId);
  if (!watch) {
    showToast("That reference is no longer available.");
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === watchId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: watchId, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  refreshAllViews();
  showToast(`${watch.name} added to your selection tray.`);
}

function updateCartItemQuantity(watchId, delta) {
  const cart = getCart();
  const entry = cart.find((item) => item.id === watchId);
  if (!entry) {
    return;
  }

  entry.quantity += delta;
  if (entry.quantity <= 0) {
    saveCart(cart.filter((item) => item.id !== watchId));
  } else {
    saveCart(cart);
  }

  updateCartCount();
  refreshAllViews();
}

function removeCartItem(watchId) {
  saveCart(getCart().filter((item) => item.id !== watchId));
  updateCartCount();
  refreshAllViews();
  showToast("Reference removed from your selection tray.");
}

async function removeWatch(watchId) {
  const inventory = getInventory();
  const watch = inventory.find((item) => item.id === watchId);
  try {
    await apiRequest(`/admin/watches/${encodeURIComponent(watchId)}`, {
      method: "DELETE"
    });
    state.inventory = inventory.filter((item) => item.id !== watchId);
    saveCart(getCart().filter((item) => item.id !== watchId));
    refreshAllViews();
    renderAdminInventory();
    showToast(`${watch ? watch.name : "Reference"} removed from the catalogue.`);
  } catch (error) {
    handleAuthError(error);
    showToast(error.message || "The watch could not be removed.");
  }
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = String(count);
  });
}

function createProductCardMarkup(watch) {
  return `
    <article class="product-card reveal">
      <a class="product-media" href="product.html?id=${encodeURIComponent(watch.id)}" aria-label="View ${escapeHtml(watch.name)}">
        <img src="${getWatchImage(watch)}" alt="${escapeHtml(watch.name)} watch">
      </a>
      <div class="product-card-header">
        <div>
          <p class="product-meta">${escapeHtml(getCategoryLabel(watch.category))}</p>
          <h3>${escapeHtml(watch.name)}</h3>
          <p>${escapeHtml(watch.tagline || watch.description)}</p>
        </div>
        <p class="product-price">${formatPrice(watch.price)}</p>
      </div>
      <div class="product-card-footer">
        <a class="product-link" href="product.html?id=${encodeURIComponent(watch.id)}">View Details</a>
        <button class="button button-secondary product-buy" type="button" data-add-to-cart="${watch.id}">Add to Cart</button>
      </div>
    </article>
  `;
}

function createProductDetailMarkup(watch) {
  const meta = CATEGORY_META[watch.category] || CATEGORY_META.classic;
  return `
    <section class="product-detail-layout reveal">
      <div class="detail-visual">
        <img src="${getWatchImage(watch)}" alt="${escapeHtml(watch.name)} watch">
      </div>
      <div class="detail-copy">
        <p class="product-meta">${escapeHtml(getCategoryLabel(watch.category))} Reference</p>
        <h1 class="product-title">${escapeHtml(watch.name)}</h1>
        <p class="detail-intro">${escapeHtml(watch.description)}</p>
        <p class="detail-price">${formatPrice(watch.price)}</p>
        <div class="detail-actions">
          <button class="button button-primary" type="button" data-add-to-cart="${watch.id}">Add to Cart</button>
          <a class="button button-secondary" href="mailto:concierge@athelgard.com?subject=${encodeURIComponent(`Enquiry for ${watch.name}`)}">Enquire</a>
        </div>
        <div class="spec-grid">
          <article class="spec-card">
            <p class="spec-label">Materials</p>
            <p class="spec-value">${escapeHtml(watch.materials)}</p>
          </article>
          <article class="spec-card">
            <p class="spec-label">Movement</p>
            <p class="spec-value">${escapeHtml(watch.movement)}</p>
          </article>
          <article class="spec-card">
            <p class="spec-label">Case Size</p>
            <p class="spec-value">${escapeHtml(watch.diameter)}</p>
          </article>
          <article class="spec-card">
            <p class="spec-label">Power Reserve</p>
            <p class="spec-value">${escapeHtml(watch.reserve)}</p>
          </article>
          <article class="spec-card">
            <p class="spec-label">Strap</p>
            <p class="spec-value">${escapeHtml(watch.strap)}</p>
          </article>
          <article class="spec-card">
            <p class="spec-label">Water Resistance</p>
            <p class="spec-value">${escapeHtml(watch.waterResistance)}</p>
          </article>
        </div>
      </div>
    </section>
    <section class="detail-grid section-spacing">
      <article class="detail-column reveal">
        <h3>Design Story</h3>
        <p>${escapeHtml(watch.designStory || meta.story)}</p>
      </article>
      <article class="detail-column reveal">
        <h3>Craftsmanship</h3>
        <p>${escapeHtml(watch.craftsmanship || "Each reference is assembled with a focus on proportional clarity, finishing consistency, and tactile confidence.")}</p>
      </article>
      <article class="detail-column reveal">
        <h3>House Perspective</h3>
        <p>${escapeHtml(meta.story)}</p>
      </article>
    </section>
  `;
}

function createCartItemMarkup(entry) {
  return `
    <article class="cart-item reveal">
      <div class="cart-thumb">
        <img src="${getWatchImage(entry.watch)}" alt="${escapeHtml(entry.watch.name)} watch">
      </div>
      <div>
        <p class="product-meta">${escapeHtml(getCategoryLabel(entry.watch.category))}</p>
        <h3>${escapeHtml(entry.watch.name)}</h3>
        <p>${escapeHtml(entry.watch.description)}</p>
        <div class="cart-item-controls">
          <div class="qty-control" aria-label="Quantity selector">
            <button type="button" data-cart-qty="${entry.watch.id}" data-delta="-1">-</button>
            <span>${entry.quantity}</span>
            <button type="button" data-cart-qty="${entry.watch.id}" data-delta="1">+</button>
          </div>
          <strong>${formatPrice(entry.watch.price * entry.quantity)}</strong>
        </div>
      </div>
      <button class="cart-remove" type="button" data-remove-cart="${entry.watch.id}">Remove</button>
    </article>
  `;
}

function createCartSummaryMarkup(entries) {
  const { subtotal, totalItems } = calculateCartTotals(entries);
  return `
    <div class="summary-card">
      <h2>Order Summary</h2>
      <div class="summary-row">
        <span>References</span>
        <span>${totalItems}</span>
      </div>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Insured Delivery</span>
        <span>Included</span>
      </div>
      <div class="summary-row summary-total">
        <span>Total</span>
        <span class="summary-amount">${formatPrice(subtotal)}</span>
      </div>
      <p class="summary-copy">Every order includes insured delivery, final regulation review, and concierge follow-up.</p>
      <div class="summary-actions">
        <a class="button button-primary" href="checkout.html">Proceed to Checkout</a>
        <a class="button button-secondary" href="collections.html">Continue Browsing</a>
      </div>
    </div>
  `;
}

function createOrderCardMarkup(order) {
  const itemsMarkup = Array.isArray(order.items) && order.items.length
    ? order.items.map((item) => `
      <div class="order-item-row">
        <div>
          <strong>${escapeHtml(item.watchName)}</strong>
          <p>${item.quantity} x ${formatPrice(item.unitPrice)}</p>
        </div>
        <p>${formatPrice(item.quantity * item.unitPrice)}</p>
      </div>
    `).join("")
    : `<p>No line items available for this order.</p>`;

  return `
    <article class="order-card reveal" data-order-id="${escapeHtml(order.id)}">
      <div class="order-card-head">
        <div>
          <p class="order-id">${escapeHtml(order.id)}</p>
          <h3>${escapeHtml(order.fullName)}</h3>
          <p>${escapeHtml(order.email)}</p>
        </div>
        <span class="status-badge" data-status="${escapeHtml(order.status)}">${escapeHtml(formatOrderStatus(order.status))}</span>
      </div>
      <div class="order-meta">
        <div class="order-meta-block">
          <span>Placed</span>
          <p>${escapeHtml(formatDateTime(order.createdAt))}</p>
        </div>
        <div class="order-meta-block">
          <span>Delivery</span>
          <p>${escapeHtml(order.delivery)}</p>
        </div>
        <div class="order-meta-block">
          <span>Total</span>
          <p>${formatPrice(order.totalAmount)}</p>
        </div>
        <div class="order-meta-block">
          <span>Payment</span>
          <p>${order.cardLast4 ? `Card ending ${escapeHtml(order.cardLast4)}` : "Card captured"}</p>
        </div>
      </div>
      <div class="order-items">
        <strong>Ordered References</strong>
        ${itemsMarkup}
      </div>
      <div class="order-card-foot">
        <div>
          <p>${escapeHtml(order.address)}, ${escapeHtml(order.city)}, ${escapeHtml(order.postalCode)}, ${escapeHtml(order.country)}</p>
        </div>
        <div class="order-status-controls">
          <label>
            <span>Update Status</span>
            <select data-order-status-select="${escapeHtml(order.id)}">
              ${["pending", "paid", "shipped", "delivered", "cancelled"].map((status) => `
                <option value="${status}" ${status === order.status ? "selected" : ""}>${formatOrderStatus(status)}</option>
              `).join("")}
            </select>
          </label>
          <button class="button button-secondary" type="button" data-update-order-status="${escapeHtml(order.id)}">Save Status</button>
        </div>
      </div>
    </article>
  `;
}

function createEmptyState(title, body, href, cta) {
  const linkMarkup = href === "#" ? "" : `<a class="button button-secondary" href="${href}">${cta}</a>`;
  return `
    <div class="empty-state reveal is-visible">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
      ${linkMarkup}
    </div>
  `;
}

function buildCartEntries() {
  const inventory = getInventory();
  const inventoryMap = new Map(inventory.map((watch) => [watch.id, watch]));
  const cart = getCart();
  const validEntries = cart
    .map((item) => {
      const watch = inventoryMap.get(item.id);
      if (!watch) {
        return null;
      }
      return { watch, quantity: item.quantity };
    })
    .filter(Boolean);

  if (validEntries.length !== cart.length) {
    saveCart(validEntries.map((entry) => ({ id: entry.watch.id, quantity: entry.quantity })));
  }

  return validEntries;
}

function calculateCartTotals(entries) {
  return entries.reduce((totals, entry) => {
    totals.totalItems += entry.quantity;
    totals.subtotal += entry.watch.price * entry.quantity;
    return totals;
  }, { totalItems: 0, subtotal: 0 });
}

function buildWatchFromAdminForm(formData) {
  return {
    name: String(formData.get("name") || "").trim(),
    price: Number(formData.get("price") || 0),
    category: String(formData.get("category") || "classic").toLowerCase(),
    image: String(formData.get("image") || "").trim(),
    description: String(formData.get("description") || "").trim()
  };
}

function getInventory() {
  return state.inventory;
}

function getCart() {
  return readStorage(STORAGE_KEYS.cart, []);
}

function saveCart(items) {
  const sanitized = items.filter((item) => item.quantity > 0);
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(sanitized));
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function buildOrderPayload(formData, entries) {
  return {
    fullName: String(formData.get("fullName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    postalCode: String(formData.get("postalCode") || "").trim(),
    country: String(formData.get("country") || "").trim(),
    delivery: String(formData.get("delivery") || "").trim(),
    cardNumber: String(formData.get("cardNumber") || "").replace(/\s+/g, ""),
    items: entries.map((entry) => ({
      id: entry.watch.id,
      quantity: entry.quantity
    }))
  };
}

async function loadAdminOrders() {
  try {
    state.orders = await fetchAdminOrders();
  } catch (error) {
    handleAuthError(error);
    state.orders = [];
    showToast(error.message || "Orders could not be loaded.");
  }
}

async function fetchWatches() {
  const response = await apiRequest("/watches");
  return Array.isArray(response.watches) ? response.watches : [];
}

async function fetchAdminOrders() {
  const response = await apiRequest("/admin/orders");
  return Array.isArray(response.orders) ? response.orders : [];
}

async function fetchAdminSession() {
  try {
    return await apiRequest("/admin/session");
  } catch (error) {
    return { authenticated: false };
  }
}

async function logoutAdmin() {
  try {
    await apiRequest("/admin/logout", { method: "POST" });
  } catch (error) {
    showToast(error.message || "Logout failed.");
  } finally {
    state.adminSession = null;
    window.location.href = "/login.html";
  }
}

async function updateOrderStatus(orderId) {
  const select = document.querySelector(`[data-order-status-select="${cssEscape(orderId)}"]`);
  if (!select) {
    return;
  }

  try {
    const response = await apiRequest(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: "POST",
      body: JSON.stringify({ status: select.value })
    });
    state.orders = state.orders.map((order) => order.id === orderId ? response.order : order);
    renderAdminOrders();
    showToast(`Order ${orderId} marked ${formatOrderStatus(select.value)}.`);
  } catch (error) {
    handleAuthError(error);
    showToast(error.message || "Order status could not be updated.");
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    credentials: "same-origin",
    body: options.body
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    const error = new Error(payload.error || `Request failed with status ${response.status}.`);
    error.status = response.status;
    throw error;
  }

  return payload;
}

function handleAuthError(error) {
  if (error && error.status === 401) {
    window.location.href = "/login.html?next=/admin.html";
  }
}

function formatOrderStatus(status) {
  const value = String(status || "").trim().toLowerCase();
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "Pending";
}

function formatDateTime(value) {
  if (!value) {
    return "Unknown";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(String(value));
  }
  return String(value).replace(/["\\]/g, "\\$&");
}

function getWatchImage(watch) {
  if (watch.image && String(watch.image).trim()) {
    return watch.image;
  }
  return createWatchSvg(watch);
}

function createWatchSvg(watch) {
  const meta = CATEGORY_META[watch.category] || CATEGORY_META.classic;
  const markers = Array.from({ length: 12 }, (_, index) => {
    const rotation = index * 30;
    return `
      <rect x="396" y="250" width="8" height="${index % 3 === 0 ? 34 : 20}" rx="4"
        fill="${meta.accent}" opacity="${index % 3 === 0 ? 0.92 : 0.62}"
        transform="rotate(${rotation} 400 500)" />
    `;
  }).join("");

  const sportyDetails = watch.category === "sporty"
    ? `
      <circle cx="332" cy="500" r="42" fill="none" stroke="${meta.accent}" stroke-opacity="0.45" stroke-width="5" />
      <circle cx="468" cy="500" r="42" fill="none" stroke="${meta.accent}" stroke-opacity="0.45" stroke-width="5" />
      <circle cx="400" cy="616" r="30" fill="none" stroke="${meta.accent}" stroke-opacity="0.36" stroke-width="4" />
    `
    : "";

  const vintageTrack = watch.category === "vintage"
    ? `<circle cx="400" cy="500" r="170" fill="none" stroke="${meta.accent}" stroke-opacity="0.34" stroke-width="8" stroke-dasharray="2 10" />`
    : "";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="${escapeXml(watch.name)}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#121212" />
          <stop offset="100%" stop-color="#050505" />
        </linearGradient>
        <linearGradient id="strap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${meta.strap}" />
          <stop offset="100%" stop-color="#050505" />
        </linearGradient>
        <linearGradient id="case" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#b2b2b2" stop-opacity="0.72" />
          <stop offset="50%" stop-color="#545454" stop-opacity="0.52" />
          <stop offset="100%" stop-color="#f0f0f0" stop-opacity="0.38" />
        </linearGradient>
        <linearGradient id="dial" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${meta.dialSecondary}" />
          <stop offset="100%" stop-color="${meta.dial}" />
        </linearGradient>
        <radialGradient id="shine" cx="35%" cy="24%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#bg)" />
      <g opacity="0.14">
        <path d="M0 840H800" stroke="#ffffff" />
        <path d="M0 160H800" stroke="#ffffff" />
        <path d="M120 0V1000" stroke="#ffffff" />
        <path d="M680 0V1000" stroke="#ffffff" />
      </g>
      <rect x="326" y="70" width="148" height="250" rx="34" fill="url(#strap)" />
      <rect x="326" y="680" width="148" height="250" rx="34" fill="url(#strap)" />
      <rect x="314" y="300" width="172" height="74" rx="32" fill="#090909" opacity="0.82" />
      <rect x="314" y="626" width="172" height="74" rx="32" fill="#090909" opacity="0.82" />
      <ellipse cx="400" cy="760" rx="170" ry="34" fill="#000000" opacity="0.32" />
      <circle cx="400" cy="500" r="230" fill="#040404" opacity="0.94" />
      <circle cx="400" cy="500" r="224" fill="url(#case)" />
      <circle cx="400" cy="500" r="192" fill="url(#dial)" stroke="${meta.accent}" stroke-opacity="0.18" stroke-width="6" />
      <circle cx="400" cy="500" r="160" fill="none" stroke="${meta.accent}" stroke-opacity="0.12" stroke-width="2" />
      ${vintageTrack}
      ${sportyDetails}
      <g>${markers}</g>
      <circle cx="400" cy="500" r="8" fill="${meta.accent}" />
      <rect x="398" y="356" width="4" height="148" rx="2" fill="${meta.accent}" transform="rotate(35 400 500)" />
      <rect x="397" y="410" width="6" height="190" rx="3" fill="${meta.accent}" transform="rotate(-58 400 500)" />
      <rect x="399" y="448" width="2" height="120" rx="1" fill="${meta.accent}" opacity="0.74" transform="rotate(92 400 500)" />
      <circle cx="400" cy="500" r="188" fill="url(#shine)" />
      <text x="400" y="438" fill="${meta.accent}" fill-opacity="0.9" text-anchor="middle" font-size="24" letter-spacing="10" font-family="Georgia, serif">ATHELGARD</text>
      <text x="400" y="575" fill="${meta.accent}" fill-opacity="0.74" text-anchor="middle" font-size="18" letter-spacing="5" font-family="Arial, sans-serif">${escapeXml(meta.label.toUpperCase())}</text>
      <text x="400" y="840" fill="${meta.accent}" fill-opacity="0.6" text-anchor="middle" font-size="22" letter-spacing="4" font-family="Georgia, serif">${escapeXml(watch.name.toUpperCase())}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function formatPrice(value) {
  return currencyFormatter.format(value || 0);
}

function getCategoryLabel(category) {
  return CATEGORY_META[category]?.label || "Classic";
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function showToast(message) {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("fade-out");
    window.setTimeout(() => toast.remove(), 260);
  }, 2800);
}
