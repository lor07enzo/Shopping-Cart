import type { CartContextType, Expense, ICartItems } from "@/types";
import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";


export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider ({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<ICartItems[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Funzione per aggiungere al carrello
    const handleAddToCart = (expense: Expense) => {
        const exists = cartItems.find(item => item.id === expense.id);

        if (exists) {
            // se esiste incremento la quantità
            setCartItems(prev => 
                prev.map(item => 
                    item.id === expense.id ? {...item, quantity: item.quantity + 1} : item
                )
            );
        } else {
            // se non esiste lo aggiungo al carrello
            setCartItems(prev => [...prev, {...expense, quantity: 1}]);
        }
        toast.success(`"${expense.description}" added to cart`);
    };

    // Funzione per incrementare
    const incrementQuantity = (expenseId: string) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === expenseId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Funzione per decrementare
    const decrementQuantity = (expenseId: string) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === expenseId) {
                    const newQuantity = Math.max(1, item.quantity - 1);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    // Funzione per rimuovere un elemento dal carrello
    const handleRemoveFromCart = (expenseId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== expenseId));
        toast.success(" Item removed from cart");
    };

    // Funzione per svuotare il carrello
    const clearCart = () => {
        setCartItems([]);
    }

    // Funzione base per il caricamento
    const handleLoading = (value: boolean) => {
        setIsLoading(value);
    }

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            setCartItems, 
            dialogOpen, 
            setDialogOpen,
            handleAddToCart,
            incrementQuantity,
            decrementQuantity,
            handleRemoveFromCart,
            clearCart,
            isLoading,
            handleLoading
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};


