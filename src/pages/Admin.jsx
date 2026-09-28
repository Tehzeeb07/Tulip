import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import { PRODUCTS } from "../data/products";
import "./Admin.css";

const OCCASIONS_LIST = [
  "Wedding",
  "Everyday",
  "Sympathy",
  "Events",
  "Vessels",
  "Wrapping",
  "Gift Sets",
  "Cards",
  "Tools",
];

const PRESET_SIZES = ["Petite", "Signature", "Grand", "Standard", "Small", "Medium", "Large"];

export default function Admin() {
  // Remote Convex queries & mutations
  const remoteUser = useQuery(api.users.getCurrentUser);
  const localAdmin = (() => {
    try {
      return JSON.parse(localStorage.getItem("tulip_admin_session"));
    } catch {
      return null;
    }
  })();
  const user = remoteUser || localAdmin;

  const setRole = useMutation(api.users.setRole);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const remoteProducts = useQuery(api.products.getProducts);
  const seedCatalog = useMutation(api.products.seedProducts);
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const updateProductPrice = useMutation(api.products.updateProductPrice);
  const toggleProductStock = useMutation(api.products.toggleProductStock);
  const deleteProduct = useMutation(api.products.deleteProduct);

  // Fallback to static catalog if DB is empty or still connecting
  const products = remoteProducts && remoteProducts.length > 0 ? remoteProducts : PRODUCTS;
  const isConvexConnected = remoteProducts !== undefined && remoteProducts.length > 0;

  const handleMakeAdmin = async () => {
    try {
      setIsUpdatingRole(true);
      await setRole({ role: "admin" });
      showToast("👑 Admin permissions granted to your account!");
    } catch (err) {
      showToast(`Error updating role: ${err.message}`, "error");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Local state filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  // Toast feedback
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Seeding loading state
  const [isSeeding, setIsSeeding] = useState(false);
  const handleSeed = async (force = false) => {
    try {
      setIsSeeding(true);
      const res = await seedCatalog({ force });
      showToast(
        `Catalog synced! ${res.inserted} inserted, ${res.updated} updated. Total: ${res.total} items.`,
        "success"
      );
    } catch (err) {
      showToast(`Sync failed: ${err.message}`, "error");
    } finally {
      setIsSeeding(false);
    }
  };

  // Inline editing prices
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [inlinePriceVal, setInlinePriceVal] = useState("");

  const handleStartEditPrice = (prod) => {
    setEditingPriceId(prod._id);
    setInlinePriceVal(prod.price.toString());
  };

  const handleSavePrice = async (prodId) => {
    const num = parseFloat(inlinePriceVal);
    if (isNaN(num) || num < 0) {
      showToast("Please enter a valid price", "error");
      return;
    }
    try {
      await updateProductPrice({ id: prodId, price: num });
      setEditingPriceId(null);
      showToast(`Price updated to $${num}`);
    } catch (err) {
      showToast(`Failed to update price: ${err.message}`, "error");
    }
  };

  // Toggle inStock
  const handleToggleStock = async (prod) => {
    try {
      const nextVal = prod.inStock === false ? true : false;
      await toggleProductStock({ id: prod._id, inStock: nextVal });
      showToast(
        `"${prod.name}" marked as ${nextVal ? "In Stock" : "Out of Stock"}`
      );
    } catch (err) {
      showToast(`Failed to update stock: ${err.message}`, "error");
    }
  };

  // Modal State for Add / Edit
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [modalData, setModalData] = useState({
    id: "",
    name: "",
    price: 150,
    desc: "",
    type: "bouquet",
    occasion: "Everyday",
    sizes: ["Petite", "Signature", "Grand"],
    image: "",
    images: [""],
    careTips: "",
    inStock: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open Add Modal
  const openAddModal = () => {
    setModalData({
      id: "",
      name: "",
      price: 120,
      desc: "",
      type: "bouquet",
      occasion: "Everyday",
      sizes: ["Petite", "Signature"],
      image: "",
      images: [""],
      careTips: "",
      inStock: true,
    });
    setModalMode("add");
  };

  // Open Edit Modal
  const openEditModal = (prod) => {
    setModalData({
      _id: prod._id,
      id: prod.id,
      name: prod.name,
      price: prod.price,
      desc: prod.desc || "",
      type: prod.type || "bouquet",
      occasion: prod.occasion || "Everyday",
      sizes: prod.sizes || ["Standard"],
      image: prod.image || "",
      images: prod.images && prod.images.length > 0 ? [...prod.images] : [prod.image || ""],
      careTips: prod.careTips || "",
      inStock: prod.inStock !== false,
    });
    setModalMode("edit");
  };

  // Save Add/Edit
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalData.name.trim() || !modalData.image.trim()) {
      showToast("Name and primary image are required.", "error");
      return;
    }
    const cleanImages = modalData.images.filter((img) => img.trim().length > 0);
    if (!cleanImages.includes(modalData.image.trim())) {
      cleanImages.unshift(modalData.image.trim());
    }

    setIsSubmitting(true);
    try {
      if (modalMode === "add") {
        await createProduct({
          id: modalData.id.trim() || undefined,
          name: modalData.name,
          price: Number(modalData.price),
          desc: modalData.desc,
          type: modalData.type,
          occasion: modalData.occasion,
          sizes: modalData.sizes,
          image: modalData.image.trim(),
          images: cleanImages,
          careTips: modalData.careTips,
          inStock: modalData.inStock,
        });
        showToast(`Created "${modalData.name}" successfully!`);
      } else {
        await updateProduct({
          id: modalData._id,
          name: modalData.name,
          price: Number(modalData.price),
          desc: modalData.desc,
          type: modalData.type,
          occasion: modalData.occasion,
          sizes: modalData.sizes,
          image: modalData.image.trim(),
          images: cleanImages,
          careTips: modalData.careTips,
          inStock: modalData.inStock,
        });
        showToast(`Updated "${modalData.name}" successfully!`);
      }
      setModalMode(null);
    } catch (err) {
      showToast(`Error saving product: ${err.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct({ id: deleteTarget._id });
      showToast(`Deleted "${deleteTarget.name}".`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          search === "" ||
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.desc?.toLowerCase().includes(search.toLowerCase()) ||
          p.id?.toLowerCase().includes(search.toLowerCase()) ||
          p.occasion?.toLowerCase().includes(search.toLowerCase());

        const matchesType =
          typeFilter === "all" || p.type === typeFilter;

        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "inStock" && p.inStock !== false) ||
          (stockFilter === "outOfStock" && p.inStock === false);

        return matchesSearch && matchesType && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, search, typeFilter, stockFilter, sortBy]);

  // Metrics
  const totalCount = products.length;
  const bouquetCount = products.filter((p) => p.type === "bouquet").length;
  const accessoryCount = products.filter((p) => p.type === "accessory").length;
  const outOfStockCount = products.filter((p) => p.inStock === false).length;

  // Auth & Role Access Guards
  if (user === null) {
    return (
      <>
        <Navbar />
        <div className="admin-page">
          <div className="admin-wrap">
            <div className="admin-auth-guard-card">
              <div className="guard-icon">🔐</div>
              <h2>Florist Admin Sign In Required</h2>
              <p>
                You must be logged in as an Administrator to view and modify product pricing, imagery, and stock levels.
              </p>
              <div className="guard-actions">
                <Link to="/login?redirect=/admin" className="admin-btn admin-btn-primary">
                  Sign in as Admin
                </Link>
                <Link to="/bouquets" className="admin-btn admin-btn-secondary">
                  Browse Flower Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (user && !user.isAdmin) {
    return (
      <>
        <Navbar />
        <div className="admin-page">
          <div className="admin-wrap">
            <div className="admin-auth-guard-card">
              <div className="guard-icon">🌸</div>
              <h2>Customer Account Detected</h2>
              <p>
                You are currently signed in as <strong>{user.email || user.username}</strong> (Customer).
                Studio inventory and price editing are reserved for administrative staff.
              </p>
              <div className="guard-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={handleMakeAdmin}
                  disabled={isUpdatingRole}
                >
                  {isUpdatingRole ? "Activating..." : "👑 Grant My Account Admin Access"}
                </button>
                <Link to="/bouquets" className="admin-btn admin-btn-secondary">
                  Return to Storefront
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <div className="admin-wrap">
          {/* Toast message */}
          {toast && (
            <div className={`admin-toast ${toast.type}`}>
              <span>{toast.type === "success" ? "✓" : "⚠️"}</span>
              <span>{toast.msg}</span>
            </div>
          )}

          {/* Header */}
          <header className="admin-header">
            <div>
              <div className="admin-badge-row">
                <span className="admin-tag">STUDIO BACKOFFICE</span>
                {user?.isAdmin && (
                  <span className="admin-user-pill">
                    👑 {user.username || user.email || "Admin"}
                  </span>
                )}
                <span className={`admin-status-dot ${isConvexConnected ? "connected" : "connecting"}`}>
                  {isConvexConnected ? "Connected: tangible-ibis-791" : "Connecting to Convex..."}
                </span>
              </div>
              <h1 className="admin-title">Catalog & Inventory Management</h1>
              <p className="admin-subtitle">
                Manage live florist inventory, modify prices, configure pictures, and toggle stock in real time.
              </p>
            </div>

            <div className="admin-header-actions">
              <button
                type="button"
                className="admin-btn admin-btn-seed"
                onClick={() => handleSeed(false)}
                disabled={isSeeding}
                title="Migrate default bouquet and accessory data to remote Convex"
              >
                {isSeeding ? "Syncing..." : "🔄 Seed / Sync Database"}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={openAddModal}
              >
                + Add New Product
              </button>
            </div>
          </header>

          {/* KPI Analytics Row */}
          <section className="admin-metrics-grid">
            <div className="admin-metric-card">
              <span className="metric-label">Total Inventory</span>
              <span className="metric-val">{totalCount}</span>
              <span className="metric-hint">Items in Convex DB</span>
            </div>
            <div className="admin-metric-card">
              <span className="metric-label">Bouquets</span>
              <span className="metric-val">{bouquetCount}</span>
              <span className="metric-hint">Artisanal arrangements</span>
            </div>
            <div className="admin-metric-card">
              <span className="metric-label">Accessories & Gifts</span>
              <span className="metric-val">{accessoryCount}</span>
              <span className="metric-hint">Vessels, cards, shears</span>
            </div>
            <div className="admin-metric-card">
              <span className="metric-label">Out of Stock</span>
              <span className={`metric-val ${outOfStockCount > 0 ? "text-amber" : ""}`}>
                {outOfStockCount}
              </span>
              <span className="metric-hint">Currently unavailable</span>
            </div>
          </section>

          {/* Prompt if table is empty */}
          {products.length === 0 && isConvexConnected && (
            <div className="admin-empty-callout">
              <div className="empty-callout-icon">🌸</div>
              <h3>Your Convex database has no products yet</h3>
              <p>
                Click below to instantly migrate all 31 hardcoded bouquets and accessories into Convex table <code>products</code>.
              </p>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() => handleSeed(true)}
                disabled={isSeeding}
              >
                {isSeeding ? "Populating Database..." : "🚀 Migrate Hardcoded Products to Convex"}
              </button>
            </div>
          )}

          {/* Control Bar: Search & Filters */}
          <div className="admin-control-bar">
            <div className="admin-search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by flower name, description, occasion, or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
              />
              {search && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearch("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="admin-filter-group">
              <div className="select-wrapper">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Types</option>
                  <option value="bouquet">Bouquets Only</option>
                  <option value="accessory">Accessories Only</option>
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Stock Status</option>
                  <option value="inStock">In Stock Only</option>
                  <option value="outOfStock">Out of Stock Only</option>
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="admin-select"
                >
                  <option value="default">Default Sort</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              <div className="view-mode-toggles">
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid Card View"
                >
                  ⊞
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                  title="Compact Table View"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="admin-results-meta">
            <span>
              Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            </span>
            {(search || typeFilter !== "all" || stockFilter !== "all") && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setStockFilter("all");
                }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Main Catalog View: Grid */}
          {viewMode === "grid" && (
            <div className="admin-grid">
              {filteredProducts.map((p) => {
                const isEditingThisPrice = editingPriceId === p._id;
                const isOutOfStock = p.inStock === false;
                const imageCount = p.images?.length || 1;

                return (
                  <article key={p._id || p.id} className={`admin-card ${isOutOfStock ? "out-of-stock" : ""}`}>
                    <div className="admin-card-img-wrap">
                      <img
                        src={p.image || (p.images && p.images[0])}
                        alt={p.name}
                        className="admin-card-img"
                        onError={(e) => {
                          e.target.src = "/images/products/marchesa.jpg";
                        }}
                      />
                      <div className="admin-img-badges">
                        <span className="admin-type-pill">{p.type}</span>
                        {imageCount > 1 && (
                          <span className="admin-angle-pill">📷 {imageCount} angles</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className={`admin-stock-badge ${isOutOfStock ? "badge-out" : "badge-in"}`}
                        onClick={() => handleToggleStock(p)}
                        title="Click to toggle In Stock / Out of Stock"
                      >
                        {isOutOfStock ? "Out of Stock" : "In Stock"}
                      </button>
                    </div>

                    <div className="admin-card-body">
                      <div className="admin-card-meta">
                        <span className="admin-occasion-tag">{p.occasion || "Floral"}</span>
                        <span className="admin-slug-id">#{p.id}</span>
                      </div>

                      <h3 className="admin-card-title">
                        <Link to={`/product/${p.id}`} target="_blank" title="View live product page">
                          {p.name} ↗
                        </Link>
                      </h3>
                      <p className="admin-card-desc">{p.desc}</p>

                      {p.sizes && p.sizes.length > 0 && (
                        <div className="admin-sizes-row">
                          {p.sizes.map((s) => (
                            <span key={s} className="admin-size-pill">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Inline Price Editor */}
                      <div className="admin-price-row">
                        <span className="price-label">Live Price:</span>
                        {isEditingThisPrice ? (
                          <div className="inline-price-input-wrap">
                            <span className="currency">$</span>
                            <input
                              type="number"
                              className="inline-price-input"
                              value={inlinePriceVal}
                              onChange={(e) => setInlinePriceVal(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSavePrice(p._id);
                                if (e.key === "Escape") setEditingPriceId(null);
                              }}
                              autoFocus
                            />
                            <button
                              type="button"
                              className="inline-save-btn"
                              onClick={() => handleSavePrice(p._id)}
                              title="Save price"
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              className="inline-cancel-btn"
                              onClick={() => setEditingPriceId(null)}
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="price-display-wrap"
                            onClick={() => handleStartEditPrice(p)}
                            title="Click to edit price"
                          >
                            <span className="admin-price-val">${p.price}</span>
                            <span className="admin-price-edit-icon">✏️</span>
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="admin-card-footer">
                        <button
                          type="button"
                          className="admin-action-btn edit-btn"
                          onClick={() => openEditModal(p)}
                        >
                          Edit Details
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn delete-btn"
                          onClick={() => setDeleteTarget(p)}
                          title="Delete product"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Main Catalog View: Table */}
          {viewMode === "table" && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Occasion</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const isEditingThisPrice = editingPriceId === p._id;
                    const isOutOfStock = p.inStock === false;

                    return (
                      <tr key={p._id || p.id} className={isOutOfStock ? "row-out-of-stock" : ""}>
                        <td className="table-item-cell">
                          <img
                            src={p.image || (p.images && p.images[0])}
                            alt={p.name}
                            className="table-thumb"
                            onError={(e) => {
                              e.target.src = "/images/products/marchesa.jpg";
                            }}
                          />
                          <div>
                            <Link to={`/product/${p.id}`} target="_blank" className="table-item-name">
                              {p.name}
                            </Link>
                            <div className="table-item-slug">#{p.id}</div>
                          </div>
                        </td>
                        <td>
                          <span className="admin-type-pill">{p.type}</span>
                        </td>
                        <td>
                          <span className="admin-occasion-tag">{p.occasion || "—"}</span>
                        </td>
                        <td>
                          {isEditingThisPrice ? (
                            <div className="inline-price-input-wrap">
                              <span className="currency">$</span>
                              <input
                                type="number"
                                className="inline-price-input"
                                value={inlinePriceVal}
                                onChange={(e) => setInlinePriceVal(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSavePrice(p._id);
                                  if (e.key === "Escape") setEditingPriceId(null);
                                }}
                                autoFocus
                              />
                              <button
                                type="button"
                                className="inline-save-btn"
                                onClick={() => handleSavePrice(p._id)}
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <div
                              className="price-display-wrap"
                              onClick={() => handleStartEditPrice(p)}
                              title="Click to edit price"
                            >
                              <span className="admin-price-val">${p.price}</span>
                              <span className="admin-price-edit-icon">✏️</span>
                            </div>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`admin-stock-badge ${isOutOfStock ? "badge-out" : "badge-in"}`}
                            onClick={() => handleToggleStock(p)}
                          >
                            {isOutOfStock ? "Out of Stock" : "In Stock"}
                          </button>
                        </td>
                        <td>
                          <span className="table-img-count">
                            📷 {p.images?.length || 1}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="admin-action-btn edit-btn"
                              onClick={() => openEditModal(p)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn delete-btn"
                              onClick={() => setDeleteTarget(p)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalMode && (
        <div className="admin-modal-backdrop" onClick={() => setModalMode(null)}>
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="admin-modal-header">
              <h2>{modalMode === "add" ? "Create New Product" : `Edit "${modalData.name}"`}</h2>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalMode(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="admin-modal-form">
              <div className="form-grid">
                {/* Product Name */}
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={modalData.name}
                    placeholder="e.g. Florentine Blush"
                    onChange={(e) => {
                      const name = e.target.value;
                      const next = { ...modalData, name };
                      if (modalMode === "add" && !modalData.id) {
                        next.id = name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "");
                      }
                      setModalData(next);
                    }}
                  />
                </div>

                {/* Slug Identifier */}
                <div className="form-group">
                  <label>URL Slug / ID</label>
                  <input
                    type="text"
                    value={modalData.id}
                    placeholder="e.g. florentine-blush"
                    disabled={modalMode === "edit"}
                    onChange={(e) => setModalData({ ...modalData, id: e.target.value })}
                  />
                  <small className="form-hint">Used in product URL: /product/{modalData.id || "item"}</small>
                </div>

                {/* Type */}
                <div className="form-group">
                  <label>Product Type *</label>
                  <select
                    value={modalData.type}
                    onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
                  >
                    <option value="bouquet">Bouquet (Fresh Flowers)</option>
                    <option value="accessory">Accessory & Gift</option>
                  </select>
                </div>

                {/* Occasion / Category */}
                <div className="form-group">
                  <label>Occasion / Category</label>
                  <input
                    list="occasion-suggestions"
                    value={modalData.occasion}
                    placeholder="e.g. Wedding, Everyday, Vessels"
                    onChange={(e) => setModalData({ ...modalData, occasion: e.target.value })}
                  />
                  <datalist id="occasion-suggestions">
                    {OCCASIONS_LIST.map((occ) => (
                      <option key={occ} value={occ} />
                    ))}
                  </datalist>
                </div>

                {/* Price */}
                <div className="form-group">
                  <label>Base Price ($ USD) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={modalData.price}
                    onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
                  />
                </div>

                {/* In Stock Toggle */}
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={modalData.inStock}
                      onChange={(e) => setModalData({ ...modalData, inStock: e.target.checked })}
                    />
                    <span>Available / In Stock for Ordering</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label>Floral Composition / Short Description</label>
                <input
                  type="text"
                  value={modalData.desc}
                  placeholder="e.g. Garden roses, white ranunculus, eucalyptus"
                  onChange={(e) => setModalData({ ...modalData, desc: e.target.value })}
                />
              </div>

              {/* Available Sizes */}
              <div className="form-group full-width">
                <label>Available Sizes</label>
                <div className="size-selector-row">
                  {PRESET_SIZES.map((sz) => {
                    const isSelected = modalData.sizes?.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        className={`size-toggle-pill ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          const current = modalData.sizes || [];
                          const updated = isSelected
                            ? current.filter((s) => s !== sz)
                            : [...current, sz];
                          setModalData({ ...modalData, sizes: updated });
                        }}
                      >
                        {sz} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Image URL */}
              <div className="form-group full-width">
                <label>Primary Display Image URL *</label>
                <div className="image-input-row">
                  <input
                    type="text"
                    required
                    value={modalData.image}
                    placeholder="/images/products/my-bouquet.jpg or https://..."
                    onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                  />
                  {modalData.image && (
                    <img
                      src={modalData.image}
                      alt="Preview"
                      className="form-img-preview"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>
              </div>

              {/* Additional Angles Gallery */}
              <div className="form-group full-width">
                <div className="gallery-header-row">
                  <label>Additional Angle Photos (Shuffled Views)</label>
                  <button
                    type="button"
                    className="add-angle-btn"
                    onClick={() =>
                      setModalData({
                        ...modalData,
                        images: [...modalData.images, ""],
                      })
                    }
                  >
                    + Add Angle URL
                  </button>
                </div>

                <div className="angles-inputs-list">
                  {modalData.images.map((imgUrl, idx) => (
                    <div key={idx} className="angle-input-row">
                      <span className="angle-idx">#{idx + 1}</span>
                      <input
                        type="text"
                        value={imgUrl}
                        placeholder={`Angle ${idx + 1} image URL...`}
                        onChange={(e) => {
                          const nextImages = [...modalData.images];
                          nextImages[idx] = e.target.value;
                          setModalData({ ...modalData, images: nextImages });
                        }}
                      />
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={`Angle ${idx + 1}`}
                          className="form-img-preview"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                      {modalData.images.length > 1 && (
                        <button
                          type="button"
                          className="remove-angle-btn"
                          onClick={() => {
                            const nextImages = modalData.images.filter((_, i) => i !== idx);
                            setModalData({ ...modalData, images: nextImages });
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Care Tips */}
              <div className="form-group full-width">
                <label>Botanical Care Tips</label>
                <textarea
                  rows="3"
                  value={modalData.careTips}
                  placeholder="e.g. Trim stems at an angle every 2 days and change water daily..."
                  onChange={(e) => setModalData({ ...modalData, careTips: e.target.value })}
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setModalMode(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : modalMode === "add"
                    ? "Create Product"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div
            className="admin-modal delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
          >
            <div className="delete-icon-wrap">🗑️</div>
            <h2>Delete "{deleteTarget.name}"?</h2>
            <p>
              Are you sure you want to remove this product from the Convex database? Customers will no longer be able to browse or order this arrangement.
            </p>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Keep Product
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
