import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">HotelX</h3>
            <p className="text-white mb-4">Modern hotel management system with secure international payment processing.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white hover:text-blue-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white hover:text-blue-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white hover:text-blue-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-white hover:text-blue-300">{t('common.dashboard')}</a></li>
              <li><a href="/rooms" className="text-white hover:text-blue-300">{t('nav.rooms')}</a></li>
              <li><a href="/bookings" className="text-white hover:text-blue-300">{t('nav.bookings')}</a></li>
              <li><a href="/payments" className="text-white hover:text-blue-300">{t('nav.payments')}</a></li>
              <li><a href="/settings" className="text-white hover:text-blue-300">{t('nav.settings')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white hover:text-blue-300">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="text-white hover:text-blue-300">{t('footer.documentation')}</a></li>
              <li><a href="#" className="text-white hover:text-blue-300">{t('footer.api')}</a></li>
              <li><a href="#" className="text-white hover:text-blue-300">{t('footer.contactUs')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.contact')}</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-2 text-white" size={16} />
                <span className="text-white">123 Hotel Street, City, Country</span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-2 text-white" size={16} />
                <span className="text-white">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-2 text-white" size={16} />
                <span className="text-white">info@hotelx.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} HotelX. {t('footer.allRightsReserved')}</p>
          <div className="flex justify-center mt-2 space-x-4">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
