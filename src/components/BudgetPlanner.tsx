
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, DollarSign, Trash, Plus, Save, Download, FileText } from 'lucide-react';

interface BudgetItem {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  actualCost?: number;
}

interface BudgetPlan {
  id: string;
  name: string;
  totalBudget: number;
  items: BudgetItem[];
}

const defaultCategories = [
  'Furniture',
  'Decor',
  'Lighting',
  'Flooring',
  'Paint',
  'Textiles',
  'Fixtures',
  'Appliances',
  'Services',
  'Other'
];

const BudgetPlanner = () => {
  const [budgetPlans, setBudgetPlans] = useState<BudgetPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<BudgetPlan>({
    id: Date.now().toString(),
    name: 'New Budget Plan',
    totalBudget: 10000,
    items: [],
  });
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Furniture');
  const [newItemCost, setNewItemCost] = useState('');
  
  useEffect(() => {
    // Load saved budget plans from localStorage
    const savedPlans = localStorage.getItem('budgetPlans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        setBudgetPlans(parsedPlans);
        
        if (parsedPlans.length > 0) {
          setCurrentPlan(parsedPlans[0]);
        }
      } catch (error) {
        console.error('Error parsing budget plans:', error);
      }
    }
  }, []);
  
  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }
    
    if (!newItemCategory) {
      toast.error('Please select a category');
      return;
    }
    
    const cost = parseFloat(newItemCost);
    if (isNaN(cost) || cost <= 0) {
      toast.error('Please enter a valid cost');
      return;
    }
    
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: newItemCategory,
      estimatedCost: cost,
    };
    
    const updatedPlan = {
      ...currentPlan,
      items: [...currentPlan.items, newItem],
    };
    
    setCurrentPlan(updatedPlan);
    setNewItemName('');
    setNewItemCost('');
    toast.success('Item added to budget');
  };
  
  const handleRemoveItem = (id: string) => {
    const updatedItems = currentPlan.items.filter(item => item.id !== id);
    setCurrentPlan({
      ...currentPlan,
      items: updatedItems,
    });
    toast.success('Item removed from budget');
  };
  
  const handleSavePlan = () => {
    // Check if the plan already exists
    const existingPlanIndex = budgetPlans.findIndex(plan => plan.id === currentPlan.id);
    
    let updatedPlans: BudgetPlan[];
    
    if (existingPlanIndex >= 0) {
      // Update existing plan
      updatedPlans = [...budgetPlans];
      updatedPlans[existingPlanIndex] = currentPlan;
    } else {
      // Add new plan
      updatedPlans = [...budgetPlans, currentPlan];
    }
    
    setBudgetPlans(updatedPlans);
    localStorage.setItem('budgetPlans', JSON.stringify(updatedPlans));
    toast.success('Budget plan saved successfully');
  };
  
  const handleCreateNewPlan = () => {
    const newPlan: BudgetPlan = {
      id: Date.now().toString(),
      name: 'New Budget Plan',
      totalBudget: 10000,
      items: [],
    };
    
    setCurrentPlan(newPlan);
  };
  
  const handleDeletePlan = () => {
    if (budgetPlans.length <= 1) {
      toast.error('Cannot delete the only budget plan');
      return;
    }
    
    const updatedPlans = budgetPlans.filter(plan => plan.id !== currentPlan.id);
    setBudgetPlans(updatedPlans);
    localStorage.setItem('budgetPlans', JSON.stringify(updatedPlans));
    setCurrentPlan(updatedPlans[0]);
    toast.success('Budget plan deleted');
  };
  
  const handleLoadPlan = (planId: string) => {
    const plan = budgetPlans.find(p => p.id === planId);
    if (plan) {
      setCurrentPlan(plan);
    }
  };
  
  const handleExportCSV = () => {
    const headers = ['Name', 'Category', 'Estimated Cost', 'Actual Cost'];
    const itemsData = currentPlan.items.map(item => 
      `"${item.name}","${item.category}","${item.estimatedCost}","${item.actualCost || ''}"`
    );
    
    const csvContent = [
      headers.join(','),
      ...itemsData
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentPlan.name.replace(/\s+/g, '_')}_budget.csv`;
    link.click();
  };
  
  // Calculate budget statistics
  const totalEstimated = currentPlan.items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = currentPlan.items.reduce((sum, item) => sum + (item.actualCost || 0), 0);
  const remainingBudget = currentPlan.totalBudget - totalEstimated;
  const budgetPercentUsed = (totalEstimated / currentPlan.totalBudget) * 100;
  
  // Prepare data for charts
  const categoryData = defaultCategories.map(category => {
    const totalForCategory = currentPlan.items
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.estimatedCost, 0);
    
    return {
      name: category,
      value: totalForCategory
    };
  }).filter(item => item.value > 0);
  
  const barData = [
    { name: 'Total Budget', value: currentPlan.totalBudget },
    { name: 'Estimated Cost', value: totalEstimated },
    { name: 'Remaining', value: remainingBudget > 0 ? remainingBudget : 0 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6666', '#A569BD', '#5DADE2', '#F4D03F'];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="budget" className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif font-bold">Budget Planner</h2>
          <TabsList>
            <TabsTrigger value="budget" className="flex items-center gap-1">
              <Calculator className="h-4 w-4" /> Budget
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Saved Plans
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="budget">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Budget Details</CardTitle>
                  <CardDescription>Configure your interior design budget</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      value={currentPlan.name}
                      onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="totalBudget">Total Budget</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="totalBudget"
                        type="number"
                        className="pl-8"
                        value={currentPlan.totalBudget}
                        onChange={(e) => setCurrentPlan({ ...currentPlan, totalBudget: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-base font-medium mb-2">Add New Item</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="itemName">Item Name</Label>
                        <Input
                          id="itemName"
                          placeholder="e.g., Sofa, Dining Table"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="itemCategory">Category</Label>
                        <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {defaultCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="itemCost">Estimated Cost</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="itemCost"
                            type="number"
                            className="pl-8"
                            placeholder="0.00"
                            value={newItemCost}
                            onChange={(e) => setNewItemCost(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={handleAddItem}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleSavePlan}
                    >
                      <Save className="mr-2 h-4 w-4" /> Save Plan
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleExportCSV}
                    >
                      <Download className="mr-2 h-4 w-4" /> Export as CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Budget Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Budget:</span>
                        <span className="font-medium">${currentPlan.totalBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Total:</span>
                        <span className="font-medium">${totalEstimated.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining:</span>
                        <span className={`font-medium ${remainingBudget < 0 ? 'text-destructive' : ''}`}>
                          ${remainingBudget.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="pt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>0%</span>
                          <span>{Math.min(100, Math.round(budgetPercentUsed))}% Used</span>
                          <span>100%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${budgetPercentUsed > 100 ? 'bg-destructive' : 'bg-accent'}`}
                            style={{ width: `${Math.min(100, budgetPercentUsed)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Budget Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Add budget items to see breakdown
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Budget Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPlan.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No items in your budget yet. Add items using the form.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2 font-medium">Item</th>
                            <th className="text-left py-2 px-2 font-medium">Category</th>
                            <th className="text-right py-2 px-2 font-medium">Cost</th>
                            <th className="text-right py-2 px-2 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPlan.items.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="py-2 px-2">{item.name}</td>
                              <td className="py-2 px-2">{item.category}</td>
                              <td className="py-2 px-2 text-right">${item.estimatedCost.toLocaleString()}</td>
                              <td className="py-2 px-2 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="plans">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Saved Budget Plans</h3>
                <Button onClick={handleCreateNewPlan}>
                  <Plus className="mr-2 h-4 w-4" /> New Plan
                </Button>
              </div>
              
              {budgetPlans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No saved budget plans yet. Create and save a plan to see it here.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {budgetPlans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className={`cursor-pointer transition-all ${
                        plan.id === currentPlan.id ? 'ring-2 ring-accent' : ''
                      }`}
                      onClick={() => handleLoadPlan(plan.id)}
                    >
                      <CardContent className="p-6">
                        <h4 className="font-medium text-lg mb-2">{plan.name}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Budget:</span>
                            <span>${plan.totalBudget.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Items:</span>
                            <span>{plan.items.length}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (plan.id === currentPlan.id) {
                                handleDeletePlan();
                              } else {
                                // Create a new array without this plan
                                const updatedPlans = budgetPlans.filter(p => p.id !== plan.id);
                                setBudgetPlans(updatedPlans);
                                localStorage.setItem('budgetPlans', JSON.stringify(updatedPlans));
                                toast.success('Budget plan deleted');
                              }
                            }}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                          
                          <Button 
                            size="sm"
                            variant="outline"
                          >
                            Load Plan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetPlanner;
