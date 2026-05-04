import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewProducts = ({ onEdit, onDuplicate, onAdd }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const { auth } = useAuth();

  const canAdd = auth?.user?.role?.permissions?.products?.add;
  const canEdit = auth?.user?.role?.permissions?.products?.edit;
  const canDelete = auth?.user?.role?.permissions?.products?.delete;

  const load = async () => {
    try {
      const res = await axios
        .get("https://shivaybackend.onrender.com/api/products")
        .catch(() => ({ data: [] }));

      const baseProducts = res.data || [];

      const productsWithVariants = await Promise.all(
        baseProducts.map(async (p) => {
          try {
            const detailRes = await axios
              .get(`https://shivaybackend.onrender.com/api/products/${p._id}`)
              .catch(() => ({ data: { variants: [] } }));

            return { ...p, variants: detailRes.data?.variants || [] };
          } catch (e) {
            return { ...p, variants: [] };
          }
        }),
      );
      setProducts(productsWithVariants);
      setFiltered(productsWithVariants);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (search) {
      const lowerQ = search.toLowerCase();
      setFiltered(
        products.filter((p) => {
          const titleMatch = p.title?.toLowerCase().includes(lowerQ);
          const variantMatch = p.variants?.[0]?.title
            ?.toLowerCase()
            .includes(lowerQ);
          return titleMatch || variantMatch;
        }),
      );
    } else {
      setFiltered(products);
    }
  }, [search, products]);

  const handleDelete = async (id) => {
    if (!canDelete) return toast.error("Permission Denied");
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `https://shivaybackend.onrender.com/api/products/delete/${id}`,
        );
        toast.success("Product deleted");
        load();
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleAction = (product, action) => {
    const sanitizedProduct = {
      ...product,
      category: product.category?._id || product.category || "",
      subcategory: product.subcategory?._id || product.subcategory || "",
    };

    if (action === "edit" && canEdit) onEdit(sanitizedProduct);

    if (action === "clone" && canAdd) {
      const cloneData = JSON.parse(JSON.stringify(sanitizedProduct));
      delete cloneData._id;
      onDuplicate(cloneData);
    }
  };

  const toggleStatus = async (product) => {
    if (!canEdit) return toast.error("Permission Denied");
    const newStatus = product.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(
        `https://shivaybackend.onrender.com/api/products/update/${product._id}`,
        { status: newStatus },
      );
      toast.success(`Marked as ${newStatus}`);
      load();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const s = {
    wrapper: {
      maxWidth: "1400px",
      margin: "0 auto",
      fontFamily: "'Inter', sans-serif",
      color: "var(--mern-admin-text-main)",
      background: "var(--mern-admin-bg)",
      padding: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
    },
    title: { fontSize: "24px", fontWeight: "700", margin: 0 },
    addBtn: {
      background: "var(--mern-admin-primary)",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      display: "flex",
      gap: "8px",
      alignItems: "center",
      fontSize: "14px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      borderRadius: "8px",
      overflow: "hidden",
    },
    th: {
      textAlign: "left",
      padding: "15px",
      borderBottom: "2px solid var(--mern-admin-border)",
      color: "#64748b",
      fontSize: "14px",
    },
    td: {
      padding: "15px",
      borderBottom: "1px solid var(--mern-admin-border)",
      verticalAlign: "top",
      fontSize: "14px",
    },
    imgBox: {
      width: "50px",
      height: "50px",
      borderRadius: "6px",
      objectFit: "cover",
    },
    productTitle: {
      fontWeight: "700",
      color: "var(--mern-admin-primary)",
      margin: "0 0 5px 0",
    },
    actionRow: {
      display: "flex",
      gap: "10px",
      fontSize: "12px",
      marginTop: "5px",
    },
    actionLink: (color) => ({
      color: color,
      cursor: "pointer",
      fontWeight: "600",
    }),
    badge: (status) => ({
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      background: status === "Active" ? "#d1fae5" : "#fee2e2",
      color: status === "Active" ? "#065f46" : "var(--mern-admin-danger)",
      cursor: "pointer",
    }),
  };

  return (
    <div style={s.wrapper} className="responsive-wrapper">
      <style>
        {`
          @media (max-width: 768px) {
            .responsive-header { 
              display: flex !important; 
              flex-direction: row !important; 
              justify-content: space-between !important; 
              align-items: center !important;
            }
            .responsive-header h2 { font-size: 20px !important; }
            .responsive-add-btn { padding: 8px 14px !important; width: auto !important; }

            .responsive-table thead { display: none; }
            .responsive-table tr { 
              display: block; 
              border: 1px solid #eee; 
              margin-bottom: 15px; 
              border-radius: 10px; 
              padding: 10px; 
            }
            .responsive-table td { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              border: none !important; 
              padding: 8px 0 !important;
              text-align: right;
            }
            .responsive-table td::before { 
              content: attr(data-label); 
              font-weight: 700; 
              color: #94a3b8; 
              font-size: 12px; 
              text-transform: uppercase;
            }
            .responsive-action-row { opacity: 1 !important; justify-content: flex-end; }
            .td-name-content { display: flex; flex-direction: column; align-items: flex-end; }
          }
        `}
      </style>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* FIXED HEADER BLOCK */}
      <div style={s.header} className="responsive-header">
        <h2 style={s.title}>Products</h2>
        {canAdd && (
          <button
            style={s.addBtn}
            className="responsive-add-btn"
            onClick={onAdd}
          >
            <FaPlus size={14} /> Add New
          </button>
        )}
      </div>

      <table style={s.table} className="responsive-table">
        <thead>
          <tr>
            <th style={s.th}>Image</th>
            <th style={s.th}>Name</th>
            <th style={s.th}>Variants</th>
            <th style={s.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => {
            const firstVariant = p.variants?.[0] || {};
            const displayImg = firstVariant.images?.[0]
              ? `http://localhost:5000${firstVariant.images[0]}`
              : "https://via.placeholder.com/50";
            const isHovered = hoveredRow === p._id;

            return (
              <tr
                key={p._id}
                onMouseEnter={() => setHoveredRow(p._id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  background: isHovered ? "#f8fafc" : "#fff",
                  transition: "0.2s",
                }}
              >
                <td style={s.td} data-label="Image">
                  <img src={displayImg} style={s.imgBox} alt="prod" />
                </td>
                <td style={s.td} data-label="Name">
                  <div className="td-name-content">
                    <p style={s.productTitle}>{p.title}</p>
                    <div
                      style={{ ...s.actionRow, opacity: isHovered ? 1 : 0 }}
                      className="responsive-action-row"
                    >
                      {canEdit && (
                        <span
                          style={s.actionLink("var(--mern-admin-primary)")}
                          onClick={() => handleAction(p, "edit")}
                        >
                          Edit
                        </span>
                      )}
                      {canEdit && canAdd && (
                        <span style={{ color: "#cbd5e1" }}>|</span>
                      )}
                      {canAdd && (
                        <span
                          style={s.actionLink("var(--mern-admin-text-main)")}
                          onClick={() => handleAction(p, "clone")}
                        >
                          Clone
                        </span>
                      )}
                      {(canEdit || canAdd) && canDelete && (
                        <span style={{ color: "#cbd5e1" }}>|</span>
                      )}
                      {canDelete && (
                        <span
                          style={s.actionLink("var(--mern-admin-danger)")}
                          onClick={() => handleDelete(p._id)}
                        >
                          Trash
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td style={s.td} data-label="Variants">
                  <span style={{ color: "#64748b" }}>
                    {p.variants?.length || 0} Variants
                  </span>
                </td>
                <td style={s.td} data-label="Status">
                  <span
                    style={s.badge(p.status || "Active")}
                    onClick={() => toggleStatus(p)}
                  >
                    {p.status || "Active"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ViewProducts;
