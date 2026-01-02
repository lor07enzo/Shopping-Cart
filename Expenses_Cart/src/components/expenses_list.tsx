import type { Expense } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "./ui/item";
import { Check, DollarSign, Plus } from "lucide-react";
import { Button } from "./ui/button";


const ExpensesList = (
    { expenses, onExpenseSelected, onAddToCart, cartItems }: 
    { expenses: Expense[], 
      onExpenseSelected: (expenseId: Expense['id']) => void, 
      onAddToCart: (expense: Expense) => void,
      cartItems: Expense[]
    }) => {
    return (
        <TooltipProvider>
            <ItemGroup className="gap-4">
                {expenses.map((expense) => {
                    const isInCart = cartItems.some(item => item.id === expense.id);
                    return (
                    <Item key={expense.id} variant="outline" asChild role="listitem" onClick={() => onExpenseSelected(expense.id)}>
                        <a href="#">
                            <ItemMedia className=" size-12" variant="icon">
                                <DollarSign />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="line-clamp-1">
                                    {expense.description}
                                </ItemTitle>
                                <ItemDescription className="capitalize ">{expense.category}</ItemDescription>
                            </ItemContent>
                            <ItemContent className="flex flex-row text-center items-center gap-6">
                                <Tooltip >
                                    <TooltipTrigger asChild>
                                        <Button 
                                          variant={isInCart ? "default" : "outline"}
                                          className={isInCart ? "bg-green-500 hover:bg-green-600" : ""}
                                          onClick={(e) => {e.preventDefault(); e.stopPropagation(); if(!isInCart){onAddToCart(expense)} }}>
                                            {/* Icona per aggiungere al carrello */}
                                            {isInCart ? <Check /> : <Plus />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isInCart ? "Already in the cart" : "Add to cart"}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <ItemDescription>{expense.amount.toFixed(2)}€</ItemDescription>
                            </ItemContent>
                        </a>
                    </Item>
                    )
                })}
            </ItemGroup>
        </TooltipProvider>
    )
}

export default ExpensesList