import * as React from "react";
import { cn } from "@/lib/utils";

const Footer: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <footer className={cn("bg-black text-white py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">FoodieExpress</h3>
            <p className="text-gray-300">
              Delivering delicious meals right to your doorstep. Fast, fresh, and flavorful!
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Menu</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Restaurants</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Cuisines</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Italian</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Chinese</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Mexican</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Indian</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>123 Food Street</p>
              <p>New York, NY 10001</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: hello@foodieexpress.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2024 FoodieExpress. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
