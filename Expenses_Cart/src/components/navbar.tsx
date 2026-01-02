
import { ShoppingCart } from "lucide-react"
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { useCart } from "./context/cartContext"


const Navbar = () => {
    const { cartItems } = useCart()

    return (
        <>
            <div className="p-4 space-y-4 border-b-2 border-border bg-base-100 rounded-b-xl">
                <div className="flex justify-between items-center mx-6 md:mx-12 lg:mx-24">
                    <Link to="/" className="hover:opacity-70 hover:underline">
                        <h1 className="text-lg font-semibold md:font-bold md:text-xl">EXPENSES LOGO</h1>
                    </Link>
                    <div className="flex space-x-5">
                        <Button 
                          className="relative rounded-full hover:shadow-xl "
                          variant="outline">
                            <Link to="/cart" className="flex gap-2 items-center">
                                <ShoppingCart/>
                            </Link>
                            {cartItems.length > 0 &&(
                                <div 
                                  className="absolute bg-muted w-6 h-6 flex justify-center items-center rounded-full border bottom-5 right-8 z-5 animate-in zoom-in duration-300 ease-out">
                                    {cartItems.length}
                                </div>
                            )} 
                        </Button>
                        <AnimatedThemeToggler className="hover:opacity-60"/>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Navbar