const Footer = () => {
    return (
        <footer className="bg-white py-8 dark:bg-neutral-950">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
            <p className="mb-2">© 2023 SyncStream. All rights reserved.</p>
            <nav className="flex justify-center space-x-4">
              <a href="#" className="hover:text-blue-500">Terms of Service</a>
              <a href="#" className="hover:text-blue-500">Privacy Policy</a>
              <a href="#" className="hover:text-blue-500">Contact Us</a>
            </nav>
          </div>
        </footer>
    );
}

export default Footer;