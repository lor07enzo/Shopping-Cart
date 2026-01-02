import { Button } from "../components/ui/button"
import { ChevronLeft, Loader2, Minus, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useCart } from "@/components/context/cartContext"
import { Link, useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"


const ExpensesCart = () => {
    const { cartItems, incrementQuantity, decrementQuantity, handleRemoveFromCart, isLoading, handleLoading } = useCart();
    const navigate = useNavigate();

    return (
        <TooltipProvider>
            <div className="ml-6 md:ml-12 lg:ml-24  p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Homepage</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="min-h-screen flex items-start justify-center p-6">
                <div className="w-full max-w-3xl">
                    <Link to="/" className=" flex underline items-center mb-3 text-sm  hover:opacity-70">
                        <ChevronLeft /> Back to Homepage
                    </Link>
                    <Card className=" text-center mb-10 ">
                        
                        <CardHeader>
                            <CardTitle className="text-xl">Shipping Cart</CardTitle>
                            <CardDescription>
                                You have {cartItems.length} {cartItems.length === 1 ? 'article' : 'articles'} in your cart.
                            </CardDescription>
                        </CardHeader>
    
                        <CardContent>
                            {/* Logica di popolamento del carrello con operatore ternario */}
                            <div className="p-2 space-y-2 ">
                                {cartItems.length === 0 ? (
                                    <p className="text-center text-muted-foreground">The Cart is Empty</p>
                                ) : (
                                    cartItems.map(item => (
                                        <div key={item.id} className="grid grid-cols-1 space-y-4 md:space-y-0 md:grid-cols-3 items-center p-2 border rounded">
                                            <div className="flex flex-col justify-start overflow-hidden">
                                                <p className="font-medium truncate">{item.description}</p>
                                                <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                                            </div>
                                            <div className="flex items-center gap-2 justify-self-center">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            disabled={item.quantity <= 1}
                                                            onClick={() => decrementQuantity(item.id)}
                                                        >
                                                            <Minus />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{item.quantity > 1 ? "Remove 1" : ""}</p>
                                                    </TooltipContent>
                                                </Tooltip>
    
                                                <span className="w-8 h-8 flex justify-center items-center text-center font-medium">
                                                    {item.quantity}
                                                </span>
    
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => incrementQuantity(item.id)}
                                                        >
                                                            <Plus />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Add 1</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-end">
                                                <span className="font-semibold">{item.amount.toFixed(2)}€</span>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleRemoveFromCart(item.id)}
                                                            className="hover:opacity-70 "
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Remove to cart
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
    
                        <CardFooter className="flex flex-col gap-2">
                            {cartItems.length > 0 && (
                                <div className="text-lg font-bold text-center mb-2">
                                    Total: {cartItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0).toFixed(2)}€
                                </div>
                            )}
                            <Button
                                className="w-full"
                                disabled={(cartItems.length === 0) || isLoading}
                                onClick={async () => { 
                                    if (cartItems.length > 0) {
                                        handleLoading(true);
                                        await new Promise(r => setTimeout(r, 600));
                                        navigate('checkout');
                                        handleLoading(false);
                                    } 
                                }}
                            >
                                {isLoading ? "Loading" : "Proceed to Checkout"}
                                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            </Button>
    
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </TooltipProvider>
    )
}
export default ExpensesCart