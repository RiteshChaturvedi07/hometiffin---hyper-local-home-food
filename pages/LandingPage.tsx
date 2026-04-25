
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Ghar ka Khana, <br />
            <span className="text-orange-600 underline decoration-amber-300">Away from Home</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Delicious, hygienic home-cooked meals by local 'Aunties' for students and bachelors. Subscription plans that fit your budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login" className="bg-orange-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-orange-700 shadow-xl shadow-orange-200 transition">
              Find Food Near Me
            </Link>
            <Link to="/login" className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-orange-50 transition">
              Become a Home Cook
            </Link>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-grid-cols-3 gap-12">
            <FeatureCard 
              title="Freshly Cooked"
              description="No preservatives, no restaurant grease. Just honest food cooked in local kitchens."
              icon="🍳"
            />
            <FeatureCard 
              title="Subscription Plans"
              description="Tired of ordering every day? Subscribe to weekly or monthly tiffins and save money."
              icon="📅"
            />
            <FeatureCard 
              title="Aunty's Secret Recipes"
              description="The taste you've missed since leaving home. Regional specialties made with love."
              icon="🥘"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => (
  <div className="p-8 bg-amber-50 rounded-3xl text-center hover:scale-105 transition duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;
