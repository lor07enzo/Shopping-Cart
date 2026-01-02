export type Category = 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Home' | 'Other';
export type Country = 'Italy' | 'United States' | 'Canada' | 'United Kingdom' | 'Australia' | 'Other';

export interface Expense {
    id: string;
    description: string;
    category: Category;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICartItems extends Expense {
    quantity: number;
}

export interface CartContextType {
    cartItems: ICartItems[];
    setCartItems: (items: ICartItems[] | ((prev: ICartItems[]) => ICartItems[])) => void;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleAddToCart: (expense: Expense) => void;
    incrementQuantity: (expenseId: string) => void;
    decrementQuantity: (expenseId: string) => void;
    handleRemoveFromCart: (expenseId: string) => void;
    clearCart: () => void;
    isLoading: boolean;
    handleLoading: (value: boolean) => void;
}

export interface ICheckoutForm{
    fullName: string;
    email: string;
    address: string;
    city: string;
    country: Country;
}

