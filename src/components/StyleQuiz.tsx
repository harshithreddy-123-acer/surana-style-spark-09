
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Check, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    image: string;
    style: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which room best matches your style?",
    options: [
      {
        id: "1a",
        text: "Modern Minimalist",
        image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "modern"
      },
      {
        id: "1b",
        text: "Cozy Traditional",
        image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "traditional"
      },
      {
        id: "1c",
        text: "Scandinavian",
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "scandinavian"
      },
      {
        id: "1d",
        text: "Industrial",
        image: "https://images.unsplash.com/photo-1505409628601-edc9af17fda6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "industrial"
      },
    ]
  },
  {
    id: 2,
    question: "What's your color palette preference?",
    options: [
      {
        id: "2a",
        text: "Neutral & Earthy",
        image: "https://images.unsplash.com/photo-1615529179035-e760f6a2dcee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "neutral"
      },
      {
        id: "2b",
        text: "Bold & Colorful",
        image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "colorful"
      },
      {
        id: "2c",
        text: "Monochromatic",
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "monochromatic"
      },
      {
        id: "2d",
        text: "Pastels",
        image: "https://images.unsplash.com/photo-1558882224-dda166733046?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "pastel"
      },
    ]
  },
  {
    id: 3,
    question: "What type of furniture do you prefer?",
    options: [
      {
        id: "3a",
        text: "Contemporary Clean Lines",
        image: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "contemporary"
      },
      {
        id: "3b",
        text: "Vintage & Antique",
        image: "https://images.unsplash.com/photo-1618755841385-ac835e8cd0c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "vintage"
      },
      {
        id: "3c",
        text: "Comfortable & Plush",
        image: "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "comfortable"
      },
      {
        id: "3d",
        text: "Eclectic Mix",
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "eclectic"
      },
    ]
  },
  {
    id: 4,
    question: "How much natural light does your space get?",
    options: [
      {
        id: "4a",
        text: "Abundant Sunlight",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "bright"
      },
      {
        id: "4b",
        text: "Moderate Light",
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "moderate"
      },
      {
        id: "4c",
        text: "Limited Light",
        image: "https://images.unsplash.com/photo-1520453803296-c39eabe2dab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "limited"
      },
      {
        id: "4d",
        text: "Low Light",
        image: "https://images.unsplash.com/photo-1615529179035-e760f6a2dcee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "low"
      },
    ]
  },
  {
    id: 5,
    question: "What's your budget range for this project?",
    options: [
      {
        id: "5a",
        text: "Budget-Friendly",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "budget"
      },
      {
        id: "5b",
        text: "Mid-Range",
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "mid-range"
      },
      {
        id: "5c",
        text: "High-End",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "high-end"
      },
      {
        id: "5d",
        text: "Luxury",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        style: "luxury"
      },
    ]
  }
];

const StyleQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleOptionSelect = (optionId: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: optionId });
  };

  const calculateStyleProfile = () => {
    // Simple calculation for demo purposes
    const styles = Object.entries(answers).map(([questionId, optionId]) => {
      const question = questions.find(q => q.id === Number(questionId));
      const option = question?.options.find(o => o.id === optionId);
      return option?.style || '';
    });
    
    // Count occurrences of each style
    const styleCounts: Record<string, number> = {};
    styles.forEach(style => {
      if (style) {
        styleCounts[style] = (styleCounts[style] || 0) + 1;
      }
    });
    
    // Find most common style
    let maxCount = 0;
    let dominantStyle = '';
    
    Object.entries(styleCounts).forEach(([style, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantStyle = style;
      }
    });
    
    return {
      dominantStyle,
      styles: styleCounts
    };
  };

  const handleCompleteQuiz = () => {
    const styleProfile = calculateStyleProfile();
    toast.success("Style quiz completed!", {
      description: `Your dominant style is: ${styleProfile.dominantStyle.charAt(0).toUpperCase() + styleProfile.dominantStyle.slice(1)}`,
    });
    
    // Save results to localStorage for use in other components
    localStorage.setItem('styleProfile', JSON.stringify(styleProfile));
    
    // Navigate to design generator with style preference
    navigate('/design-generator', { state: { styleProfile } });
  };
  
  const currentQ = questions[currentQuestion];
  const isAnswered = answers[currentQ.id] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;
  
  if (showResults) {
    const styleProfile = calculateStyleProfile();
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border shadow-lg">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2">Your Style Profile</h2>
              <p className="text-muted-foreground">Based on your answers, we've created your personalized style profile.</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-4">Your Dominant Style:</h3>
              <div className="text-2xl font-serif text-accent">
                {styleProfile.dominantStyle.charAt(0).toUpperCase() + styleProfile.dominantStyle.slice(1)}
              </div>
              
              <h3 className="text-xl font-bold mt-6 mb-4">Style Breakdown:</h3>
              <div className="space-y-2">
                {Object.entries(styleProfile.styles).map(([style, count]) => (
                  <div key={style} className="flex items-center">
                    <div className="w-32 font-medium">
                      {style.charAt(0).toUpperCase() + style.slice(1)}:
                    </div>
                    <div className="w-full bg-background rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-accent h-full" 
                        style={{ width: `${(count / questions.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 text-sm">{Math.round((count / questions.length) * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowResults(false)} 
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Retake Quiz
              </Button>
              <Button onClick={handleCompleteQuiz}>
                Continue to Design Generator <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border shadow-lg">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
              <Palette className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-serif font-bold">Style Quiz</h2>
            <p className="text-muted-foreground mt-2">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-medium mb-6">{currentQ.question}</h3>
            
            <RadioGroup value={answers[currentQ.id]} onValueChange={handleOptionSelect}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={option.id}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      answers[currentQ.id] === option.id
                        ? "border-accent ring-2 ring-accent ring-offset-2"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={option.image}
                        alt={option.text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <span>{option.text}</span>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
            >
              {isLastQuestion ? "See Results" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleQuiz;
