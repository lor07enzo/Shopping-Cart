import type { Category, Expense } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const categories: Category[] = ['Food', 'Transport', 'Entertainment', 'Home', 'Other']
const API_URL = import.meta.env.VITE_API_URL;

// Schema ZOD
const expenseFormSchema = z.object({
    description: z.string().nonempty("The description is required"),
    amount: z.number().min(10, "The minimum amount is 10").max(100, "The maximum amount is 100"),
    category: z.enum(categories, { message: "Select the category" })
})

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

const ExpensesForm = (
    {expense, onFormSubmit}:
    {expense?: Expense, onFormSubmit: (data: Expense) => void}
) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ExpenseFormValues>(
        {
            resolver: zodResolver(expenseFormSchema),
            defaultValues: {
                description: expense?.description || "",
                amount: expense?.amount || 0,
                category: expense?.category
            }
        }
    );

    const onSubmit = handleSubmit(async (formData) => {
        const data: Omit<Expense, "id"> = {
            ...formData,
            amount: +formData.amount,
            createdAt: expense?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        try {
            const res = await fetch(`${API_URL}/jsonExpenses${expense ? '/' + expense.id : ''}`, {
                method: expense ? "PUT" : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const responseData: Expense = await res.json();

            onFormSubmit(responseData);

        } catch (error) {
            console.log(error)
        }

    })

    return (
        <form id="new-expense-form" className="space-y-4" onSubmit={onSubmit}>
            {/* Description */}
            <div className="space-y-3">
                <Label htmlFor="description">Description</Label>
                <div className="space-y-1">
                    <Input 
                        {...register("description")} 
                        aria-invalid={!!errors.description} 
                        type="text" 
                        id="description" 
                        placeholder="Description" 
                    />
                    {errors.description && errors.description.message && 
                    <p className="text-destructive text-xs">{errors.description.message as string}</p>}
                </div>
            </div>

            {/* Amount */}
            <div className="space-y-3">
                <Label htmlFor="amount">Amount</Label>
                <div className="space-y-1">
                    <div className="relative">
                        <Input
                            {...register("amount", {
                                valueAsNumber: true
                            })}
                            id="amount"
                            className="peer ps-6 pe-12"
                            placeholder="0"
                            type="number"
                            aria-invalid={!!errors.amount}
                        />
                        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                            €
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                            EUR
                        </span>
                    </div>
                    {errors.amount && errors.amount.message && 
                    <p className="text-destructive text-xs">{errors.amount.message as string}</p>}

                </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
                <Label>Category</Label>
                <div className="space-y-1">
                    <Select value={expense?.category} onValueChange={(value: Category) => setValue("category", value)}>
                        <SelectTrigger className={`w-full capitalize ${errors.category ? 'border-destructive' : ''}`} aria-invalid={!!errors.category}>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => <SelectItem key={category} aria-invalid={!!errors.category} className="capitalize" value={category}>{category}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors.category && errors.category.message && 
                    <p className="text-destructive text-xs">{errors.category.message as string}</p>}
                </div>
            </div>
        </form>
    )
}
export default ExpensesForm


