import React from 'react';

const Footer = () => {
    return (
        <footer className="footer bg-[#292929] text-white py-8">
            <div className="footer-content flex justify-between items-center">
                <img src="/grindr.svg" alt="Grindr Logo" className="footer-logo w-40 h-40" />
                <nav className="footer-nav">
                    <ul className="flex space-x-4 me-8">
                        <li className='hover:text-yellow-400'><a href="/contact">Contact</a></li>
                        <li className='hover:text-yellow-400'><a href="/privacy">Privacy Policy</a></li>
                        <li className='hover:text-yellow-400'><a href="/terms">Terms of Service</a></li>
                    </ul>
                </nav>
            </div>
            <p className="text-center mt-4">&copy; 2021, All rights reserved</p>
        </footer>
    );
}

export default Footer;