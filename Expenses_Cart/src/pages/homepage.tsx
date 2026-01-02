import ExpensesForm from "@/components/expenses_form";
import ExpensesList from "@/components/expenses_list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { Expense } from "@/types";
import { DollarSign, Loader2, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/context/cartContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";



const API_URL = import.meta.env.VITE_API_URL;

const Homepage = () => {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

    // importo il context
    const { dialogOpen, setDialogOpen, handleAddToCart, handleRemoveFromCart, cartItems, isLoading, handleLoading } = useCart();

    const selectedExpense = expenses.find(expense => expense.id === selectedExpenseId);

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const res = await fetch(`${API_URL}/jsonExpenses`);
                const data = await res.json();
                setExpenses(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
        loadExpenses();
    }, []);

    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_URL}/jsonExpenses/${selectedExpenseId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setExpenses(prev => prev.filter(ex => ex.id !== selectedExpenseId));

                // rimuovo la spesa anche dal carrello
                handleRemoveFromCart(selectedExpenseId!)

                setDialogOpen(false);
                toast.success("Expense deleted successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting expense");
        }
    };





    return (
        <div className="p-4 space-y-4 mb-5 mx-6 md:mx-12 lg:mx-24">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 ">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Homepage</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col items-center justify-center py-6 md:py-0 justify-self-center">
                    <h1 className="text-2xl font-semibold mb-0 text-center">Welcome to Expenses</h1>
                    <p className="text-foreground/50">List of your expenses</p>
                </div>

                {expenses.length > 0 && (
                    <div className="flex w-full max-w-full md:justify-end">
                        <Button className="w-full md:w-auto" onClick={() => setDialogOpen(true)}>
                            <Plus />New expense
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => {
                if (!open) {
                    setTimeout(() => {
                        setSelectedExpenseId(null);
                    }, 300);
                }
                setDialogOpen(open);
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className=" pt-1 breack-words">
                            {selectedExpense ? "Edit expense: " + selectedExpense.description : "New expense"}
                        </DialogTitle>
                        <DialogDescription>
                            Fill fields below to {selectedExpense ? "edit the selected" : "insert a new"} expense
                        </DialogDescription>
                    </DialogHeader>
                    <ExpensesForm
                        expense={selectedExpense}
                        onFormSubmit={async (data: Expense) => {
                            try {
                                handleLoading(true);
                                await new Promise(r => setTimeout(r, 600));
                                const expenseExists = expenses.find(i => i.id === data.id);

                                if (expenseExists) {
                                    setExpenses(prev => prev.map(ex => ex.id === data.id ? data : ex));
                                    toast.success("Expense updated successfully");
                                } else {
                                    setExpenses(prev => [...prev, data]);
                                    toast.success("Expense created successfully");
                                }
                                setDialogOpen(false);
                            } catch (error) {
                                console.log(error);
                                toast.error("Error saving expense");
                            } finally {
                                handleLoading(false);
                            }
                        }}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            form="new-expense-form"
                            disabled={isLoading}>
                            {isLoading ? "Saving" : "Save changes"}
                            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        </Button>
                    </DialogFooter>
                    {selectedExpense && (
                        <Button
                            onClick={handleDelete}
                            type="button"
                            variant="outline"
                            className="text-destructive hover:text-destructive/70"
                        >
                            <Trash />Delete expense
                        </Button>
                    )}
                </DialogContent>
            </Dialog>

            {/* Lista o Empty state */}
            {expenses.length === 0 ? (
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <DollarSign />
                        </EmptyMedia>
                        <EmptyTitle>No expenses yet</EmptyTitle>
                        <EmptyDescription>
                            Add now a new expense clicking the button below.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button size="sm" onClick={() => setDialogOpen(true)}>
                            <Plus /> New expense
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : (
                <div className=" flex flex-col md:flex-row items-center justify-center md:p-6">
                    <div className=" w-full max-w-3xl mb-10 ">
                        <ExpensesList
                            expenses={expenses}
                            onExpenseSelected={(expenseId: Expense['id']) => {
                                setSelectedExpenseId(expenseId);
                                setDialogOpen(true);
                            }}
                            onAddToCart={handleAddToCart}
                            cartItems={cartItems}
                        />
                    </div >
                </div>
            )}
        </div>
    )
}
export default Homepage