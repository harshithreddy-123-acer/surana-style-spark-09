
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="gradient-bg py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-primary">
              Transform Your Space with AI-Powered Design
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Surana AI combines interior design expertise with artificial intelligence to help you create your dream space. Get personalized design recommendations, visualize your ideas, and transform your home.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-medium">
                <Link to="/style-quiz">
                  Take Style Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium">
                <Link to="/chatbot">
                  Chat with Designer
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-surana-300 flex items-center justify-center text-white text-xs">A</div>
                <div className="w-8 h-8 rounded-full bg-sage-500 flex items-center justify-center text-white text-xs">S</div>
                <div className="w-8 h-8 rounded-full bg-terracotta-400 flex items-center justify-center text-white text-xs">J</div>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">1,000+</span> designers trust Surana AI
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern living room with plant" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  "Surana AI helped me redesign my living room in minutes. The AI suggestions were spot on!"
                </p>
                <p className="text-xs text-muted-foreground mt-1">— Sara T., Interior Designer</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-terracotta-200/50 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
