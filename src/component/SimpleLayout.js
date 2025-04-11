import Footer from './Footer';
import Navbar from './Navbar';

function SimpleLayout({ children, searchTerm, setSearchTerm }) {
  return (
    <div className="min-h-screen flex flex-col bg-rich-black text-gold">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      <main className="flex-grow container mx-auto px-4 ">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default SimpleLayout;
