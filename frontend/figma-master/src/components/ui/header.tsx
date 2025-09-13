import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, User } from "lucide-react";

const Header: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <header className={cn("bg-white shadow-md", className)}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Replace "YourBrand" with your actual brand name */}
          <h1 className="text-2xl font-bold text-primary">YourBrand</h1>
          <nav className="hidden md:flex space-x-6">
            {/* Customize navigation links as needed */}
            <a href="#" className="text-gray-700 hover:text-primary">Home</a>
            <a href="#" className="text-gray-700 hover:text-primary">Products</a>
            <a href="#" className="text-gray-700 hover:text-primary">Services</a>
            <a href="#" className="text-gray-700 hover:text-primary">About</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          {/* Remove ShoppingCart if not needed for your app */}
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
