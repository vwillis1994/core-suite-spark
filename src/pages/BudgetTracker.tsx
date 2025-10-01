import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface Category {
  name: string;
  budget: number;
}

interface Transaction {
  id: string;
  date: string;
  payee: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  notes: string;
}

export default function BudgetTracker() {
  const [categories, setCategories] = useState<Category[]>([
    { name: "Groceries", budget: 500 },
    { name: "Transport", budget: 200 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", budget: "" });
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    payee: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    notes: ""
  });

  useEffect(() => {
    const savedCat = localStorage.getItem("budget_categories");
    const savedTx = localStorage.getItem("budget_transactions");
    if (savedCat) setCategories(JSON.parse(savedCat));
    if (savedTx) setTransactions(JSON.parse(savedTx));
  }, []);

  useEffect(() => {
    localStorage.setItem("budget_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("budget_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addCategory = () => {
    if (!newCategory.name) return;
    setCategories([...categories, { name: newCategory.name, budget: parseFloat(newCategory.budget) || 0 }]);
    setNewCategory({ name: "", budget: "" });
  };

  const addTransaction = () => {
    if (!newTransaction.payee || !newTransaction.amount) return;
    
    setTransactions([
      ...transactions,
      {
        id: Date.now().toString(),
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      }
    ]);
    
    setNewTransaction({
      date: new Date().toISOString().split("T")[0],
      payee: "",
      amount: "",
      category: "",
      type: "expense",
      notes: ""
    });
    toast.success("Transaction added");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Transaction deleted");
  };

  const getSpentByCategory = (categoryName: string) => {
    return transactions
      .filter(t => t.category === categoryName && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const cashFlow = totalIncome - totalExpense;

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${cashFlow >= 0 ? "text-secondary" : "text-destructive"}`}>
              ${cashFlow.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpense.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalIncome > 0 ? ((cashFlow / totalIncome) * 100).toFixed(0) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Budget"
              value={newCategory.budget}
              onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
            />
            <Button onClick={addCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const spent = getSpentByCategory(cat.name);
              const remaining = cat.budget - spent;
              const percentage = cat.budget > 0 ? (spent / cat.budget) * 100 : 0;

              return (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${spent.toFixed(2)} / ${cat.budget.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${percentage > 100 ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-sm mt-1 text-muted-foreground">
                    Remaining: ${remaining.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            <Input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            />
            <Input
              placeholder="Payee"
              value={newTransaction.payee}
              onChange={(e) => setNewTransaction({ ...newTransaction, payee: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            />
            <select
              className="px-3 py-2 rounded-md border border-input bg-background"
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as any })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select
              className="px-3 py-2 rounded-md border border-input bg-background"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <Button onClick={addTransaction}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1 max-h-96 overflow-auto">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50">
                <div className="flex gap-4 flex-1">
                  <span className="text-sm text-muted-foreground">{tx.date}</span>
                  <span className="font-medium">{tx.payee}</span>
                  <span className="text-sm text-muted-foreground">{tx.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${tx.type === "income" ? "text-secondary" : ""}`}>
                    {tx.type === "income" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => deleteTransaction(tx.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
