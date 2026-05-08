import { useEffect, useState } from 'react';

interface Product {
  id: string;
  curso: string;
  precio: number;
  plazas: number;
  categoria: string;
  duracion: string;
  nivel: string;
  valoracion: number;
  imagen: string;
}

const categoryColors: Record<string, string> = {
  'Programación': 'bg-blue-100 text-blue-700',
  'Diseño': 'bg-pink-100 text-pink-700',
  'Marketing': 'bg-yellow-100 text-yellow-700',
};

const categoryIcons: Record<string, string> = {
  'Programación': '💻',
  'Diseño': '🎨',
  'Marketing': '📣',
};

const levelColors: Record<string, string> = {
  'Principiante': 'bg-green-100 text-green-700',
  'Intermedio': 'bg-yellow-100 text-yellow-700',
  'Avanzado': 'bg-red-100 text-red-700',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

interface FormData {
  nombre: string;
  email: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({ nombre: '', email: '' });
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [darkMode, setDarkMode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar los cursos');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleMatricularme = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ nombre: '', email: '' });
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.email) {
      alert('Por favor rellena todos los campos');
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`/api/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProduct!.id, nombre: formData.nombre, email: formData.email })
      });
      setSuccess(`¡${formData.nombre}, te has matriculado en "${selectedProduct!.curso}"! Recibirás información en ${formData.email}`);
      setSelectedProduct(null);
      fetchProducts();
      setTimeout(() => setSuccess(null), 5000);
    } catch {
      setError('Error al procesar la matrícula');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = () => {
    if (loginEmail === 'admin@test.com' && loginPassword === '1234') {
      setLoggedIn(true);
      setShowAuth(false);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Email o contraseña incorrectos');
    }
  };

  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.categoria)))];
  const filteredProducts = selectedCategory === 'Todas'
    ? products
    : products.filter(p => p.categoria === selectedCategory);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">📚</div>
        <p className="text-gray-500 text-lg">Cargando cursos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* Header */}
      <header className={`border-b px-8 py-4 sticky top-0 z-10 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Learning<span className="text-orange-500">Inventory</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#cursos" className={`hover:text-orange-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cursos</a>
            <a href="#cursos" className={`hover:text-orange-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Categorías</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`text-xl px-2 py-1 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Cambiar modo"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            {loggedIn ? (
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>👋 Admin</span>
                <button
                  onClick={() => setLoggedIn(false)}
                  className="text-sm text-orange-500 hover:text-orange-600 font-semibold"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                Acceder
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-200 text-sm font-semibold uppercase tracking-widest mb-2">La plataforma #1 de cursos online</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Aprende. Crece.<br />Transforma tu carrera.
          </h1>
          <p className="text-orange-100 text-lg mb-6 max-w-xl">Accede a los mejores cursos digitales y aprende a tu ritmo desde cualquier lugar.</p>
          <button
            onClick={() => document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
          >
            Ver todos los cursos →
          </button>
        </div>
      </div>

      {/* Notificación éxito */}
      {success && (
        <div className="max-w-7xl mx-auto mt-6 px-8">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
            ✅ {success}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main id="cursos" className="max-w-7xl mx-auto px-8 py-10 flex gap-8">

        {/* Sidebar categorías */}
        <aside className="hidden lg:block w-48 shrink-0">
          <h3 className={`font-bold mb-4 text-sm uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Categorías</h3>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat
                      ? 'bg-orange-100 text-orange-700 font-semibold'
                      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat !== 'Todas' && categoryIcons[cat]} {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid cursos */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedCategory === 'Todas' ? 'Todos los cursos' : selectedCategory}
            </h2>
            <span className="text-sm text-gray-500">{filteredProducts.length} cursos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border flex flex-col overflow-hidden group ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
              >
                {/* Imagen */}
                <div className="h-40 relative overflow-hidden">
                  {product.imagen ? (
                    <img
                      src={product.imagen}
                      alt={product.curso}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <span className="text-6xl">{categoryIcons[product.categoria] || '📚'}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColors[product.nivel] || 'bg-gray-100 text-gray-600'}`}>
                      {product.nivel}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit mb-2 ${categoryColors[product.categoria] || 'bg-gray-100 text-gray-600'}`}>
                    {product.categoria}
                  </span>
                  <h3 className={`font-bold text-base leading-snug mb-2 group-hover:text-orange-500 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.curso}
                  </h3>
                  <StarRating rating={product.valoracion} />
                  <p className="text-xs text-gray-500 mt-2">⏱️ {product.duracion}</p>
                  <p className="text-2xl font-extrabold text-orange-500 mt-3">${product.precio}</p>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Plazas disponibles</span>
                      <span className="font-medium">{product.plazas}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          product.plazas > 50 ? 'bg-green-400' : product.plazas > 20 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.round((product.plazas / 100) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleMatricularme(product)}
                    disabled={product.plazas === 0}
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                  >
                    {product.plazas === 0 ? 'Sin plazas' : 'Matricularme →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal matriculación */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>¡Casi listo! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">Completa tu inscripción en <span className="font-semibold text-orange-500">{selectedProduct.curso}</span></p>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedProduct(null)}
                className={`flex-1 border font-semibold py-3 rounded-xl transition-colors text-sm ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
              >
                {submitting ? 'Procesando...' : 'Confirmar matrícula'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal login/registro */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>

            {/* Pestañas */}
            <div className="flex mb-6 border-b border-gray-200">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                  authTab === 'login'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                  authTab === 'register'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Registrarse
              </button>
            </div>

            {authTab === 'login' ? (
              <>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>¡Bienvenido de nuevo! 👋</h2>
                <div className="space-y-4">
                  <div>
                    <label className={`text-sm font-medium block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`text-sm font-medium block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Crea tu cuenta 🚀</h2>
                <div className="space-y-4">
                  <div>
                    <label className={`text-sm font-medium block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombre completo</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`text-sm font-medium block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`text-sm font-medium block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAuth(false)}
                className={`flex-1 border font-semibold py-3 rounded-xl transition-colors text-sm ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Cancelar
              </button>
              <button
                onClick={authTab === 'login' ? handleLogin : () => { alert('Próximamente: registro real'); setShowAuth(false); }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
              >
                {authTab === 'login' ? 'Entrar' : 'Crear cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}