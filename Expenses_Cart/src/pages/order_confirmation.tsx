import { useCart } from "@/components/context/cartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle2, CreditCard, DollarSign, Mail, MapPin, Truck } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

type OrderConfirmationProps = {
    setSelectedMethod?: (method: string) => void;
    selectedMethod?: string | null;
    total?: number;
    cardNumber?: string;
    payPalEmail?: string;
    fullName?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
};

const OrderConfirmation = (props: OrderConfirmationProps) => {
    const location = useLocation();
    const state = (location.state || {}) as Partial<OrderConfirmationProps>;
    const { cartItems, clearCart } = useCart();

    const setSelectedMethod = props.setSelectedMethod ?? state.setSelectedMethod ?? (() => { });
    const selectedMethod = props.selectedMethod ?? state.selectedMethod ?? null;
    const total = props.total ?? state.total ?? 0;
    const cardNumber = props.cardNumber ?? state.cardNumber ?? "";
    const payPalEmail = props.payPalEmail ?? state.payPalEmail ?? "";
    const fullName = props.fullName ?? state.fullName ?? "";
    const email = props.email ?? state.email ?? "";
    const address = props.address ?? state.address ?? "";
    const city = props.city ?? state.city ?? "";
    const country = props.country ?? state.country ?? "";

    const maskedCard = cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : null;

    const handleClear = () => {
        clearCart();
        setSelectedMethod("");

    }

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-emerald-600 py-20 px-6 sm:px-12 lg:px-24">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-white" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">Order Confirmed!</h1>
                    <div className="text-lg text-emerald-50 space-y-2">
                        <p>Thank you for your purchase. We will shortly send a confirmation email to: </p>
                        <strong>{email}</strong>
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 w-full px-6 sm:px-12 lg:px-32 py-12">
                <div className="flex flex-col mt-6 gap-6 lg:col-span-2 ">
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-lg">Product Ordered</CardTitle>
                            <CardDescription>{cartItems.length} {cartItems.length === 1 ? 'Article' : 'Articles'}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 ">
                                    <div className="size-16 bg-muted-foreground rounded flex justify-center items-center"><DollarSign /></div>
                                    <div className="flex flex-1 justify-between">
                                        <div>
                                            <h3 className="font-semibold">{item.description}</h3>
                                            <p className="text-muted-foreground text-sm text-semibold">{item.category}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">€{(item.amount * item.quantity).toFixed(2)}</p>
                                            <p className="text-sm text-muted-foreground">€{item.amount.toFixed(2)} cad.</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex gap-2"><MapPin />Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold">{fullName}</p>
                                <p className="text-muted-foreground">{address}</p>
                                <p className="text-muted-foreground">{city}</p>
                                <p className="text-muted-foreground">{country}</p>
                            </div>
                            <Separator className="my-4" />
                            <p className="text-sm text-muted-foreground flex gap-2"><Mail /> {email}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col m-6 gap-6 ">
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-lg">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between">
                                <div className="flex flex-col text-muted-foreground text-sm gap-6">
                                    <span>Subtotal</span>
                                    <span>Shipping</span>
                                    <span>VAT (20%)</span>
                                </div>
                                <div className="flex flex-col text-sm gap-6 text-right font-semibold">
                                    <span>€{total > 40 ? total : (total - 5)}</span>
                                    <span>{total > 40 ? 'Free' : '€ 5.00'}</span>
                                    <span>€{(total * 0.2).toFixed(2)}</span>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
                                <Button className="flex gap-2 w-full bg-emerald-600 hover:bg-emerald-700">
                                    <Truck />Track Order
                                </Button>
                                <Button
                                    variant="outline"
                                    className=" w-full hover:bg-emerald-700 hover:text-muted dark:hover:bg-emerald-700"
                                    onClick={handleClear}>
                                    <Link to="/" className="flex gap-2 items-center justify-center">Back to Homepage <ArrowRight className="mt-1"/></Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex gap-2 items-center"><CreditCard /> Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted flex rounded-lg gap-3 items-center p-4">
                                {selectedMethod === "card" && (
                                    <div className="flex items-center gap-3">
                                        <svg viewBox="0 0 80 56" className="w-1/5 h-1/5">
                                            <rect width="80" height="56" rx="4" fill="#1e293b" />
                                            <rect x="8" y="16" width="24" height="16" rx="2" fill="#fbbf24" />
                                            <rect x="8" y="36" width="40" height="4" rx="1" fill="#94a3b8" />
                                            <rect x="8" y="42" width="28" height="4" rx="1" fill="#94a3b8" />
                                            <circle cx="64" cy="28" r="8" fill="#ef4444" opacity="0.8" />
                                            <circle cx="72" cy="28" r="8" fill="#f97316" opacity="0.8" />
                                        </svg>
                                        <div className="flex flex-col">
                                            <h4 className="text-lg font-semibold">Credit Card</h4>
                                            <p className="text-sm text-muted-foreground">{maskedCard}</p>
                                        </div>
                                    </div>
                                )}
                                {(selectedMethod === "paypal" || payPalEmail) && (
                                    <div className="flex items-center gap-3">
                                        <svg viewBox="0 0 80 56" className="w-1/5 h-1/5">
                                            <rect width="80" height="56" rx="4" fill="#0070ba" />
                                            <path d="M25 16c6 0 11 2 11 8 0 6-5 12-11 12h-5l-2 8h-6l5-28h8z" fill="#fff" />
                                            <path d="M31 16c6 0 11 2 11 8 0 6-5 12-11 12h-5l-2 8h-6l5-28h8z" fill="#fff" opacity="0.7" />
                                            <text x="50" y="38" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="Arial">
                                                PayPal
                                            </text>
                                        </svg>
                                        <div className="flex flex-col">
                                            <h4 className="text-lg font-semibold">PayPal</h4>
                                            <p className="text-sm text-muted-foreground">{payPalEmail || '—'}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedMethod === "cod" && (
                                    <div className="flex items-center gap-3">
                                        <svg viewBox="0 0 80 56" className="w-1/5 h-1/5">
                                            <rect width="80" height="56" rx="4" fill="#16a34a" />
                                            <rect x="20" y="14" width="40" height="28" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                                            <circle cx="40" cy="28" r="8" fill="#22c55e" />
                                            <text x="40" y="32" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="Arial" textAnchor="middle">
                                                €
                                            </text>
                                            <rect x="26" y="36" width="28" height="2" rx="1" fill="#22c55e" />
                                        </svg>
                                        <div className="flex flex-col">
                                            <h4 className="text-lg font-semibold">Mark</h4>
                                            <p className="text-sm text-muted-foreground">Pay on delivery with additional tax of €2-5</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;