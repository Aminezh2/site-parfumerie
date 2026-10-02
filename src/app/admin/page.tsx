"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PerfumeItem, OrderItem, SupportMessage } from "@/lib/db";
import {
  ShoppingBag,
  PlusCircle,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Search,
  Upload,
  Trash2,
  Edit,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "add-product" | "add-pack" | "inventory" | "support">("orders");

  const [products, setProducts] = useState<PerfumeItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [supportLoading, setSupportLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form State for Adding Perfume
  const [newPerfume, setNewPerfume] = useState({
    name: "",
    brand: "",
    category: "homme" as "homme" | "femme" | "unisexe",
    type: "Eau de Parfum",
    family: "Parfum Original",
    image: "",       // Couverture (carte)
    image5ml: "",   // Photo flacon 5ml
    image10ml: "",  // Photo flacon 10ml
    price5ml: "",
    price10ml: "",
    oldPrice5ml: "",
    oldPrice10ml: "",
    isPromo: false,
    inStock: true,
    badge: "",
    description: "",
  });

  // Form State for Adding Pack
  const [newPack, setNewPack] = useState({
    name: "",
    brand: "",
    description: "",
    image: "",
    packPrice: "",
    contents: "",
    inStock: true,
    badge: "Pack Exclusif",
  });
  const [uploadingPackImage, setUploadingPackImage] = useState(false);
  const [packImagePreview, setPackImagePreview] = useState<string>("");
  // Cover image
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  // 5ml image
  const [uploadingImage5ml, setUploadingImage5ml] = useState(false);
  const [imagePreview5ml, setImagePreview5ml] = useState<string>("");
  // 10ml image
  const [uploadingImage10ml, setUploadingImage10ml] = useState(false);
  const [imagePreview10ml, setImagePreview10ml] = useState<string>("");

  // Filters for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");

  // Filters for Inventory
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>("all");
  const [inventorySearchQuery, setInventorySearchQuery] = useState<string>("");

  // Editing state for inventory
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editBrand, setEditBrand] = useState<string>("");
  const [editPrice5ml, setEditPrice5ml] = useState<string>("");
  const [editPrice10ml, setEditPrice10ml] = useState<string>("");
  const [editOldPrice5ml, setEditOldPrice5ml] = useState<string>("");
  const [editOldPrice10ml, setEditOldPrice10ml] = useState<string>("");
  const [editIsPromo, setEditIsPromo] = useState<boolean>(false);
  const [editImage, setEditImage] = useState<string>("");
  const [editImage5ml, setEditImage5ml] = useState<string>("");
  const [editImage10ml, setEditImage10ml] = useState<string>("");

  // Fetch Data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resOrd] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);
      if (resProd.ok) setProducts(await resProd.json());
      if (resOrd.ok) setOrders(await resOrd.json());
    } catch (err) {
      showNotification("Erreur lors de la récupération des données", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSupport = async (silent = false) => {
    if (!silent) setSupportLoading(true);
    try {
      const res = await fetch("/api/support", { cache: "no-store" });
      if (res.ok) setSupportMessages(await res.json());
    } catch {
      if (!silent) showNotification("Erreur de chargement du support", "error");
    } finally {
      if (!silent) setSupportLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "support") {
      fetchSupport();
      const interval = setInterval(() => {
        fetchSupport(true);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReply = async (id: string, content: string) => {
    try {
      const res = await fetch(`/api/support/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        showNotification("Réponse envoyée");
        fetchSupport();
      }
    } catch (err) { showNotification("Erreur", "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    try {
      const res = await fetch(`/api/support/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Message supprimé");
        fetchSupport();
      }
    } catch (err) { showNotification("Erreur", "error"); }
  };

  // Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Upload to server
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setNewPerfume((prev) => ({ ...prev, image: data.url }));
        showNotification("Image téléchargée avec succès !");
      } else {
        showNotification("Erreur lors du téléchargement de l'image", "error");
      }
    } catch (err) {
      showNotification("Erreur de connexion lors de l'upload", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageFile5mlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview5ml(URL.createObjectURL(file));
    setUploadingImage5ml(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setNewPerfume((prev) => ({ ...prev, image5ml: data.url }));
        showNotification("Photo 5ml téléchargée avec succès !");
      } else {
        showNotification("Erreur lors du téléchargement 5ml", "error");
      }
    } catch (err) {
      showNotification("Erreur de connexion lors de l'upload 5ml", "error");
    } finally {
      setUploadingImage5ml(false);
    }
  };

  const handleImageFile10mlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview10ml(URL.createObjectURL(file));
    setUploadingImage10ml(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setNewPerfume((prev) => ({ ...prev, image10ml: data.url }));
        showNotification("Photo 10ml téléchargée avec succès !");
      } else {
        showNotification("Erreur lors du téléchargement 10ml", "error");
      }
    } catch (err) {
      showNotification("Erreur de connexion lors de l'upload 10ml", "error");
    } finally {
      setUploadingImage10ml(false);
    }
  };

  // Submit New Product
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const p5 = Number(newPerfume.price5ml) || 0;
    const p10 = Number(newPerfume.price10ml) || 0;

    if (!newPerfume.name || (p5 <= 0 && p10 <= 0)) {
      showNotification("Veuillez remplir au moins le nom et le prix d'un format (5ml ou 10ml)", "error");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPerfume,
          brand: newPerfume.brand || "Parfum Original",
          image: newPerfume.image || "/assets/images/dior.jpg",
          price5ml: p5,
          price10ml: p10,
          oldPrice5ml: newPerfume.oldPrice5ml ? Number(newPerfume.oldPrice5ml) : undefined,
          oldPrice10ml: newPerfume.oldPrice10ml ? Number(newPerfume.oldPrice10ml) : undefined,
          isPromo: newPerfume.isPromo || Boolean(newPerfume.oldPrice5ml || newPerfume.oldPrice10ml),
        }),
      });

      if (res.ok) {
        showNotification(`Parfum "${newPerfume.name}" ajouté avec succès à la section ${newPerfume.category.toUpperCase()} !`);
        setNewPerfume({
          name: "",
          brand: "",
          category: "homme",
          type: "Eau de Parfum",
          family: "Parfum Original",
          image: "",
          image5ml: "",
          image10ml: "",
          price5ml: "",
          price10ml: "",
          oldPrice5ml: "",
          oldPrice10ml: "",
          isPromo: false,
          inStock: true,
          badge: "",
          description: "",
        });
        setImagePreview("");
        setImagePreview5ml("");
        setImagePreview10ml("");
        setImageFile(null);
        fetchData();
        setActiveTab("inventory");
      } else {
        showNotification("Erreur lors de la création du parfum", "error");
      }
    } catch (err) {
      showNotification("Erreur serveur", "error");
    }
  };

  // Image Upload Handler for Pack
  const handlePackImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPackImagePreview(URL.createObjectURL(file));
    setUploadingPackImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setNewPack((prev) => ({ ...prev, image: data.url }));
        showNotification("Image du pack téléchargée !");
      } else {
        showNotification("Erreur lors du téléchargement", "error");
      }
    } catch {
      showNotification("Erreur de connexion", "error");
    } finally {
      setUploadingPackImage(false);
    }
  };

  // Submit New Pack
  const handleAddPackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPack.name || !newPack.packPrice || !newPack.description) {
      showNotification("Veuillez remplir le nom, la description et le prix du pack", "error");
      return;
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPack.name,
          brand: newPack.brand || "Zakaria Fragrances",
          category: "pack",
          type: "Pack Découverte",
          family: newPack.contents || "Sélection Exclusive",
          image: newPack.image || "/assets/images/dior.jpg",
          description: newPack.description,
          price5ml: Number(newPack.packPrice),
          price10ml: Number(newPack.packPrice),
          inStock: newPack.inStock,
          badge: newPack.badge || "Pack Exclusif",
        }),
      });
      if (res.ok) {
        showNotification(`Pack "${newPack.name}" ajouté avec succès au catalogue Packs !`);
        setNewPack({ name: "", brand: "", description: "", image: "", packPrice: "", contents: "", inStock: true, badge: "Pack Exclusif" });
        setPackImagePreview("");
        fetchData();
        setActiveTab("inventory");
      } else {
        showNotification("Erreur lors de la création du pack", "error");
      }
    } catch {
      showNotification("Erreur serveur", "error");
    }
  };

  // Toggle Stock Status
  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: !currentStatus }),
      });

      if (res.ok) {
        showNotification(`Statut de disponibilité mis à jour (${!currentStatus ? "En stock" : "Épuisé"}) !`);
        fetchData();
      }
    } catch (err) {
      showNotification("Erreur lors du changement de disponibilité", "error");
    }
  };

  // Handle image upload while editing an existing product
  const handleEditImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setEditImage(data.url);
        showNotification("Photo mise à jour !");
      } else {
        showNotification("Erreur d'upload de la photo", "error");
      }
    } catch {
      showNotification("Erreur lors de l'upload", "error");
    }
  };

  const handleEditImage5mlFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setEditImage5ml(data.url);
        showNotification("Photo 5ml mise à jour !");
      } else {
        showNotification("Erreur d'upload 5ml", "error");
      }
    } catch {
      showNotification("Erreur d'upload", "error");
    }
  };

  const handleEditImage10mlFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setEditImage10ml(data.url);
        showNotification("Photo 10ml mise à jour !");
      } else {
        showNotification("Erreur d'upload 10ml", "error");
      }
    } catch {
      showNotification("Erreur d'upload", "error");
    }
  };

  // Save Product Edits (Name, Brand, Prices, Image)
  const handleSaveProductEdit = async (id: string) => {
    const p5 = editPrice5ml ? Number(editPrice5ml) : 0;
    const p10 = editPrice10ml ? Number(editPrice10ml) : 0;

    if (!editName.trim() || (p5 <= 0 && p10 <= 0)) {
      showNotification("Veuillez remplir au moins le nom et le prix d'un format (5ml ou 10ml)", "error");
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          brand: editBrand.trim(),
          price5ml: p5,
          price10ml: p10,
          oldPrice5ml: editOldPrice5ml ? Number(editOldPrice5ml) : undefined,
          oldPrice10ml: editOldPrice10ml ? Number(editOldPrice10ml) : undefined,
          isPromo: editIsPromo,
          ...(editImage ? { image: editImage.trim() } : {}),
          image5ml: editImage5ml ? editImage5ml.trim() : undefined,
          image10ml: editImage10ml ? editImage10ml.trim() : undefined,
        }),
      });

      if (res.ok) {
        showNotification("Parfum mis à jour avec succès !");
        setEditingId(null);
        fetchData();
      } else {
        showNotification("Erreur de mise à jour du parfum", "error");
      }
    } catch (err) {
      showNotification("Erreur de mise à jour du parfum", "error");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le parfum "${name}" ?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification(`Parfum "${name}" supprimé du catalogue.`);
        fetchData();
      }
    } catch (err) {
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id: string, newStatus: OrderItem["status"]) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showNotification(`Commande ${id} passée en "${newStatus}"`);
        fetchData();
      }
    } catch (err) {
      showNotification("Erreur de modification de la commande", "error");
    }
  };

  // Delete Order
  const handleDeleteOrder = async (id: string) => {
    if (!confirm(`Supprimer la commande ${id} ?`)) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification(`Commande ${id} supprimée.`);
        fetchData();
      }
    } catch (err) {
      showNotification("Erreur de suppression de la commande", "error");
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerPhone.includes(orderSearchQuery) ||
      o.perfumeName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      inventoryCategoryFilter === "all" ||
      p.category === inventoryCategoryFilter ||
      (inventoryCategoryFilter === "homme" && p.category === "unisexe") ||
      (inventoryCategoryFilter === "femme" && p.category === "unisexe");
    const matchesSearch =
      p.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(inventorySearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculated Stats
  const totalRevenue = orders
    .filter((o) => o.status !== "Annulée")
    .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  const totalRevenueFormatted = totalRevenue % 1 === 0 ? totalRevenue : totalRevenue.toFixed(2);
  const pendingOrdersCount = orders.filter((o) => o.status === "En attente").length;
  const hommeProductsCount = products.filter((p) => p.category === "homme" || p.category === "unisexe").length;
  const femmeProductsCount = products.filter((p) => p.category === "femme" || p.category === "unisexe").length;
  const unisexeProductsCount = products.filter((p) => p.category === "unisexe").length;
  const packsCount = products.filter((p) => p.category === "pack").length;

  return (
    <div className="min-h-screen bg-background text-foreground w-full">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-sm border shadow-2xl backdrop-blur-lg flex items-center gap-3 transition-all animate-bounce ${notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500 text-emerald-200"
              : "bg-rose-950/90 border-rose-500 text-rose-200"
            }`}
        >
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span className="text-xs tracking-wider uppercase font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="border-b border-border bg-background py-6 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
        <div className="container mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-white/5 border border-border hover:bg-white/10 text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl text-foreground flex items-center gap-2">
                <span>Espace Administration</span>

              </h1>
              <p className="text-white/50 text-xs font-light">Gestion des décants 5ml &amp; 10ml en temps réel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold hover:text-foreground px-3.5 py-2 border border-brand-gold/30 hover:border-brand-gold transition-colors rounded-lg cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>

            <button
              onClick={async () => {
                await fetch("/api/auth", { method: "DELETE" });
                window.location.href = "/login";
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-rose-400 hover:text-foreground hover:bg-rose-500/20 px-3.5 py-2 border border-rose-500/30 transition-colors rounded-lg cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 py-10">

        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 bg-white/[0.02] border border-border rounded-sm">
            <div className="flex items-center justify-between text-white/50 text-xs uppercase tracking-wider mb-2">
              <span>Commandes Totales</span>
              <ShoppingBag className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="font-serif text-3xl text-foreground">{orders.length}</div>
            <div className="text-[10px] text-brand-gold mt-1">{pendingOrdersCount} en attente de confirmation</div>
          </div>

          <div className="p-5 bg-white/[0.02] border border-border rounded-sm">
            <div className="flex items-center justify-between text-white/50 text-xs uppercase tracking-wider mb-2">
              <span>Chiffre d'Affaires</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-serif text-3xl text-emerald-400">{totalRevenueFormatted} DH</div>
            <div className="text-[10px] text-white/40 mt-1">Sur les commandes confirmées</div>
          </div>

          <div className="p-5 bg-white/[0.02] border border-border rounded-sm">
            <div className="flex items-center justify-between text-white/50 text-xs uppercase tracking-wider mb-2">
              <span>Homme / Femme</span>
              <Package className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="font-serif text-3xl text-foreground">{hommeProductsCount + femmeProductsCount}</div>
            <div className="text-[10px] text-white/40 mt-1">{hommeProductsCount} Homme · {femmeProductsCount} Femme</div>
          </div>

          <div className="p-5 bg-white/[0.02] border border-border rounded-sm">
            <div className="flex items-center justify-between text-white/50 text-xs uppercase tracking-wider mb-2">
              <span>Unisexe &amp; Packs</span>
              <Sparkles className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="font-serif text-3xl text-foreground">{unisexeProductsCount + packsCount}</div>
            <div className="text-[10px] text-white/40 mt-1">{unisexeProductsCount} Unisexe · {packsCount} Packs</div>
          </div>
        </div>

        {/* Dashboard Tabs Header */}
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "orders"
                ? "border-brand-gold text-brand-gold bg-brand-gold/5"
                : "border-transparent text-white/60 hover:text-foreground"
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>1. Commandes ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("add-product")}
            className={`px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "add-product"
                ? "border-brand-gold text-brand-gold bg-brand-gold/5"
                : "border-transparent text-white/60 hover:text-foreground"
              }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>2. Ajouter un Parfum</span>
          </button>

          <button
            onClick={() => setActiveTab("add-pack")}
            className={`px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "add-pack"
                ? "border-purple-400 text-purple-400 bg-purple-400/5"
                : "border-transparent text-white/60 hover:text-foreground"
              }`}
          >
            <Package className="w-4 h-4" />
            <span>🎁 Ajouter un Pack</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "inventory"
                ? "border-brand-gold text-brand-gold bg-brand-gold/5"
                : "border-transparent text-white/60 hover:text-foreground"
              }`}
          >
            <Package className="w-4 h-4" />
            <span>3. Gestion du Catalogue ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("support")}
            className={`px-6 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "support"
                ? "border-brand-gold text-brand-gold bg-brand-gold/5"
                : "border-transparent text-white/60 hover:text-foreground"
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>💬 Support</span>
          </button>
        </div>

        {/* TAB 1: COMMANDES */}
        {activeTab === "orders" && (
          <div>
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white/[0.02] p-4 border border-border">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {["all", "En attente", "Confirmée", "En cours de livraison", "Livrée", "Annulée"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap transition-all ${orderStatusFilter === status
                        ? "bg-brand-gold text-brand-black font-semibold"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                  >
                    {status === "all" ? "Toutes les commandes" : status}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Rechercher client, tel..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-border text-foreground pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 border border-border bg-white/[0.01]">
                <p className="text-white/50 text-sm">Aucune commande trouvée.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 bg-white/[0.02] border border-border hover:border-brand-gold/40 transition-colors rounded-sm flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center"
                  >
                    {/* Customer & Perfume Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-brand-gold text-sm font-semibold">{order.id}</span>
                        <span className="text-white/40 text-xs">• {new Date(order.createdAt).toLocaleString("fr-FR")}</span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider border font-medium ${order.status === "Confirmée"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : order.status === "En attente"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : order.status === "Livrée"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                  : order.status === "En cours de livraison"
                                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                    : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-foreground font-medium">
                            <User className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{order.customerName}</span>
                          </p>
                          <p className="flex items-center gap-2 text-white/70">
                            <Phone className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{order.customerPhone}</span>
                          </p>
                          <p className="flex items-center gap-2 text-white/70">
                            <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{order.customerCity} - {order.customerAddress}</span>
                          </p>
                        </div>

                        <div className="p-3 bg-white/5 border border-border space-y-1">
                          <p className="text-brand-gold font-medium">
                            {order.brand} - {order.perfumeName}
                          </p>
                          <p className="text-white/70">
                            Format Décant : <strong className="text-foreground font-semibold">{order.format}</strong> ({order.quantity}x)
                          </p>
                          <p className="text-emerald-400 font-serif text-sm font-semibold">
                            Total : {order.totalAmount} DH
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Changer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
                      <div className="w-full sm:w-auto">
                        <label className="text-[10px] text-white/40 block uppercase mb-1">Changer statut :</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderItem["status"])}
                          className="bg-background border border-border text-foreground text-xs px-3 py-2 focus:outline-none focus:border-brand-gold w-full sm:w-44"
                        >
                          <option value="En attente">⏳ En attente</option>
                          <option value="Confirmée">✅ Confirmée</option>
                          <option value="En cours de livraison">🚚 En cours de livraison</option>
                          <option value="Livrée">🎉 Livrée</option>
                          <option value="Annulée">❌ Annulée</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors self-end sm:self-auto"
                        title="Supprimer la commande"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AJOUTER UN PARFUM */}
        {activeTab === "add-product" && (
          <div className="max-w-3xl mx-auto bg-white/[0.02] border border-border p-8 md:p-10 rounded-sm">
            <div className="mb-8 pb-4 border-b border-border">
              <h2 className="font-serif text-2xl text-foreground mb-2">Ajouter un Nouveau Parfum</h2>
              <p className="text-white/60 text-xs">
                Remplissez les détails du parfum. Il sera directement ajouté à la section <strong className="text-brand-gold">Homme</strong> ou <strong className="text-brand-gold">Femme</strong> et disponible en formats 5ml &amp; 10ml !
              </p>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-6">
              {/* Category Selector (Homme / Femme / Unisexe) */}
              <div>
                <label className="text-xs uppercase tracking-widest text-brand-gold block mb-2 font-medium">
                  Catégorie du Parfum *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewPerfume((prev) => ({ ...prev, category: "homme" }))}
                    className={`py-3 px-4 border text-xs uppercase tracking-widest font-medium transition-all ${newPerfume.category === "homme"
                        ? "bg-brand-gold text-brand-black border-brand-gold shadow-lg"
                        : "bg-white/5 border-border text-white/70 hover:border-border"
                      }`}
                  >
                    🧔 Homme
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPerfume((prev) => ({ ...prev, category: "femme" }))}
                    className={`py-3 px-4 border text-xs uppercase tracking-widest font-medium transition-all ${newPerfume.category === "femme"
                        ? "bg-brand-gold text-brand-black border-brand-gold shadow-lg"
                        : "bg-white/5 border-border text-white/70 hover:border-border"
                      }`}
                  >
                    👩 Femme
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPerfume((prev) => ({ ...prev, category: "unisexe" }))}
                    className={`py-3 px-4 border text-xs uppercase tracking-widest font-medium transition-all ${newPerfume.category === "unisexe"
                        ? "bg-purple-500 text-foreground border-purple-500 shadow-lg"
                        : "bg-white/5 border-border text-white/70 hover:border-purple-400/50"
                      }`}
                  >
                    ✨ Unisexe
                  </button>
                </div>
              </div>

              {/* Perfume Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block mb-2">
                    Nom du Parfum *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Sauvage Elixir, Scandal..."
                    value={newPerfume.name}
                    onChange={(e) => setNewPerfume((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-border text-foreground px-4 py-3 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block mb-2">
                    Marque
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Dior, Paco Rabanne, Chanel..."
                    value={newPerfume.brand}
                    onChange={(e) => setNewPerfume((prev) => ({ ...prev, brand: e.target.value }))}
                    className="w-full bg-white/5 border border-border text-foreground px-4 py-3 text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Prices (5ml & 10ml) */}
              <div className="p-4 bg-brand-gold/5 border border-brand-gold/20 space-y-4">
                <span className="text-brand-gold text-xs uppercase tracking-widest font-medium block">
                  Prix des Décants (DH) *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase text-white/70 block mb-1">
                      Prix Format 5 ml (DH) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="ex: 130"
                      value={newPerfume.price5ml}
                      onChange={(e) => setNewPerfume((prev) => ({ ...prev, price5ml: e.target.value }))}
                      className="w-full bg-background border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase text-white/70 block mb-1">
                      Prix Format 10 ml (DH) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="ex: 230"
                      value={newPerfume.price10ml}
                      onChange={(e) => setNewPerfume((prev) => ({ ...prev, price10ml: e.target.value }))}
                      className="w-full bg-background border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Option PROMO / Réduction */}
              <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    <span className="text-rose-300 text-xs uppercase tracking-widest font-bold">
                      Option Offre Promo / Réduction (Ancien Prix Barré)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewPerfume((prev) => ({ ...prev, isPromo: !prev.isPromo }))}
                    className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded transition-colors ${
                      newPerfume.isPromo
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                        : "bg-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {newPerfume.isPromo ? "🔥 Produit en PROMO" : "Pas de Promo"}
                  </button>
                </div>

                <p className="text-[11px] text-white/60 font-light leading-relaxed">
                  Remplissez l&apos;ancien prix pour afficher automatiquement un ticket <strong className="text-rose-400">🔥 PROMO</strong> sur l&apos;article et barrer l&apos;ancien prix devant le nouveau prix pour inciter le client !
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                  <div>
                    <label className="text-xs uppercase text-white/70 block mb-1">
                      Ancien Prix 5 ml (DH) <span className="text-white/40">(prix barré)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="ex: 160 (si nouveau prix = 130)"
                      value={newPerfume.oldPrice5ml}
                      onChange={(e) =>
                        setNewPerfume((prev) => ({
                          ...prev,
                          oldPrice5ml: e.target.value,
                          isPromo: e.target.value ? true : prev.isPromo,
                        }))
                      }
                      className="w-full bg-background border border-rose-500/30 text-foreground px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase text-white/70 block mb-1">
                      Ancien Prix 10 ml (DH) <span className="text-white/40">(prix barré)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="ex: 280 (si nouveau prix = 230)"
                      value={newPerfume.oldPrice10ml}
                      onChange={(e) =>
                        setNewPerfume((prev) => ({
                          ...prev,
                          oldPrice10ml: e.target.value,
                          isPromo: e.target.value ? true : prev.isPromo,
                        }))
                      }
                      className="w-full bg-background border border-rose-500/30 text-foreground px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Uploads (Couverture, 5ml, 10ml) */}
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-wider text-white/80 block border-b border-border pb-2">
                  Photos du Parfum (Couverture, 5ml, 10ml)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Photo 1: Couverture */}
                  <div className="p-4 bg-white/5 border border-border flex flex-col justify-between space-y-3">
                    <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
                      1. Photo Couverture (Carte) *
                    </span>
                    <div className="flex flex-col gap-2">
                      <label className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 border border-border text-foreground text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{uploadingImage ? "..." : "Télécharger"}</span>
                        <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                      </label>
                      <input
                        type="text"
                        placeholder="URL photo..."
                        value={newPerfume.image}
                        onChange={(e) => setNewPerfume((prev) => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-background/50 border border-border text-foreground px-3 py-1.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    {(imagePreview || newPerfume.image) && (
                      <div className="relative w-full h-28 border border-brand-gold/40 rounded-sm overflow-hidden">
                        <Image src={imagePreview || newPerfume.image} alt="Couverture" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Photo 2: 5ml */}
                  <div className="p-4 bg-white/5 border border-border flex flex-col justify-between space-y-3">
                    <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
                      2. Photo Flacon 5ml
                    </span>
                    <div className="flex flex-col gap-2">
                      <label className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 border border-border text-foreground text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{uploadingImage5ml ? "..." : "Télécharger 5ml"}</span>
                        <input type="file" accept="image/*" onChange={handleImageFile5mlChange} className="hidden" />
                      </label>
                      <input
                        type="text"
                        placeholder="URL photo 5ml..."
                        value={newPerfume.image5ml}
                        onChange={(e) => setNewPerfume((prev) => ({ ...prev, image5ml: e.target.value }))}
                        className="w-full bg-background/50 border border-border text-foreground px-3 py-1.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    {(imagePreview5ml || newPerfume.image5ml) && (
                      <div className="relative w-full h-28 border border-brand-gold/40 rounded-sm overflow-hidden">
                        <Image src={imagePreview5ml || newPerfume.image5ml} alt="Flacon 5ml" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Photo 3: 10ml */}
                  <div className="p-4 bg-white/5 border border-border flex flex-col justify-between space-y-3">
                    <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
                      3. Photo Flacon 10ml
                    </span>
                    <div className="flex flex-col gap-2">
                      <label className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 border border-border text-foreground text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{uploadingImage10ml ? "..." : "Télécharger 10ml"}</span>
                        <input type="file" accept="image/*" onChange={handleImageFile10mlChange} className="hidden" />
                      </label>
                      <input
                        type="text"
                        placeholder="URL photo 10ml..."
                        value={newPerfume.image10ml}
                        onChange={(e) => setNewPerfume((prev) => ({ ...prev, image10ml: e.target.value }))}
                        className="w-full bg-background/50 border border-border text-foreground px-3 py-1.5 text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    {(imagePreview10ml || newPerfume.image10ml) && (
                      <div className="relative w-full h-28 border border-brand-gold/40 rounded-sm overflow-hidden">
                        <Image src={imagePreview10ml || newPerfume.image10ml} alt="Flacon 10ml" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stock Availability */}
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-border">
                <span className="text-xs uppercase tracking-wider text-foreground">Disponibilité initiale :</span>
                <button
                  type="button"
                  onClick={() => setNewPerfume((prev) => ({ ...prev, inStock: !prev.inStock }))}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors ${newPerfume.inStock
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                >
                  {newPerfume.inStock ? "✅ En stock" : "❌ Épuisé"}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-brand-gold text-brand-black hover:bg-white font-medium uppercase tracking-[0.2em] text-xs transition-colors duration-300 shadow-xl"
              >
                Ajouter le parfum au catalogue
              </button>
            </form>
          </div>
        )}

        {/* TAB ADD-PACK: AJOUTER UN PACK */}
        {activeTab === "add-pack" && (
          <div className="max-w-3xl mx-auto bg-white/[0.02] border border-purple-500/20 p-8 md:p-10 rounded-sm">
            {/* Header */}
            <div className="mb-8 pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎁</span>
                <h2 className="font-serif text-2xl text-foreground">Ajouter un Pack Exclusif</h2>
                <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30">Spécial</span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed">
                Créez un pack découverte unique avec une <strong className="text-purple-300">description personnalisée</strong>, une image attrayante et un <strong className="text-purple-300">prix pack unique</strong>. Les packs s&apos;affichent dans la section dédiée.
              </p>
            </div>

            <form onSubmit={handleAddPackSubmit} className="space-y-6">
              {/* Pack Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block mb-2">Nom du Pack *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Pack Prestige Nuit, Trio Découverte..."
                    value={newPack.name}
                    onChange={(e) => setNewPack((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-border text-foreground px-4 py-3 text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/80 block mb-2">Marque / Créateur</label>
                  <input
                    type="text"
                    placeholder="ex: Zakaria Fragrances"
                    value={newPack.brand}
                    onChange={(e) => setNewPack((prev) => ({ ...prev, brand: e.target.value }))}
                    className="w-full bg-white/5 border border-border text-foreground px-4 py-3 text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs uppercase tracking-wider text-white/80 block mb-2">Description du Pack * <span className="text-purple-300">(visible sur la page packs)</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="ex: Un trio de décants soigneusement sélectionnés pour les amateurs de parfums boisés et épicés. Comprend Sauvage Dior, Bleu de Chanel et Aventus Creed..."
                  value={newPack.description}
                  onChange={(e) => setNewPack((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white/5 border border-border text-foreground px-4 py-3 text-xs focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              {/* Pack Contents */}
              <div>
                <label className="text-xs uppercase tracking-wider text-white/80 block mb-2">Contenu du Pack <span className="text-white/40">(parfums inclus)</span></label>
                <input
                  type="text"
                  placeholder="ex: Sauvage Dior 5ml + Phantom Paco Rabanne 5ml + Aventus Creed 5ml"
                  value={newPack.contents}
                  onChange={(e) => setNewPack((prev) => ({ ...prev, contents: e.target.value }))}
                  className="w-full bg-white/5 border border-border text-foreground px-4 py-3 text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Pack Price */}
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 space-y-3">
                <span className="text-purple-300 text-xs uppercase tracking-widest font-medium block">Prix du Pack (DH) *</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase text-white/70 block mb-1">Prix Total du Pack (DH) *</label>
                    <input
                      type="number"
                      required
                      placeholder="ex: 350"
                      value={newPack.packPrice}
                      onChange={(e) => setNewPack((prev) => ({ ...prev, packPrice: e.target.value }))}
                      className="w-full bg-background border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-white/70 block mb-1">Badge d&apos;affichage</label>
                    <input
                      type="text"
                      placeholder="ex: Pack Exclusif, Best Value..."
                      value={newPack.badge}
                      onChange={(e) => setNewPack((prev) => ({ ...prev, badge: e.target.value }))}
                      className="w-full bg-background border border-border text-foreground px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-xs uppercase tracking-wider text-white/80 block mb-2">Photo du Pack</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <label className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-border text-foreground text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>{uploadingPackImage ? "Téléchargement..." : "Choisir une image..."}</span>
                    <input type="file" accept="image/*" onChange={handlePackImageFileChange} className="hidden" />
                  </label>
                  <span className="text-xs text-white/40 uppercase">ou URL :</span>
                  <input
                    type="text"
                    placeholder="https://... ou /assets/images/..."
                    value={newPack.image}
                    onChange={(e) => setNewPack((prev) => ({ ...prev, image: e.target.value }))}
                    className="flex-1 w-full bg-white/5 border border-border text-foreground px-4 py-2.5 text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
                {packImagePreview && (
                  <div className="mt-4 relative w-32 h-32 border border-purple-400/40 rounded-sm overflow-hidden">
                    <Image src={packImagePreview} alt="Aperçu pack" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Stock Availability */}
              <div className="flex items-center gap-4 p-4 bg-white/5 border border-border">
                <span className="text-xs uppercase tracking-wider text-foreground">Disponibilité initiale :</span>
                <button
                  type="button"
                  onClick={() => setNewPack((prev) => ({ ...prev, inStock: !prev.inStock }))}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors ${newPack.inStock
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                >
                  {newPack.inStock ? "✅ Disponible" : "❌ Épuisé"}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-foreground font-medium uppercase tracking-[0.2em] text-xs transition-colors duration-300 shadow-xl border border-purple-400/30"
              >
                🎁 Créer le Pack dans le Catalogue
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: GESTION DU CATALOGUE (Stock & Prix) */}
        {activeTab === "inventory" && (
          <div>
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white/[0.02] p-4 border border-border">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <button
                  onClick={() => setInventoryCategoryFilter("all")}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap ${inventoryCategoryFilter === "all" ? "bg-brand-gold text-brand-black font-semibold" : "bg-white/5 text-white/70"
                    }`}
                >
                  Tous ({products.length})
                </button>
                <button
                  onClick={() => setInventoryCategoryFilter("homme")}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap ${inventoryCategoryFilter === "homme" ? "bg-brand-gold text-brand-black font-semibold" : "bg-white/5 text-white/70"
                    }`}
                >
                  Homme ({hommeProductsCount})
                </button>
                <button
                  onClick={() => setInventoryCategoryFilter("femme")}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap ${inventoryCategoryFilter === "femme" ? "bg-brand-gold text-brand-black font-semibold" : "bg-white/5 text-white/70"
                    }`}
                >
                  Femme ({femmeProductsCount})
                </button>
                <button
                  onClick={() => setInventoryCategoryFilter("unisexe")}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap ${inventoryCategoryFilter === "unisexe" ? "bg-purple-500 text-foreground font-semibold" : "bg-white/5 text-white/70"
                    }`}
                >
                  Unisexe ({unisexeProductsCount})
                </button>
                <button
                  onClick={() => setInventoryCategoryFilter("pack")}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap ${inventoryCategoryFilter === "pack" ? "bg-purple-700 text-foreground font-semibold" : "bg-white/5 text-white/70"
                    }`}
                >
                  🎁 Packs ({packsCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={inventorySearchQuery}
                  onChange={(e) => setInventorySearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-border text-foreground pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto border border-border bg-white/[0.02]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-brand-gold uppercase tracking-wider font-mono border-b border-border">
                  <tr>
                    <th className="p-4">Parfum</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Prix 5ml</th>
                    <th className="p-4">Prix 10ml</th>
                    <th className="p-4">Disponibilité</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map((p) => {
                    const isEditing = editingId === p.id;

                    return (
                      <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                        {/* Perfume Image & Name */}
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-background border border-border shrink-0 overflow-hidden">
                            <Image src={isEditing && editImage ? editImage : p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-[160px]">
                            {isEditing ? (
                              <div className="space-y-2 min-w-[210px]">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  placeholder="Nom du parfum"
                                  className="w-full bg-background border border-brand-gold text-foreground px-2 py-1 text-xs focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={editBrand}
                                  onChange={(e) => setEditBrand(e.target.value)}
                                  placeholder="Marque"
                                  className="w-full bg-background border border-border text-white/70 px-2 py-1 text-[10px] focus:outline-none"
                                />
                                
                                {/* Photo Couverture */}
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9px] text-brand-gold font-mono uppercase font-semibold">1. Photo Couverture</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={editImage}
                                      onChange={(e) => setEditImage(e.target.value)}
                                      placeholder="URL photo carte"
                                      className="flex-1 bg-background border border-border text-white/70 px-1.5 py-0.5 text-[10px] focus:outline-none"
                                    />
                                    <label className="cursor-pointer px-1.5 py-0.5 bg-white/10 hover:bg-white/20 border border-border text-[9px] uppercase tracking-wider text-foreground shrink-0">
                                      📁 Cover
                                      <input type="file" accept="image/*" className="hidden" onChange={handleEditImageFileChange} />
                                    </label>
                                  </div>
                                </div>

                                {/* Photo 5ml */}
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9px] text-brand-gold font-mono uppercase font-semibold">2. Photo Flacon 5ml</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={editImage5ml}
                                      onChange={(e) => setEditImage5ml(e.target.value)}
                                      placeholder="URL photo 5ml"
                                      className="flex-1 bg-background border border-border text-white/70 px-1.5 py-0.5 text-[10px] focus:outline-none"
                                    />
                                    <label className="cursor-pointer px-1.5 py-0.5 bg-white/10 hover:bg-white/20 border border-border text-[9px] uppercase tracking-wider text-foreground shrink-0">
                                      📁 5ml
                                      <input type="file" accept="image/*" className="hidden" onChange={handleEditImage5mlFileChange} />
                                    </label>
                                  </div>
                                </div>

                                {/* Photo 10ml */}
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9px] text-brand-gold font-mono uppercase font-semibold">3. Photo Flacon 10ml</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={editImage10ml}
                                      onChange={(e) => setEditImage10ml(e.target.value)}
                                      placeholder="URL photo 10ml"
                                      className="flex-1 bg-background border border-border text-white/70 px-1.5 py-0.5 text-[10px] focus:outline-none"
                                    />
                                    <label className="cursor-pointer px-1.5 py-0.5 bg-white/10 hover:bg-white/20 border border-border text-[9px] uppercase tracking-wider text-foreground shrink-0">
                                      📁 10ml
                                      <input type="file" accept="image/*" className="hidden" onChange={handleEditImage10mlFileChange} />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="font-serif text-sm text-foreground block">{p.name}</span>
                                <span className="text-[10px] text-white/50">{p.brand}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border font-medium ${p.category === "homme"
                              ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                              : p.category === "femme"
                                ? "bg-pink-500/10 text-pink-300 border-pink-500/30"
                                : p.category === "unisexe"
                                  ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                                  : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                            }`}>
                            {p.category === "pack" ? "🎁 Pack" : p.category}
                          </span>
                        </td>

                        {/* Price 5ml */}
                        <td className="p-4 font-mono font-medium text-foreground">
                          {isEditing ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-white/50">Nouveau 5ml</span>
                              <input
                                type="number"
                                value={editPrice5ml}
                                onChange={(e) => setEditPrice5ml(e.target.value)}
                                placeholder="0"
                                className="w-24 bg-background border border-brand-gold text-foreground px-2 py-1 text-xs focus:outline-none"
                              />
                              <span className="text-[9px] text-rose-300">Ancien (barré)</span>
                              <input
                                type="number"
                                value={editOldPrice5ml}
                                onChange={(e) => {
                                  setEditOldPrice5ml(e.target.value);
                                  if (e.target.value) setEditIsPromo(true);
                                }}
                                placeholder="Ancien 5ml"
                                className="w-24 bg-background border border-rose-500/40 text-foreground px-2 py-1 text-xs focus:outline-none"
                              />
                            </div>
                          ) : p.price5ml > 0 ? (
                            <div>
                              <span>{p.price5ml} DH</span>
                              {p.oldPrice5ml && p.oldPrice5ml > p.price5ml ? (
                                <span className="block line-through text-white/40 text-[10px]">
                                  {p.oldPrice5ml} DH
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-rose-400 font-sans text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded">
                              Hors commande
                            </span>
                          )}
                        </td>

                        {/* Price 10ml */}
                        <td className="p-4 font-mono font-medium text-foreground">
                          {isEditing ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-white/50">Nouveau 10ml</span>
                              <input
                                type="number"
                                value={editPrice10ml}
                                onChange={(e) => setEditPrice10ml(e.target.value)}
                                placeholder="0"
                                className="w-24 bg-background border border-brand-gold text-foreground px-2 py-1 text-xs focus:outline-none"
                              />
                              <span className="text-[9px] text-rose-300">Ancien (barré)</span>
                              <input
                                type="number"
                                value={editOldPrice10ml}
                                onChange={(e) => {
                                  setEditOldPrice10ml(e.target.value);
                                  if (e.target.value) setEditIsPromo(true);
                                }}
                                placeholder="Ancien 10ml"
                                className="w-24 bg-background border border-rose-500/40 text-foreground px-2 py-1 text-xs focus:outline-none"
                              />
                            </div>
                          ) : p.price10ml > 0 ? (
                            <div>
                              <span>{p.price10ml} DH</span>
                              {p.oldPrice10ml && p.oldPrice10ml > p.price10ml ? (
                                <span className="block line-through text-white/40 text-[10px]">
                                  {p.oldPrice10ml} DH
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-rose-400 font-sans text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded">
                              Hors commande
                            </span>
                          )}
                        </td>

                        {/* Availability Toggle */}
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStock(p.id, p.inStock)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium border transition-colors ${p.inStock
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                                : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                              }`}
                          >
                            {p.inStock ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
                            <span>{p.inStock ? "En Stock" : "Épuisé"}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveProductEdit(p.id)}
                                  className="px-3 py-1 bg-brand-gold text-brand-black text-[10px] uppercase font-bold tracking-wider hover:bg-white transition-colors"
                                >
                                  Enregistrer
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-2 py-1 border border-border text-white/60 hover:text-foreground text-[10px] uppercase tracking-wider transition-colors"
                                  title="Annuler"
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(p.id);
                                  setEditName(p.name);
                                  setEditBrand(p.brand || "");
                                  setEditPrice5ml(String(p.price5ml || ""));
                                  setEditPrice10ml(String(p.price10ml || ""));
                                  setEditOldPrice5ml(p.oldPrice5ml ? String(p.oldPrice5ml) : "");
                                  setEditOldPrice10ml(p.oldPrice10ml ? String(p.oldPrice10ml) : "");
                                  setEditIsPromo(Boolean(p.isPromo || p.oldPrice5ml || p.oldPrice10ml));
                                  setEditImage(p.image || "");
                                  setEditImage5ml(p.image5ml || "");
                                  setEditImage10ml(p.image10ml || "");
                                }}
                                className="p-2 border border-border text-white/70 hover:text-foreground hover:border-brand-gold transition-colors"
                                title="Modifier le parfum"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Supprimer le parfum"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* TAB 4: SUPPORT */}
        {activeTab === "support" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between bg-white/[0.02] border border-border p-6 rounded-sm">
              <div>
                <h2 className="font-serif text-2xl text-foreground font-light">Messages du Support Client</h2>
                <p className="text-xs text-white/50 mt-1">
                  Consultez les demandes des clients en temps réel et répondez directement.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Synchronisation active (3s)
                </span>
                <button
                  onClick={() => fetchSupport()}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-border text-foreground text-xs rounded-sm transition-colors"
                >
                  Actualiser
                </button>
              </div>
            </div>

            {supportLoading && supportMessages.length === 0 ? (
              <div className="p-12 text-center text-white/50 border border-border bg-white/[0.01]">
                <p className="animate-pulse text-sm">Chargement des messages...</p>
              </div>
            ) : supportMessages.length === 0 ? (
              <div className="p-12 text-center border border-border bg-white/[0.01] rounded-sm">
                <p className="text-white/40 text-sm font-serif">Aucun message de support pour le moment.</p>
                <p className="text-xs text-white/30 mt-1">Les questions posées sur la page /support apparaîtront instantanément ici.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {supportMessages.map((msg) => {
                  const isClient = msg.role === "client";
                  return (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-sm border transition-all ${isClient
                          ? "bg-white/[0.03] border-brand-gold/30 shadow-lg"
                          : "bg-white/[0.01] border-border ml-6"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${isClient
                                ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/30"
                                : "bg-white/10 text-white/70 border border-border"
                              }`}
                          >
                            {isClient ? "👤 Client" : "👑 Vous (Support Admin)"}
                          </span>
                          <span className="text-xs text-white/40">
                            {new Date(msg.created_at).toLocaleString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 hover:underline px-2 py-1"
                        >
                          Supprimer
                        </button>
                      </div>

                      <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>

                      {isClient && (
                        <div className="mt-4 pt-3 border-t border-border flex gap-2">
                          <input
                            id={`reply-${msg.id}`}
                            type="text"
                            placeholder="Tapez votre réponse au client..."
                            className="flex-1 bg-background/60 border border-border focus:border-brand-gold text-foreground text-xs px-3 py-2 rounded-sm focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const el = e.currentTarget;
                                if (el.value.trim()) {
                                  handleReply(msg.id, el.value.trim());
                                  el.value = "";
                                }
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              const el = document.getElementById(`reply-${msg.id}`) as HTMLInputElement;
                              if (el && el.value.trim()) {
                                handleReply(msg.id, el.value.trim());
                                el.value = "";
                              }
                            }}
                            className="px-4 py-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-black text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
                          >
                            Répondre
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


      </main>
    </div>
  );
}
