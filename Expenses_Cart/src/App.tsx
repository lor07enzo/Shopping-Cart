import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import Homepage from "./pages/homepage";
import ExpensesCart from "./pages/expenses_cart";
import { CartProvider } from "./components/context/cartContext";
import { Checkout } from "./pages/checkout";
import OrderConfirmation from "./pages/order_confirmation";


function App() {



  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="cart">
            <Route index element={<ExpensesCart />} />
            <Route path="checkout" >
              <Route index element={<Checkout />} />
              <Route path="order-confirmation">
                <Route index element={<OrderConfirmation />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App
