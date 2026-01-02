import { CheckoutForm } from "@/components/checkout_form";
import { useCart } from "@/components/context/cartContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronLeft, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ICheckoutForm } from '@/types';
import { toast } from "sonner";


export function Checkout() {

    const { cartItems, handleLoading, isLoading } = useCart();
    const [openForm, setOpenForm] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
    const [cardNumber, setCardNumber] = useState("")
    const [cardExpiry, setCardExpiry] = useState("")
    const [cardCvv, setCardCvv] = useState("")
    const [paypalEmail, setPaypalEmail] = useState("")
    const [checkoutData, setCheckoutData] = useState<ICheckoutForm | null>(null);
    const navigate = useNavigate();

    const SHIPPING_COST = 5.00;
    const subtotal = cartItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = subtotal > 40 ? subtotal : subtotal + SHIPPING_COST;

    const openPayment = Boolean(checkoutData);

    const handleConfirm = async() => {

        if (!selectedMethod || !checkoutData) return;

        try {
            handleLoading(true);

            // Simulazione del processo di pagamento
            await new Promise((resolve) => setTimeout(resolve, 800));

            navigate('/cart/checkout/order-confirmation', {
                state: {
                    selectedMethod,
                    total,
                    cardNumber,
                    payPalEmail: paypalEmail,
                    ...(checkoutData ?? {})
                }
            });
            console.log(checkoutData, "Method of payment: " + selectedMethod);
            toast.success("Order placed successfully!");
        } catch(error) {
            console.log(error);
            toast.error("Payment failed. Please try again.");
        } finally {
            handleLoading(false);

            // Reset dello stato del checkout
            setSelectedMethod(null)
            setCheckoutData(null)
            setCardNumber("")
            setCardExpiry("")
            setCardCvv("")
            setPaypalEmail("")
        }

    }

    // Definizione dei 3 metodi di pagamento
    const paymentMethods = [
        {
            id: "card",
            label: "Credit/Debit Card",
            image: (
                <svg viewBox="0 0 80 56" className="w-full h-full">
                    <rect width="80" height="56" rx="4" fill="#1e293b" />
                    <rect x="8" y="16" width="24" height="16" rx="2" fill="#fbbf24" />
                    <rect x="8" y="36" width="40" height="4" rx="1" fill="#94a3b8" />
                    <rect x="8" y="42" width="28" height="4" rx="1" fill="#94a3b8" />
                    <circle cx="64" cy="28" r="8" fill="#ef4444" opacity="0.8" />
                    <circle cx="72" cy="28" r="8" fill="#f97316" opacity="0.8" />
                </svg>
            ),
        },
        {
            id: "paypal",
            label: "PayPal",
            image: (
                <svg viewBox="0 0 80 56" className="w-full h-full">
                    <rect width="80" height="56" rx="4" fill="#0070ba" />
                    <path d="M25 16c6 0 11 2 11 8 0 6-5 12-11 12h-5l-2 8h-6l5-28h8z" fill="#fff" />
                    <path d="M31 16c6 0 11 2 11 8 0 6-5 12-11 12h-5l-2 8h-6l5-28h8z" fill="#fff" opacity="0.7" />
                    <text x="50" y="38" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="Arial">
                        PayPal
                    </text>
                </svg>
            ),
        },
        {
            id: "cod",
            label: "Cash on Delivery",
            image: (
                <svg viewBox="0 0 80 56" className="w-full h-full">
                    <rect width="80" height="56" rx="4" fill="#16a34a" />
                    <rect x="20" y="14" width="40" height="28" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                    <circle cx="40" cy="28" r="8" fill="#22c55e" />
                    <text x="40" y="32" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="Arial" textAnchor="middle">
                        €
                    </text>
                    <rect x="26" y="36" width="28" height="2" rx="1" fill="#22c55e" />
                </svg>
            ),
        },
    ]

    return (
        <div className="flex flex-col p-4">
            <Breadcrumb className="ml-6 md:ml-12 lg:ml-24 ">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Homepage</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="checkout">Checkout</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-5 flex flex-col justify-start items-center p-6">
                <div className="w-full max-w-3xl">
                    <Link to="/cart" className="flex items-center mb-3 text-sm underline hover:opacity-70"><ChevronLeft />Go to Cart</Link>
                    {/* Verifico se il Carrello è vuoto */}
                    {cartItems.length === 0 ? (
                        <Empty className="border border-dashed">
                            <EmptyHeader>
                                <EmptyTitle>The Cart is Empty</EmptyTitle>
                                <EmptyDescription>
                                    Add some expenses to your cart to proceed with the checkout.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button>
                                    <Link to="/">Back to Homepage</Link>
                                </Button>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        // Logica se il carrello ha degli articoli
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl text-center uppercase">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-center font-semibold text-lg pb-4">Your Articles</h2>
                                    <Separator className="border" />
                                    <div className="space-y-2">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 md:items-center ">
                                                <p className="breack-words">{item.description}</p>
                                                <p className="text-sm text-gray-600 md:text-center">Quantity: {item.quantity}</p>
                                                <p className="md:text-end font-semibold">€ {item.amount * item.quantity}</p>
                                            </div>
                                        ))}
                                        <Separator className="border" />
                                        <div className="grid grid-cols-2">
                                            <span className="text-muted-foreground">{totalQuantity} {totalQuantity === 1 ? "Article" : "Articles"}</span>
                                            <span className="text-lg text-end font-semibold">€ {subtotal}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-muted-foreground">Shipping</span>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <button className="inline-flex">
                                                            <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80" align="start">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium text-sm">Shipping Information</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Standard shipping: delivery in 3-5 working days.
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Free shipping on orders over €40.
                                                            </p>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <span className="text-end">{subtotal > 40 ? "Free" : "€ 5.00"}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <span className="uppercase text-lg text-muted-foreground">total</span>
                                            <span className="text-end text-lg font-bold">€ {total}</span>
                                        </div>
                                    </div>
                                    {!openForm && (
                                        <Button className="w-full" onClick={() => setOpenForm(true)}>Confirm and Proceed</Button>
                                    )}
                                </div>
                                {/* Logica del CheckoutForm */}
                                {openForm && (
                                    <>
                                        <Separator className="border my-4" />
                                        <h2 className="text-center font-semibold text-lg pb-4">User Information</h2>

                                        <CheckoutForm
                                            onSubmit={async(data) => {
                                                handleLoading(true);
                                                await new Promise(r => setTimeout(r, 600));
                                                setCheckoutData(data);
                                                handleLoading(false);
                                            }}
                                        />
                                    </>
                                )}
                                {/* Dialog per la selezione del metodo di pagamento */}
                                <Dialog 
                                    open={openPayment} 
                                    onOpenChange={(open) => { 
                                        if (!open) setCheckoutData(null);
                                    }}
                                >
                                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Select the Payment Method</DialogTitle>
                                            <DialogDescription className="text-muted-foreground">Select how you want to pay for your order of €{total}</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                                            {paymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => setSelectedMethod(method.id)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-4 p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-105",
                                                        selectedMethod === method.id
                                                            ? "border-primary bg-primary/5 shadow-md"
                                                            : "border-border hover:border-primary/50",
                                                    )}
                                                >
                                                    <div className="w-20 h-14">{method.image}</div>
                                                    <div className="font-medium text-center text-sm">{method.label}</div>
                                                </button>
                                            ))}
                                        </div>

                                        {selectedMethod === "card" && (
                                            <div className="space-y-4 py-4 border-t">
                                                <h3 className="font-semibold text-sm">Enter your card details</h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <Label htmlFor="cardNumber">Card number</Label>
                                                        <Input
                                                            id="cardNumber"
                                                            placeholder="1234 5678 9012 3456"
                                                            value={cardNumber}
                                                            onChange={(e) => setCardNumber(e.target.value)}
                                                            maxLength={19}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <Label htmlFor="cardExpiry">Expiration</Label>
                                                            <Input
                                                                id="cardExpiry"
                                                                placeholder="MM/AA"
                                                                value={cardExpiry}
                                                                onChange={(e) => {
                                                                    let value = e.target.value.replace(/\D/g, "")

                                                                    if (value.length >= 3) {
                                                                        value = value.slice(0, 2) + "/" + value.slice(2, 4)
                                                                    }

                                                                    setCardExpiry(value)
                                                                }}
                                                                maxLength={5}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="cardCvv">CVV</Label>
                                                            <Input
                                                                id="cardCvv"
                                                                placeholder="123"
                                                                value={cardCvv}
                                                                onChange={(e) => setCardCvv(e.target.value)}
                                                                maxLength={3}
                                                                type="password"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedMethod === "paypal" && (
                                            <div className="space-y-4 py-4 border-t">
                                                <h3 className="font-semibold text-sm">Enter your Paypal account</h3>
                                                <div>
                                                    <Label htmlFor="paypalEmail">Email PayPal</Label>
                                                    <Input
                                                        id="paypalEmail"
                                                        type="email"
                                                        placeholder="youremail@example.com"
                                                        value={paypalEmail}
                                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {selectedMethod === "cod" && (
                                            <div className="py-4 border-t">
                                                <Alert>
                                                    <AlertDescription>
                                                        <strong>Cash on Delivery:</strong> You will pay the amount of €{total.toFixed(2)} directly
                                                        to the courier upon delivery. An additional fee of €2-5.
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        )}

                                        <DialogFooter>
                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="flex-1 bg-transparent"
                                                    onClick={() => {
                                                        setCheckoutData(null);
                                                        setSelectedMethod(null);
                                                        setCardNumber("");
                                                        setCardExpiry("");
                                                        setCardCvv("");
                                                        setPaypalEmail("");
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                
                                                <Button
                                                    type="button"
                                                    className="flex-1"
                                                    onClick={handleConfirm}
                                                    disabled={(!selectedMethod) || (selectedMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv)) || (selectedMethod === "paypal" && !paypalEmail) || isLoading}>
                                                        {isLoading ? "Processing" : "Confirm Payment"}
                                                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                                </Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>


    )
}


