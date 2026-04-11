import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Shirt,
  Tag,
  Upload,
  Image as ImageIcon,
  Lock,
  User,
  LogOut,
  AlertTriangle,
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
  Settings,
  MessageCircle,
  Info,
  Search,
  MapPin,
  Truck,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

// --- CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBM4k9enluXupgycxWmkYdPWwiwciSthII",
  authDomain: "essential-company.firebaseapp.com",
  projectId: "essential-company",
  storageBucket: "essential-company.firebasestorage.app",
  messagingSenderId: "900109524481",
  appId: "1:900109524481:web:94d1b447ee831e3cf2ea00",
  measurementId: "G-Z264XT45HG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "essential-company-app";
// NÚMERO DO WHATSAPP DA LOJA
const WHATSAPP_NUMBER = "5541984749711";

// CATEGORIAS DISPONÍVEIS
const SUBCATEGORIES = ["Retrô", "Europeu", "Brasileiro", "Seleção", "Promoção"];
// --- ÍCONE DO INSTAGRAM CUSTOMIZADO ---
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);
// --- LOGO OFICIAL EM SVG ---
const EssentialLogo = ({ size = 56, light = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="50"
      cy="50"
      r="50"
      fill={light ? "#f8fafc" : "url(#gradLogo)"}
    />
    <text
      x="50"
      y="52"
      fill={light ? "#0a0f30" : "#f8fafc"}
      fontSize="13"
      fontFamily="Georgia, serif"
      fontWeight="bold"
      textAnchor="middle"
      letterSpacing="0.5"
    >
      ESSENTIAL
    </text>
    <path
      d="M 22 61 L 36 61"
      stroke={light ? "#94a3b8" : "#8ba1c6"}
      strokeWidth="0.75"
    />
    <text
      x="50"
      y="63"
      fill={light ? "#64748b" : "#cbd5e1"}
      fontSize="6"
      fontFamily="sans-serif"
      fontWeight="bold"
      letterSpacing="1.5"
      textAnchor="middle"
    >
      COMPANY
    </text>
    <path
      d="M 64 61 L 78 61"
      stroke={light ? "#94a3b8" : "#8ba1c6"}
      strokeWidth="0.75"
    />
    {!light && (
      <defs>
        <radialGradient id="gradLogo" cx="50" cy="50" r="50" fx="50" fy="50">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="60%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#05071a" />
        </radialGradient>
      </defs>
    )}
  </svg>
);

// Helper para compatibilidade de dados antigos e novos
const getProductImages = (product) => {
  if (product.imageUrls && product.imageUrls.length > 0)
    return product.imageUrls;
  if (product.imageUrl) return [product.imageUrl];
  return [];
};

// ==============================
// COMPONENTES MODAIS E CARTÕES
// ==============================

const StoreProductCard = ({
  product,
  addToCart,
  formatCurrency,
  showAlert,
}) => {
  const [wantsPersonalization, setWantsPersonalization] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const isEsgotado = product.type === "pronta_entrega" && product.stock <= 0;
  const images = getProductImages(product);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden group transition-all duration-300 flex flex-col transform hover:-translate-y-1">
      {/* Slider de Imagem */}
      <div className="h-64 sm:h-72 w-full bg-gray-100 relative overflow-hidden flex justify-center items-center">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIdx]}
              alt={`${product.name} - Foto ${currentImageIdx + 1}`}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                isEsgotado ? "grayscale opacity-60" : ""
              }`}
            />
            {/* Controles do Carrossel */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-md transition-colors z-10 active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-md transition-colors z-10 active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIdx ? "bg-white w-3" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <Shirt size={60} className="text-gray-300" />
        )}

        {/* Tags Sobre a Imagem */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          <span
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm text-white w-max ${
              product.type === "encomenda"
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-green-500 to-emerald-500"
            }`}
          >
            {product.type === "encomenda" ? "Encomenda" : "Pronta Entrega"}
          </span>
          {isEsgotado && (
            <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm bg-red-600/90 text-white backdrop-blur-sm w-max">
              Esgotado
            </span>
          )}
        </div>
        {product.subCategory && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="bg-[#05071a]/80 text-white backdrop-blur-md px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded border border-white/20">
              {product.subCategory}
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo do Cartão */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col bg-white">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
            {product.name}
          </h3>
          {product.type === "pronta_entrega" && (
            <span className="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-black px-3 py-1 rounded-lg shadow-sm flex-shrink-0">
              {product.size}
            </span>
          )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
          {product.team}
        </p>

        <div className="mt-auto">
          <p className="text-3xl font-black text-blue-900 mb-5">
            {formatCurrency(product.price)}
          </p>

          {product.type === "encomenda" && (
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Escolha o Tamanho
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow cursor-pointer appearance-none shadow-inner"
                >
                  <option value="P">Tamanho P</option>
                  <option value="M">Tamanho M</option>
                  <option value="G">Tamanho G</option>
                  <option value="GG">Tamanho GG</option>
                  <option value="XG">Tamanho XG</option>
                  <option value="EXG">Tamanho EXG</option>
                </select>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3 sm:p-4 rounded-xl transition-all hover:bg-amber-100/50">
                <label className="flex items-start gap-3 cursor-pointer group/label">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={wantsPersonalization}
                      onChange={(e) =>
                        setWantsPersonalization(e.target.checked)
                      }
                    />
                    <div className="w-5 h-5 rounded bg-white border-2 border-amber-300 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors flex items-center justify-center shadow-sm">
                      <Check
                        size={14}
                        className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-amber-900 group-hover/label:text-amber-700 transition-colors">
                      Quero personalizar
                    </span>
                    <span className="text-xs text-amber-600/80 mt-0.5 leading-tight flex items-center gap-1">
                      <Info size={12} /> Valores no WhatsApp
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (isEsgotado)
                return showAlert("Este produto está esgotado no momento.");
              addToCart(product, wantsPersonalization, selectedSize);
            }}
            disabled={isEsgotado}
            className={`w-full py-3.5 sm:py-4 rounded-xl font-black text-[15px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
              isEsgotado
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-600 hover:to-blue-800 shadow-blue-900/20"
            }`}
          >
            <ShoppingCart size={20} />{" "}
            {isEsgotado ? "Indisponível" : "Adicionar ao Carrinho"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ isOpen, type, onClose, onSave, showAlert }) => {
  const fileInputRef = useRef(null);
  const isProntaEntrega = type === "pronta_entrega";

  const initialFormState = {
    name: "",
    team: "",
    size: "M",
    cost: "",
    price: "",
    stock: "1",
    subCategory: "Europeu",
    imageUrls: [],
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (isOpen) setFormData(initialFormState);
  }, [isOpen, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
      return showAlert("Adicione pelo menos uma imagem do produto.");
    }

    onSave({
      name: formData.name,
      type: type,
      team: formData.team,
      size: isProntaEntrega ? formData.size : "Variado",
      cost: parseFloat(formData.cost) || 0,
      price: parseFloat(formData.price) || 0,
      stock: isProntaEntrega ? parseInt(formData.stock, 10) : 999,
      subCategory: formData.subCategory, // Nova funcionalidade: Categoria
      imageUrls: formData.imageUrls,
    });
  };

  const processImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMultipleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (formData.imageUrls.length + files.length > 5) {
      return showAlert("Você pode adicionar no máximo 5 imagens por produto.");
    }
    setIsCompressing(true);
    const compressedImages = [];
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const compressed = await processImageFile(file);
        compressedImages.push(compressed);
      }
    }
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...compressedImages],
    }));
    setIsCompressing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0f30]/80 flex items-center justify-center z-[100] p-4 sm:p-6 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in border border-gray-100">
        <div
          className={`p-5 sm:p-6 flex justify-between items-center text-white ${
            isProntaEntrega
              ? "bg-gradient-to-r from-blue-800 to-[#0a0f30]"
              : "bg-gradient-to-r from-amber-600 to-amber-800"
          }`}
        >
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              <Package size={22} /> Cadastro de Produto
            </h2>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1 block">
              Destino: {isProntaEntrega ? "Pronta Entrega" : "Sob Encomenda"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-8 space-y-6 overflow-y-auto"
        >
          {/* Sessão de Fotos */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Fotos do Produto (Máx 5)
              </label>
              <span className="text-xs font-bold text-gray-400">
                {formData.imageUrls.length}/5
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleMultipleImages}
            />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {formData.imageUrls.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group"
                >
                  <img
                    src={imgSrc}
                    className="w-full h-full object-cover"
                    alt={`Preview ${idx + 1}`}
                  />
                  <div className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="text-white p-2 w-full h-full flex justify-center items-center"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                      Capa
                    </span>
                  )}
                </div>
              ))}
              {formData.imageUrls.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isCompressing}
                  className="aspect-square border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-blue-400 transition hover:text-blue-600 disabled:opacity-50"
                >
                  {isCompressing ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ImageIcon size={24} className="mb-1" />
                      <span className="text-[10px] font-black tracking-wide">
                        ADICIONAR
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Descrição da Camisa
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Camisa Real Madrid 23/24"
              className="w-full rounded-xl bg-gray-50 p-4 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 shadow-inner"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Time / Seleção
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Real Madrid"
                className="w-full rounded-xl bg-gray-50 p-4 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 shadow-inner"
                value={formData.team}
                onChange={(e) =>
                  setFormData({ ...formData, team: e.target.value })
                }
              />
            </div>

            {/* NOVO CAMPO: CATEGORIAS */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Categoria
              </label>
              <select
                className="w-full rounded-xl bg-gray-50 p-4 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 shadow-inner appearance-none cursor-pointer"
                value={formData.subCategory}
                onChange={(e) =>
                  setFormData({ ...formData, subCategory: e.target.value })
                }
              >
                {SUBCATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {isProntaEntrega ? (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Tamanho Físico
                </label>
                <select
                  className="w-full rounded-xl bg-gray-50 p-4 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 shadow-inner appearance-none cursor-pointer"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                >
                  <option>P</option>
                  <option>M</option>
                  <option>G</option>
                  <option>GG</option>
                  <option>XG</option>
                  <option>EXG</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Tamanho
                </label>
                <div className="w-full rounded-xl bg-amber-50 p-4 border border-amber-200 font-bold text-amber-700 shadow-sm text-sm flex items-center justify-center h-[58px]">
                  Pelo Cliente
                </div>
              </div>
            )}
            {isProntaEntrega && (
              <div>
                <label className="block text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">
                  Estoque Inicial
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full rounded-xl bg-green-50 p-4 border-2 border-green-200 outline-none focus:ring-2 focus:ring-green-600 font-black text-green-700 text-lg shadow-inner"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Preço Custo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full rounded-xl bg-gray-50 p-4 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 shadow-inner"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                Preço Venda (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full rounded-xl bg-blue-50 p-4 border-2 border-blue-200 outline-none focus:ring-2 focus:ring-blue-600 font-black text-blue-800 shadow-inner"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isCompressing}
              className={`w-full text-white py-4 rounded-xl font-black text-lg transition-all shadow-md active:scale-[0.98] ${
                isProntaEntrega
                  ? "bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800"
                  : "bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700"
              } ${isCompressing ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BannerModal = ({ isOpen, onClose, onSave, showAlert }) => {
  const fileRef = useRef(null);
  const initialFormState = { title: "", subtitle: "", imageUrl: "" };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) setFormData(initialFormState);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUrl)
      return showAlert("É obrigatório enviar uma imagem para o banner.");
    onSave(formData);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData({ ...formData, imageUrl: reader.result });
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0f30]/80 flex items-center justify-center z-[100] p-4 sm:p-6 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-fade-in border border-gray-100">
        <div className="bg-gradient-to-r from-[#0a0f30] to-blue-900 p-5 sm:p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-black flex items-center gap-2">
            <ImageIcon size={24} /> Novo Banner
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*"
            onChange={handleImg}
          />
          {formData.imageUrl ? (
            <div className="h-40 w-full relative rounded-2xl overflow-hidden shadow-md border-4 border-gray-50 group">
              <img
                src={formData.imageUrl}
                className="w-full h-full object-cover"
                alt="prev"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white backdrop-blur-sm transition"
              >
                <Trash2 size={32} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="w-full h-32 border-2 border-dashed border-blue-300 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-500 font-black tracking-wide hover:bg-blue-100 transition"
            >
              <ImageIcon size={28} className="mb-2" /> SELECIONAR IMAGEM
            </button>
          )}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Título Principal (Opcional)
            </label>
            <input
              type="text"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 shadow-inner"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Subtítulo (Opcional)
            </label>
            <input
              type="text"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 shadow-inner"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 rounded-xl font-black text-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all active:scale-95"
          >
            Publicar Banner
          </button>
        </form>
      </div>
    </div>
  );
};

const TransactionModal = ({ isOpen, onClose, onSave }) => {
  const initialFormState = {
    description: "",
    type: "entrada",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) setFormData(initialFormState);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, amount: parseFloat(formData.amount) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0f30]/80 flex items-center justify-center z-[100] p-4 sm:p-6 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-fade-in border border-gray-100">
        <div className="bg-gradient-to-r from-[#0a0f30] to-blue-900 p-5 sm:p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-black flex items-center gap-2">
            <DollarSign size={24} /> Lançamento
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
          <div className="flex gap-3">
            <label
              className={`flex-1 flex justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.type === "entrada"
                  ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                  : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                className="hidden"
                name="type"
                value="entrada"
                checked={formData.type === "entrada"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
              <TrendingUp size={20} /> Entrada
            </label>
            <label
              className={`flex-1 flex justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.type === "saida"
                  ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                  : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                className="hidden"
                name="type"
                value="saida"
                checked={formData.type === "saida"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
              <TrendingDown size={20} /> Saída
            </label>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Descrição
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Venda de Camisa"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 shadow-inner"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-lg text-gray-900 shadow-inner"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Data
              </label>
              <input
                type="date"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 shadow-inner"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 rounded-xl font-black text-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all active:scale-95"
          >
            Salvar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

const DialogModal = ({ dialog, onClose }) => {
  if (!dialog.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#0a0f30]/80 flex items-center justify-center z-[200] p-4 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-8 text-center animate-fade-in shadow-2xl border border-gray-100">
        <div className="mb-5 sm:mb-6 flex justify-center">
          {dialog.type === "alert" ? (
            <div className="bg-amber-50 p-5 rounded-full text-amber-500 border border-amber-100">
              <AlertCircle size={40} className="sm:w-12 sm:h-12" />
            </div>
          ) : (
            <div className="bg-red-50 p-5 rounded-full text-red-500 border border-red-100">
              <AlertTriangle size={40} className="sm:w-12 sm:h-12" />
            </div>
          )}
        </div>
        <p className="text-gray-900 font-black mb-6 sm:mb-8 text-lg sm:text-xl leading-tight">
          {dialog.message}
        </p>
        <div className="flex gap-3 sm:gap-4 justify-center">
          {dialog.type === "confirm" && (
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-black rounded-xl hover:bg-gray-200 transition border border-gray-200"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={() => {
              if (dialog.onConfirm) dialog.onConfirm();
              onClose();
            }}
            className={`flex-1 py-3.5 text-white font-black rounded-xl shadow-md transition active:scale-95 ${
              dialog.type === "alert"
                ? "bg-gradient-to-r from-blue-600 to-blue-800"
                : "bg-gradient-to-r from-red-600 to-red-800"
            }`}
          >
            {dialog.type === "alert" ? "Entendido" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  removeFromCart,
  updateCartQty,
  finishOrderWhatsApp,
  formatCurrency,
}) => {
  if (!isOpen) return null;

  // Modificado: Calcular total considerando a quantidade
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const hasPers = cart.some((item) => item.isPersonalized);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-[#0a0f30]/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div
        className="relative w-full max-w-md bg-gray-50 h-full shadow-2xl flex flex-col animate-fade-in border-l border-gray-200"
        style={{ animation: "slideLeft 0.3s ease-out forwards" }}
      >
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#05071a] to-[#0a0f30] text-white flex justify-between items-center shadow-lg">
          <h2 className="text-xl font-black flex items-center gap-3">
            <ShoppingCart size={24} /> Meu Carrinho
          </h2>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white bg-white/10 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag
                size={64}
                className="mb-4 opacity-50 text-gray-300"
              />
              <p className="font-black text-xl text-gray-500">
                O carrinho está vazio
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const images = getProductImages(item);
              const thumbUrl = images.length > 0 ? images[0] : null;
              return (
                <div
                  key={item.cartId}
                  className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3 sm:gap-4 relative group"
                >
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner border border-gray-50">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        className="w-full h-full object-cover"
                        alt="item"
                      />
                    ) : (
                      <Shirt className="m-auto h-full text-gray-300" />
                    )}
                  </div>
                  <div className="pr-8 flex flex-col justify-center flex-1">
                    <p className="font-bold text-gray-900 leading-tight mb-1 text-sm sm:text-base">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-wider">
                      Tam: <span className="text-gray-800">{item.size}</span>{" "}
                      {item.type === "encomenda" ? "ENCOMENDA" : "P. ENTREGA"}
                    </p>

                    {/* NOVO: CONTROLE DE QUANTIDADE (+ e -) */}
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQty(item.cartId, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-sm border border-gray-100 transition"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="font-black text-sm w-4 text-center text-gray-900">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.cartId, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm border border-gray-100 transition"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>
                      <p className="font-black text-blue-800 text-lg">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>

                    {item.isPersonalized && (
                      <span className="inline-block mt-2 bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider self-start">
                        + Personalização
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 bg-white border-t border-gray-200 shadow-[0_-15px_30px_rgba(0,0,0,0.05)] z-10">
            <div className="flex justify-between items-end mb-4 sm:mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-gray-500 font-black uppercase tracking-widest text-xs">
                Subtotal
              </span>
              <span className="text-2xl sm:text-3xl font-black text-blue-900">
                {formatCurrency(total)}
              </span>
            </div>
            {hasPers && (
              <div className="flex items-start gap-3 bg-amber-50 p-3 sm:p-4 rounded-xl mb-4 sm:mb-5 border border-amber-200 shadow-sm">
                <Info
                  size={18}
                  className="text-amber-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-[11px] sm:text-xs text-amber-900 font-bold leading-tight uppercase tracking-wide">
                  Detalhes da personalização e o valor adicional serão
                  combinados pelo WhatsApp!
                </p>
              </div>
            )}
            <button
              onClick={finishOrderWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-4 rounded-xl font-black text-[15px] sm:text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <MessageCircle size={22} className="sm:w-6 sm:h-6" /> Enviar
              Pedido no WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================
// COMPONENTE PRINCIPAL (APP)
// ==============================

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("store");
  const [isLogged, setIsLogged] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [activeAdminTab, setActiveAdminTab] = useState("dashboard");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: "confirm",
    message: "",
    onConfirm: null,
  });

  // Lógica da Loja (Pesquisa e Filtros)
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("pronta_entrega");
  const [activeSubCategory, setActiveSubCategory] = useState("Todos"); // Novo filtro da loja

  // Lógica de pesquisa no Admin
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const showConfirm = (message, onConfirm) =>
    setDialog({ isOpen: true, type: "confirm", message, onConfirm });
  const showAlert = (message) =>
    setDialog({ isOpen: true, type: "alert", message, onConfirm: null });

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Erro na autenticação:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);

    const productsRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "products"
    );
    const unsubscribeProducts = onSnapshot(
      productsRef,
      (snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setIsLoading(false);
      },
      (error) => console.error("Erro em products:", error)
    );

    const bannersRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "banners"
    );
    const unsubscribeBanners = onSnapshot(
      bannersRef,
      (snapshot) =>
        setBanners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
      (error) => console.error("Erro em banners:", error)
    );

    const transactionsRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "transactions"
    );
    const unsubscribeTransactions = onSnapshot(
      transactionsRef,
      (snapshot) => {
        const transData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        transData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(transData);
      },
      (error) => console.error("Erro em transactions:", error)
    );

    return () => {
      unsubscribeProducts();
      unsubscribeBanners();
      unsubscribeTransactions();
    };
  }, [user]);

  useEffect(() => {
    if (banners.length <= 1 || currentView !== "store") return;
    const interval = setInterval(
      () => setCurrentBanner((prev) => (prev + 1) % banners.length),
      5000
    );
    return () => clearInterval(interval);
  }, [banners.length, currentView]);

  const dashboardStats = useMemo(() => {
    const incomes = transactions
      .filter((t) => t.type === "entrada")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const expenses = transactions
      .filter((t) => t.type === "saida")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const inventoryValue = products
      .filter((p) => p.type === "pronta_entrega")
      .reduce((acc, curr) => acc + (curr.cost || 0) * (curr.stock || 0), 0);
    return {
      totalIncomes: incomes,
      totalExpenses: expenses,
      balance: incomes - expenses,
      totalInventoryValue: inventoryValue,
    };
  }, [transactions, products]);

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.type === "pronta_entrega" && p.stock <= 1),
    [products]
  );

  const handleSaveDoc = async (collectionName, data) => {
    if (!user)
      return showAlert(
        "O sistema ainda está se conectando. Aguarde um segundo e tente novamente."
      );
    try {
      const docId = Date.now().toString();
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", collectionName, docId),
        data
      );
    } catch (error) {
      console.error(`Erro ao salvar em ${collectionName}:`, error);
      showAlert("Ocorreu um erro ao salvar.");
    }
  };

  const handleDeleteDoc = (collectionName, id, message) => {
    if (!user) return showAlert("O sistema ainda está se conectando.");
    showConfirm(message, async () => {
      try {
        await deleteDoc(
          doc(db, "artifacts", appId, "public", "data", collectionName, id)
        );
      } catch (error) {
        console.error(`Erro ao excluir em ${collectionName}:`, error);
      }
    });
  };

  const handleUpdateStock = async (id, change) => {
    if (!user) return showAlert("Conectando... Tente novamente em instantes.");
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", "products", id),
        { ...product, stock: Math.max(0, product.stock + change) }
      );
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginData.username === "Erick_Carvalho" &&
      loginData.password === "1234"
    ) {
      setIsLogged(true);
      setLoginError("");
      setCurrentView("admin");
    } else {
      setLoginError("Usuário ou senha incorretos.");
    }
  };

  const handleLogout = () => {
    setIsLogged(false);
    setLoginData({ username: "", password: "" });
    setCurrentView("store");
  };

  const addToCartAction = (product, isPersonalized, selectedSize) => {
    const finalSize =
      product.type === "encomenda" ? selectedSize : product.size;
    // O carrinho agora salva qtd base
    setCart((prev) => [
      ...prev,
      {
        ...product,
        cartId: Date.now(),
        isPersonalized,
        size: finalSize,
        qty: 1,
      },
    ]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // NOVA FUNÇÃO: Atualizar quantidade no carrinho
  const updateCartQty = (cartId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQty = item.qty + delta;
          if (newQty < 1) return item; // Nao deixa baixar de 1. (Usa a lixeira para remover)
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const finishOrderWhatsApp = () => {
    if (cart.length === 0) return;
    let text =
      "Olá! Gostaria de fazer o seguinte pedido na Essential Company:\n\n";
    let total = 0;
    let hasPers = false;

    cart.forEach((item) => {
      const itemTotal = item.price * item.qty; // Multiplica pela quantidade!
      total += itemTotal;
      const tipo =
        item.type === "encomenda" ? "Sob Encomenda" : "Pronta Entrega";
      const pers = item.isPersonalized ? " *(COM PERSONALIZAÇÃO)*" : "";
      if (item.isPersonalized) hasPers = true;
      text += `📦 ${item.qty}x ${item.name} (Tam: ${
        item.size
      })\n${tipo}${pers}\nValor: R$ ${itemTotal.toFixed(2)}\n\n`;
    });

    text += `💰 *Total dos Produtos: R$ ${total.toFixed(2)}*\n`;
    if (hasPers)
      text += `\n_(Atenção: Notei que você adicionou personalização em alguns itens. O nome, número e o valor adicional serão combinados por aqui!)._`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    );
    setCart([]);
    setIsCartOpen(false);
  };

  // ==============================
  // FUNÇÕES DE RENDERIZAÇÃO DE ECRÃS
  // ==============================

  const renderStoreFront = () => {
    const filteredProducts = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = p.type === activeCategory;
      const matchesSub =
        activeSubCategory === "Todos" || p.subCategory === activeSubCategory;
      return matchesSearch && matchesCategory && matchesSub;
    });

    return (
      <div className="flex-1 flex flex-col animate-fade-in w-full relative z-10 bg-[#f8fafc]">
        {/* Banners Hero */}
        {banners.length > 0 && (
          <div className="relative w-full h-[35vh] sm:h-[45vh] md:h-[65vh] bg-[#05071a] overflow-hidden">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {banner.imageUrl && (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f30] via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6">
                  {banner.title && (
                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-3 sm:mb-4 max-w-5xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-base sm:text-2xl text-blue-200 font-medium max-w-3xl drop-shadow-lg">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {banners.length > 1 && (
              <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center gap-2 sm:gap-3 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all ${
                      idx === currentBanner
                        ? "bg-blue-500 w-8 sm:w-10 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        : "bg-white/50 hover:bg-white w-2 sm:w-2.5"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8 relative">
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-center relative z-20">
            <div className="flex bg-gray-50 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar border border-gray-100">
              <button
                onClick={() => {
                  setActiveCategory("pronta_entrega");
                  setActiveSubCategory("Todos");
                }}
                className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-8 py-3 sm:py-3.5 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${
                  activeCategory === "pronta_entrega"
                    ? "bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Pronta Entrega
              </button>
              <button
                onClick={() => {
                  setActiveCategory("encomenda");
                  setActiveSubCategory("Todos");
                }}
                className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-8 py-3 sm:py-3.5 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider transition-all ${
                  activeCategory === "encomenda"
                    ? "bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Sob Encomenda
              </button>
            </div>
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar camisa, time, seleção..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-medium text-gray-900 placeholder-gray-400 shadow-inner text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* NOVO: BOTÕES DE SUBCATEGORIAS */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
            {["Todos", ...SUBCATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveSubCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${
                  activeSubCategory === cat
                    ? "bg-[#0a0f30] text-white border-[#0a0f30] shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <section>
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {activeCategory === "pronta_entrega"
                  ? "Disponíveis para Pronta Entrega"
                  : "Modelos Sob Encomenda"}
                {activeSubCategory !== "Todos" && (
                  <span className="text-blue-600 ml-2">
                    ({activeSubCategory})
                  </span>
                )}
              </h2>
              {searchQuery && (
                <p className="text-gray-500 font-medium mt-2">
                  Resultados encontrados para "{searchQuery}"
                </p>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <StoreProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCartAction}
                    formatCurrency={formatCurrency}
                    showAlert={showAlert}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 bg-white rounded-[2rem] shadow-sm border border-gray-200 flex flex-col items-center px-4">
                <div className="bg-gray-50 p-6 rounded-full mb-6 border border-gray-100">
                  <Search className="text-gray-300 w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500 font-medium text-sm sm:text-lg">
                  Tente buscar por outro termo ou mude as categorias acima.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSubCategory("Todos");
                  }}
                  className="mt-8 px-8 py-3 bg-gray-100 text-gray-700 font-black hover:bg-gray-200 rounded-xl transition border border-gray-200"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </section>
        </main>

        <footer className="border-t border-white/10 pt-12 sm:pt-16 pb-8 mt-auto bg-[#05071a] relative z-20 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 mb-10 sm:mb-12">
              <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                <EssentialLogo size={72} light={false} />
                <h2 className="text-xl sm:text-2xl font-black tracking-widest mt-4">
                  ESSENTIAL
                </h2>
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] mb-8">
                  COMPANY
                </span>
                <div className="flex flex-col gap-6 w-full">
                  <div>
                    <p className="text-[11px] font-black text-blue-300/50 uppercase tracking-widest mb-1.5">
                      CEOs e Idealizadores
                    </p>
                    <p className="text-sm font-bold text-blue-100">
                      Erick Carvalho & Paulo Guilherme
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-blue-300/50 uppercase tracking-widest mb-2">
                      Acompanhe-nos
                    </p>
                    <a
                      href="https://instagram.com/essentialcompanyi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 text-blue-400 hover:text-white transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-5 py-3 rounded-xl border border-blue-500/20 font-bold text-sm w-max mx-auto md:mx-0 shadow-sm"
                    >
                      <InstagramIcon size={18} /> Essential Company
                    </a>
                  </div>
                </div>
              </div>
              <div className="md:col-span-8 bg-white/5 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-3xl border border-white/10 shadow-inner">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-widest mb-4 sm:mb-5 flex items-center gap-3 sm:gap-4">
                  <span className="w-8 sm:w-10 h-1 bg-blue-500 rounded-full"></span>{" "}
                  Quem Somos?
                </h3>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-[15px] text-blue-100/70 leading-relaxed font-medium">
                  <p>
                    Somos uma loja especializada em camisas de futebol premium,
                    criada por apaixonados pelo esporte e pela cultura que
                    envolve cada camisa.
                  </p>
                  <p>
                    Nosso objetivo é simples: entregar produtos de altíssima
                    qualidade, no padrão 1:1, para quem valoriza vestir o
                    futebol dentro e fora de campo.
                  </p>
                  <p>
                    Trabalhamos com camisas importadas, com acabamento impecável
                    e riqueza de detalhes, buscando sempre oferecer a melhor
                    experiência possível para nossos clientes - desde o
                    atendimento até a entrega.
                  </p>
                  <p>
                    Atendemos Curitiba e região, com estoque local e também
                    pedidos sob encomenda, incluindo camisas atuais, retrôs,
                    clubes nacionais e internacionais, além de seleções.
                  </p>
                  <p className="text-blue-300 font-bold pt-2 sm:pt-3 text-sm sm:text-base">
                    Aqui, você não compra apenas uma camisa - você leva
                    história, identidade e paixão pelo futebol.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6 sm:pt-8 border-t border-white/10 text-center flex flex-col items-center">
              <p className="text-blue-200/40 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-4">
                © {new Date().getFullYear()} ESSENTIAL COMPANY. Todos os
                direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-6 animate-fade-in relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gray-50 rounded-bl-full -z-10"></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Saldo Caixa
              </p>
              <h3
                className={`text-2xl sm:text-3xl font-black mt-1 sm:mt-2 ${
                  dashboardStats.balance >= 0 ? "text-gray-900" : "text-red-600"
                }`}
              >
                {formatCurrency(dashboardStats.balance)}
              </h3>
            </div>
            <div
              className={`p-3 sm:p-4 rounded-2xl ${
                dashboardStats.balance >= 0
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <DollarSign size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Entradas
              </p>
              <h3 className="text-xl sm:text-2xl font-black mt-1 sm:mt-2 text-green-600">
                {formatCurrency(dashboardStats.totalIncomes)}
              </h3>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-green-50 text-green-600">
              <TrendingUp size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Saídas
              </p>
              <h3 className="text-xl sm:text-2xl font-black mt-1 sm:mt-2 text-red-600">
                {formatCurrency(dashboardStats.totalExpenses)}
              </h3>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-red-50 text-red-600">
              <TrendingDown size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Valor Estoque Fixo
              </p>
              <h3 className="text-xl sm:text-2xl font-black mt-1 sm:mt-2 text-blue-800">
                {formatCurrency(dashboardStats.totalInventoryValue)}
              </h3>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-blue-50 text-blue-600">
              <Package size={20} className="sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 bg-red-50/50 flex items-center space-x-3">
              <AlertCircle className="text-red-500 w-6 h-6 sm:w-7 sm:h-7" />
              <h3 className="text-lg sm:text-xl font-black text-gray-900">
                Estoque Baixo (P. Entrega)
              </h3>
            </div>
            <div className="p-2 sm:p-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((p) => {
                  const img = getProductImages(p)[0];
                  return (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-2xl m-1 transition"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        {img ? (
                          <img
                            src={img}
                            alt={p.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="p-3 sm:p-4 rounded-xl bg-red-100 text-red-500">
                            <Shirt size={20} className="sm:w-6 sm:h-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1 text-sm sm:text-lg">
                            {p.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            Tam:{" "}
                            <strong className="text-gray-800">{p.size}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="text-center bg-red-50 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-red-100 ml-2">
                        <span className="block text-[9px] sm:text-[10px] font-black text-red-500 uppercase tracking-wider mb-0.5">
                          Restam
                        </span>
                        <span className="block text-xl sm:text-2xl font-black text-red-700 leading-none">
                          {p.stock}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 sm:p-10 text-center flex flex-col items-center">
                  <div className="bg-blue-50 p-4 sm:p-5 rounded-full mb-3 sm:mb-4">
                    <Package className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <p className="text-base sm:text-lg font-black text-gray-800">
                    Estoque Perfeito!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-black text-gray-900">
                Últimas Movimentações
              </h3>
              <button
                onClick={() => setActiveAdminTab("caixa")}
                className="text-xs sm:text-sm text-blue-600 font-bold hover:text-blue-800 transition"
              >
                Acessar Caixa
              </button>
            </div>
            <div className="p-2 sm:p-3">
              {transactions.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-2xl m-1 transition"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div
                      className={`p-3 sm:p-4 rounded-xl ${
                        t.type === "entrada"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {t.type === "entrada" ? (
                        <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                      ) : (
                        <TrendingDown size={20} className="sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1 text-sm sm:text-lg">
                        {t.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        {formatDate(t.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-black text-base sm:text-xl ml-2 whitespace-nowrap ${
                      t.type === "entrada" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "entrada" ? "+" : "-"}{" "}
                    {formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="p-8 sm:p-10 text-center">
                  <p className="text-gray-500 font-bold text-sm sm:text-lg">
                    Nenhum registro financeiro.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInventory = (filterType) => {
    const isProntaEntrega = filterType === "pronta_entrega";

    // NOVO: Filtrar com base na pesquisa dentro do Admin
    const filteredProducts = products.filter(
      (p) =>
        p.type === filterType &&
        (p.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
          p.team.toLowerCase().includes(adminSearchQuery.toLowerCase()))
    );

    return (
      <div className="space-y-6 animate-fade-in relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {isProntaEntrega ? "Meu Estoque" : "Encomendas"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {isProntaEntrega
                ? "Produtos físicos disponíveis"
                : "Catálogo para personalização"}
            </p>
          </div>

          {/* NOVA LUPA: Pesquisa no inventário admin */}
          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nome ou time..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition font-medium text-gray-900 placeholder-gray-400 shadow-inner text-sm"
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsProductModalOpen(filterType)}
            className="w-full md:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all font-black shadow-md active:scale-95"
          >
            <Plus size={20} className="mr-2" /> Novo Produto
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const images = getProductImages(product);
            const thumbUrl = images.length > 0 ? images[0] : null;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden flex flex-col relative group transition-all duration-300"
              >
                <button
                  onClick={() =>
                    handleDeleteDoc(
                      "products",
                      product.id,
                      "Tem certeza que deseja excluir este produto?"
                    )
                  }
                  className="absolute top-3 right-3 z-10 p-2.5 bg-white/90 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl shadow-md sm:opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                >
                  <Trash2 size={18} />
                </button>
                <div className="h-48 sm:h-56 bg-gray-100 relative flex items-center justify-center border-b border-gray-100">
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Shirt
                      size={48}
                      className="text-gray-300 sm:w-14 sm:h-14"
                    />
                  )}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
                      <ImageIcon size={12} /> {images.length} fotos
                    </div>
                  )}
                  {/* NOVO: Tag da categoria no card do admin */}
                  {product.subCategory && (
                    <div className="absolute bottom-2 right-2 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md">
                      {product.subCategory}
                    </div>
                  )}
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2 mb-1 sm:mb-2">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3 sm:mb-4">
                    {product.team}
                  </p>
                  <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 text-xs sm:text-sm border-b border-gray-100 pb-4 sm:pb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">
                        Preço Venda:
                      </span>
                      <strong className="text-blue-700 text-base sm:text-lg font-black">
                        {formatCurrency(product.price)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">
                        Custo Inicial:
                      </span>
                      <span className="text-gray-600 font-bold">
                        {formatCurrency(product.cost)}
                      </span>
                    </div>
                  </div>
                  {isProntaEntrega ? (
                    <div className="flex justify-between items-center mt-auto bg-gray-50 p-2.5 sm:p-3 rounded-2xl border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 mb-1">
                          Tamanho
                        </span>
                        <span className="text-xs sm:text-sm font-black text-gray-800 bg-white border border-gray-200 px-2 sm:px-3 py-1 rounded-lg text-center shadow-sm">
                          {product.size}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 mb-1">
                          Estoque
                        </span>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                          <button
                            onClick={() => handleUpdateStock(product.id, -1)}
                            disabled={product.stock === 0}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 transition disabled:opacity-50"
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="font-black text-base sm:text-lg w-6 sm:w-8 text-center text-blue-900">
                            {product.stock}
                          </span>
                          <button
                            onClick={() => handleUpdateStock(product.id, 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto bg-amber-50 p-3 sm:p-4 rounded-2xl text-center border border-amber-100">
                      <span className="block text-[10px] sm:text-xs font-black text-amber-600 uppercase tracking-widest mb-1">
                        Encomenda
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-600/70">
                        Tamanho escolhido pelo cliente
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 sm:py-16 text-center text-gray-400 font-black border-2 border-dashed border-gray-200 rounded-3xl bg-white">
              <Package
                size={40}
                className="mx-auto mb-3 sm:mb-4 text-gray-300 sm:w-12 sm:h-12"
              />{" "}
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBannersAdmin = () => (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Banners do Site
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Gerencie as imagens de destaque da loja
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsBannerModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all font-black shadow-md active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Novo Banner
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative group hover:shadow-xl transition-all"
          >
            <button
              onClick={() =>
                handleDeleteDoc(
                  "banners",
                  banner.id,
                  "Excluir este banner do site público?"
                )
              }
              className="absolute top-3 right-3 z-10 p-2.5 bg-white/90 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl shadow-md sm:opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
            >
              <Trash2 size={18} />
            </button>
            <div className="h-40 sm:h-48 bg-gray-100 relative">
              {banner.imageUrl && (
                <img
                  src={banner.imageUrl}
                  className="w-full h-full object-cover"
                  alt="Banner"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05071a]/90 to-transparent flex flex-col justify-end text-center p-4 sm:p-5">
                <h3 className="text-white font-black text-lg sm:text-xl drop-shadow-md mb-1">
                  {banner.title}
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm font-medium drop-shadow-md">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full py-12 sm:py-16 text-center text-gray-400 font-black border-2 border-dashed border-gray-200 rounded-3xl bg-white">
            <ImageIcon
              size={40}
              className="mx-auto mb-3 sm:mb-4 text-gray-300 sm:w-12 sm:h-12"
            />{" "}
            Nenhum banner configurado.
          </div>
        )}
      </div>
    </div>
  );

  const renderCashFlowAdmin = () => (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Fluxo de Caixa
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Controle de receitas e despesas
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsTransactionModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all font-black shadow-md active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Novo Lançamento
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="p-5 sm:p-6 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 sm:gap-5">
              <div
                className={`p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100 ${
                  t.type === "entrada"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {t.type === "entrada" ? (
                  <TrendingUp size={24} className="sm:w-7 sm:h-7" />
                ) : (
                  <TrendingDown size={24} className="sm:w-7 sm:h-7" />
                )}
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">
                  {formatDate(t.date)}
                </p>
                <h4 className="font-black text-gray-900 text-lg sm:text-xl">
                  {t.description}
                </h4>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
              <span
                className={`text-xl sm:text-2xl font-black ${
                  t.type === "entrada" ? "text-green-600" : "text-red-600"
                }`}
              >
                {t.type === "entrada" ? "+" : "-"} {formatCurrency(t.amount)}
              </span>
              <button
                onClick={() =>
                  handleDeleteDoc(
                    "transactions",
                    t.id,
                    "Excluir esta movimentação permanentemente?"
                  )
                }
                className="text-gray-400 hover:text-white hover:bg-red-500 bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-sm transition"
              >
                <Trash2 size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="p-12 sm:p-16 text-center text-gray-400 font-black bg-gray-50">
            <DollarSign
              size={40}
              className="mx-auto mb-3 sm:mb-4 text-gray-300 sm:w-12 sm:h-12"
            />{" "}
            Nenhum registro financeiro.
          </div>
        )}
      </div>
    </div>
  );

  // --- RENDERIZAÇÃO LOGIN
  if (currentView === "admin_login" && !isLogged) {
    return (
      <div className="min-h-screen bg-[#05071a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] w-full max-w-md p-6 sm:p-10 animate-fade-in relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] mt-12 sm:mt-0">
          <button
            onClick={() => setCurrentView("store")}
            className="absolute top-4 sm:top-6 left-4 sm:left-6 text-blue-300 hover:text-white flex items-center text-xs sm:text-sm font-bold transition"
          >
            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" /> Voltar
          </button>
          <div className="flex flex-col items-center mb-8 sm:mb-10 mt-4 sm:mt-6">
            <EssentialLogo size={90} light={false} />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-widest mt-5 sm:mt-6 text-center">
              PAINEL GERENCIAL
            </h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            {loginError && (
              <div className="bg-red-500/20 text-red-300 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-bold text-center border border-red-500/30">
                {loginError}
              </div>
            )}
            <div className="relative">
              <User
                size={20}
                className="absolute left-4 sm:left-5 top-4 text-blue-400 pointer-events-none sm:w-[22px] sm:h-[22px]"
              />
              <input
                type="text"
                required
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4 bg-black/30 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-300/30 outline-none font-bold transition shadow-inner text-sm sm:text-base"
                placeholder="Usuário Admin"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 sm:left-5 top-4 text-blue-400 pointer-events-none sm:w-[22px] sm:h-[22px]"
              />
              <input
                type="password"
                required
                className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4 bg-black/30 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-300/30 outline-none font-bold transition shadow-inner text-sm sm:text-base"
                placeholder="Senha de Acesso"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg hover:from-blue-500 hover:to-blue-700 transition shadow-[0_0_20px_rgba(37,99,235,0.4)] mt-2 sm:mt-4 active:scale-95"
            >
              Acessar Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO GERAL DA APP
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans relative overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      {/* TOP BAR - DESTAQUE ENTREGAS */}
      <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-blue-50 py-2 px-4 flex justify-center items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-black uppercase tracking-widest z-50 relative border-b border-blue-950 shadow-sm">
        <Truck size={16} className="text-blue-300 sm:w-[18px] sm:h-[18px]" />
        <span>
          Entregas em <strong className="text-white">Curitiba e região</strong>
        </span>
      </div>

      <header
        className={`sticky top-0 z-40 w-full text-white shadow-xl transition-colors duration-300 bg-gradient-to-r from-[#05071a] via-[#0a0f30] to-[#05071a]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-20 sm:h-24">
            <div
              className="flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:opacity-80 transition"
              onClick={() => setCurrentView("store")}
            >
              <EssentialLogo size={56} light={false} />
              <div className="flex-col hidden sm:flex">
                <h1 className="text-2xl sm:text-3xl font-black tracking-widest leading-none text-white">
                  ESSENTIAL
                </h1>
                <span className="text-[10px] sm:text-xs text-blue-400 font-black uppercase tracking-[0.4em] mt-1">
                  COMPANY
                </span>
              </div>
            </div>

            {currentView === "store" ? (
              <div className="flex items-center space-x-2 sm:space-x-5">
                <button
                  onClick={() => setCurrentView("admin_login")}
                  className="flex items-center text-[10px] sm:text-xs font-black tracking-wider uppercase text-blue-200 hover:text-white transition bg-white/5 hover:bg-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-white/10 shadow-sm"
                >
                  <Settings
                    size={16}
                    className="sm:mr-2 sm:w-[18px] sm:h-[18px]"
                  />
                  <span className="hidden sm:inline">Área Restrita</span>
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 sm:p-3 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 rounded-xl transition flex items-center gap-2 font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95 border border-blue-500/30"
                >
                  <ShoppingCart
                    size={20}
                    className="text-white sm:w-[22px] sm:h-[22px]"
                  />
                  <span className="hidden sm:inline uppercase tracking-wider text-sm text-white">
                    Carrinho
                  </span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] sm:text-xs font-black w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-full border-2 sm:border-[3px] border-[#0a0f30] shadow-sm">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <>
                <nav className="hidden lg:flex space-x-1.5 bg-white/5 p-1.5 rounded-2xl backdrop-blur-sm border border-white/10">
                  {[
                    { id: "dashboard", icon: LayoutDashboard, label: "Painel" },
                    {
                      id: "pronta_entrega",
                      icon: Package,
                      label: "Meu Estoque",
                    },
                    {
                      id: "encomendas",
                      icon: ShoppingBag,
                      label: "Encomendas",
                    },
                    { id: "banners", icon: ImageIcon, label: "Banners" },
                    { id: "caixa", icon: DollarSign, label: "Financeiro" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAdminTab(tab.id)}
                      className={`flex items-center px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                        activeAdminTab === tab.id
                          ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                          : "text-blue-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <tab.icon size={16} className="mr-2" /> {tab.label}
                    </button>
                  ))}
                </nav>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={() => setCurrentView("store")}
                    className="text-[10px] sm:text-xs uppercase tracking-wider font-black text-blue-300 hover:text-white flex items-center transition bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10"
                  >
                    <ChevronLeft
                      size={14}
                      className="mr-1 sm:w-[16px] sm:h-[16px]"
                    />
                    <span className="hidden sm:inline">Ver Site</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition font-black text-[10px] sm:text-xs uppercase tracking-wider border border-red-500/20"
                  >
                    <LogOut
                      size={14}
                      className="sm:mr-2 sm:w-[16px] sm:h-[16px]"
                    />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {currentView === "admin" && (
            <div className="lg:hidden flex space-x-2 overflow-x-auto pb-4 pt-1 sm:pt-2 no-scrollbar border-t border-white/10 mt-1 sm:mt-2">
              {[
                { id: "dashboard", icon: LayoutDashboard, label: "Painel" },
                { id: "pronta_entrega", icon: Package, label: "Estoque" },
                { id: "encomendas", icon: ShoppingBag, label: "Encomendas" },
                { id: "banners", icon: ImageIcon, label: "Banners" },
                { id: "caixa", icon: DollarSign, label: "Caixa" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`flex-shrink-0 flex items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all ${
                    activeAdminTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                      : "bg-white/5 text-blue-300 border border-white/10"
                  }`}
                >
                  {tab.label}{" "}
                  <tab.icon
                    size={16}
                    className="ml-1.5 sm:ml-2 sm:w-[18px] sm:h-[18px]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {currentView === "store" ? (
        renderStoreFront()
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
          {activeAdminTab === "dashboard" && renderDashboard()}
          {activeAdminTab === "pronta_entrega" &&
            renderInventory("pronta_entrega")}
          {activeAdminTab === "encomendas" && renderInventory("encomenda")}
          {activeAdminTab === "banners" && renderBannersAdmin()}
          {activeAdminTab === "caixa" && renderCashFlowAdmin()}
        </main>
      )}

      {/* MODAIS GLOBAIS */}
      <ProductModal
        isOpen={isProductModalOpen !== false}
        type={
          typeof isProductModalOpen === "string"
            ? isProductModalOpen
            : "pronta_entrega"
        }
        onClose={() => setIsProductModalOpen(false)}
        onSave={(data) => {
          handleSaveDoc("products", data);
          setIsProductModalOpen(false);
        }}
        showAlert={showAlert}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={(data) => {
          handleSaveDoc("transactions", data);
          setIsTransactionModalOpen(false);
        }}
      />

      <BannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onSave={(data) => {
          handleSaveDoc("banners", data);
          setIsBannerModalOpen(false);
        }}
        showAlert={showAlert}
      />

      <DialogModal
        dialog={dialog}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        updateCartQty={updateCartQty} // Nova prop passada para o Carrinho
        finishOrderWhatsApp={finishOrderWhatsApp}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}

export default App;
