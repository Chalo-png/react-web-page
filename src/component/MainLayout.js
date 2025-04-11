import { FaSearch, FaShoppingBag } from 'react-icons/fa';

function MainLayout({ children, filters, setFilters, classifications }) {
  return (
    <div className="min-h-screen bg-rich-black">
      {/* Navbar */}
      <nav className="navbar bg-black-pearl text-vintage-gold px-8 py-4 border-b border-gold/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-2xl font-cinzel p-0">
            <FaShoppingBag className="mr-3 text-gold animate-gold-pulse" />
            <span className="text-gold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Monaco Talagante
            </span>
          </a>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search our exquisite collection..."
              className="input w-full pl-6 pr-12 bg-velvet-black border-2 border-gold/20 rounded-full focus:border-gold focus:ring-2 focus:ring-gold/30 placeholder:text-gold/40 transition-all duration-300 font-light"
            />
            <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gold/60 group-hover:text-gold transition-colors" />
          </div>
        </div>

        <div className="flex-1 justify-end space-x-4">
          <button className="btn btn-ghost font-light hover:bg-gold/10 hover:text-gold px-6 rounded-full border border-gold/20 transition-all duration-300 group">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent group-hover:text-transparent">
              Gentlemen
            </span>
          </button>
          <button className="btn btn-ghost font-light hover:bg-gold/10 hover:text-gold px-6 rounded-full border border-gold/20 transition-all duration-300 group">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent group-hover:text-transparent">
              Ladies
            </span>
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container mx-auto px-8 py-12">
        <div className="flex gap-8 mb-8">
          {/* Filtros */}
          <div className="w-72 bg-velvet-black p-6 rounded-xl border border-gold/20 shadow-gold-glow h-fit sticky top-24">
            <h2 className="text-xl font-cinzel mb-6 text-gold border-b border-gold/20 pb-4 gold-underline">
              Curate Your Selection
            </h2>

            <div className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gold/80 font-light">Collection</span>
                </label>
                <select
                  className="select select-bordered bg-velvet-black text-gold border-gold/20 rounded-lg focus:ring-1 focus:ring-gold/40 font-light"
                  onChange={(e) => setFilters({ ...filters, classification: e.target.value })}
                >
                  <option value="">All Collections</option>
                  {classifications.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gold/80 font-light">Price Range</span>
                </label>
                <select
                  className="select select-bordered bg-velvet-black text-gold border-gold/20 rounded-lg focus:ring-1 focus:ring-gold/40 font-light"
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                >
                  <option value="">All Price Points</option>
                  <option value="10000">Under $10,000</option>
                  <option value="50000">Under $50,000</option>
                  <option value="100000">Under $100,000</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gold/80 font-light">Clientèle</span>
                </label>
                <select
                  className="select select-bordered bg-velvet-black text-gold border-gold/20 rounded-lg focus:ring-1 focus:ring-gold/40 font-light"
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                >
                  <option value="">All Patrons</option>
                  <option value="men">Gentlemen</option>
                  <option value="women">Ladies</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contenido dinámico (vista de productos o detalles) */}
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
