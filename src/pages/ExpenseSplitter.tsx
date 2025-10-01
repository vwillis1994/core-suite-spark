import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

interface Person {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
}

export default function ExpenseSplitter() {
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newPerson, setNewPerson] = useState("");
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", paidBy: "" });

  const addPerson = () => {
    if (!newPerson.trim()) return;
    setPeople([...people, { id: Date.now().toString(), name: newPerson.trim() }]);
    setNewPerson("");
    toast.success("Person added");
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
    toast.success("Person removed");
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) {
      toast.error("Please fill all fields");
      return;
    }
    setExpenses([...expenses, {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      splitBetween: people.map(p => p.id)
    }]);
    setNewExpense({ description: "", amount: "", paidBy: "" });
    toast.success("Expense added");
  };

  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    people.forEach(p => balances[p.id] = 0);

    expenses.forEach(exp => {
      const share = exp.amount / exp.splitBetween.length;
      balances[exp.paidBy] += exp.amount;
      exp.splitBetween.forEach(id => {
        balances[id] -= share;
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Expense Splitter</h1>
        <p className="text-muted-foreground">Split bills fairly among group members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                People
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter name"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                />
                <Button onClick={addPerson}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {people.map(person => (
                  <div key={person.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="font-medium">{person.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removePerson(person.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {people.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No people added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
              <select
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                value={newExpense.paidBy}
                onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
              >
                <option value="">Who paid?</option>
                {people.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <Button onClick={addExpense} className="w-full">Add Expense</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expenses.map(exp => (
                  <div key={exp.id} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{exp.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Paid by {people.find(p => p.id === exp.paidBy)?.name}
                        </p>
                      </div>
                      <span className="font-bold">${exp.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No expenses added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settlement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {people.map(person => {
                  const balance = balances[person.id];
                  return (
                    <div key={person.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="font-medium">{person.name}</span>
                      <span className={`font-bold ${balance > 0 ? 'text-secondary' : balance < 0 ? 'text-destructive' : ''}`}>
                        {balance > 0 ? '+' : ''}{balance.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
