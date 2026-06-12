import React from 'react';

const Footer: React.FC<{ companyName?: string }> = ({ companyName = 'Zytherion Biovance' }) => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/30 backdrop-blur">
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3 text-sm">
          <div className="text-white/85">
            <div className="font-semibold">{companyName}</div>
            <p className="text-white/70 mt-1">Advanced environmental research platform. Nature intelligence for everyone.</p>
          </div>
          <div className="text-white/75 grid grid-cols-2 gap-2">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Careers</a>
            <a href="#" className="hover:text-white">Research</a>
          </div>
          <div className="text-white/60">
            <div>© {new Date().getFullYear()} {companyName}</div>
            <div className="text-xs mt-1">All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;