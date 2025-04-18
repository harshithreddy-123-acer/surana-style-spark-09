
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Palette, MessageSquare, Image, BookImage, Calculator, Mic, Sparkles } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Palette,
      title: 'Style Quiz',
      description: 'Find your perfect interior design style through our interactive quiz.',
      linkTo: '/style-quiz',
      imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: MessageSquare,
      title: 'AI Design Chat',
      description: 'Get interior design advice from our AI assistant anytime.',
      linkTo: '/chatbot',
      imageUrl: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Image,
      title: 'Design Generator',
      description: 'Generate stunning interior designs with AI based on your preferences.',
      linkTo: '/design-generator',
      imageUrl: 'https://images.unsplash.com/photo-1618755841385-ac835e8cd0c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: BookImage,
      title: 'Moodboard Creator',
      description: 'Create beautiful moodboards to visualize your design ideas.',
      linkTo: '/moodboard',
      imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Mic,
      title: 'Voice to Design',
      description: 'Describe your ideal space with your voice and see it visualized instantly.',
      linkTo: '/voice-design',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Calculator,
      title: 'Budget Planner',
      description: 'Plan and track your interior design budget with our easy-to-use tool.',
      linkTo: '/budget-planner',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
  ];

  const testimonials = [
    {
      quote: "Surana AI transformed my living room design process! The style quiz was spot on and the AI-generated designs were exactly what I was looking for.",
      author: "Sarah J.",
      role: "Homeowner"
    },
    {
      quote: "As an interior designer, I use Surana AI to generate initial concepts for my clients. It saves me hours of work and provides great inspiration.",
      author: "Michael T.",
      role: "Interior Designer"
    },
    {
      quote: "The budget planner feature helped me stay on track with my kitchen renovation. I could plan everything within my budget and avoid surprises.",
      author: "Rebecca L.",
      role: "DIY Enthusiast"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Reimagine Your Space</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Surana AI offers a suite of powerful tools to help you design, visualize, and plan your perfect interior space.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                linkTo={feature.linkTo}
                imageUrl={feature.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Transform your space in just a few simple steps with our AI-powered design platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold">1</span>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Discover Your Style</h3>
              <p className="text-muted-foreground">
                Take our style quiz to identify your design preferences and aesthetic.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold">2</span>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Generate Designs</h3>
              <p className="text-muted-foreground">
                Use our AI to create customized interior designs based on your preferences.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold">3</span>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Bring Your Design to Life</h3>
              <p className="text-muted-foreground">
                Save your designs, plan your budget, and transform your space.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/style-quiz">
                Start Your Design Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">What Our Users Say</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their spaces with Surana AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-lg p-8 shadow-md relative">
                <div className="absolute top-4 right-4 text-accent">
                  <Sparkles className="h-5 w-5" />
                </div>
                <blockquote className="text-lg italic mb-4">"{testimonial.quote}"</blockquote>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of users who are creating beautiful spaces with Surana AI's intuitive design tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/style-quiz">Take Style Quiz</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/chatbot">Chat with Designer</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-2xl font-serif font-bold text-primary">Surana</span>
                <span className="ml-1 text-2xl font-serif text-accent font-bold">AI</span>
              </div>
              <p className="text-muted-foreground mt-2">AI-powered interior design assistant</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-medium mb-2">Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/style-quiz" className="hover:text-accent">Style Quiz</Link></li>
                  <li><Link to="/chatbot" className="hover:text-accent">Design Chat</Link></li>
                  <li><Link to="/design-generator" className="hover:text-accent">Design Generator</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Tools</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/moodboard" className="hover:text-accent">Moodboard Creator</Link></li>
                  <li><Link to="/budget-planner" className="hover:text-accent">Budget Planner</Link></li>
                  <li><Link to="/voice-design" className="hover:text-accent">Voice to Design</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-accent">Help Center</a></li>
                  <li><a href="#" className="hover:text-accent">Contact Us</a></li>
                  <li><a href="#" className="hover:text-accent">FAQs</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-accent">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-accent">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-accent">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Surana AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
