import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Customize the title, description, and CTA button */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
            <p className="text-xl mb-8">Discover amazing features and services tailored for you.</p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </Button>
          </div>
        </section>

        {/* Categories Section - Replace with your own categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  {/* Replace with your own images */}
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Service 1 Image</span>
                  </div>
                  <CardTitle>Service 1</CardTitle>
                  <CardDescription>Description of service 1</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Learn More</Button>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Service 2 Image</span>
                  </div>
                  <CardTitle>Service 2</CardTitle>
                  <CardDescription>Description of service 2</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Learn More</Button>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Service 3 Image</span>
                  </div>
                  <CardTitle>Service 3</CardTitle>
                  <CardDescription>Description of service 3</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Learn More</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Items Section - Customize with your products/services */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-full h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Item 1</span>
                  </div>
                  <CardTitle>Item 1</CardTitle>
                  <CardDescription>$XX.XX</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Add to Cart</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-full h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Item 2</span>
                  </div>
                  <CardTitle>Item 2</CardTitle>
                  <CardDescription>$XX.XX</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Add to Cart</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-full h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Item 3</span>
                  </div>
                  <CardTitle>Item 3</CardTitle>
                  <CardDescription>$XX.XX</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Add to Cart</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-full h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">Item 4</span>
                  </div>
                  <CardTitle>Item 4</CardTitle>
                  <CardDescription>$XX.XX</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Add to Cart</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
