import type { Country, ICheckoutForm } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from "zod";
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useCart } from './context/cartContext';

const countries: Country[] = ['Italy', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Other']

const checkoutFormShema = z.object({
    fullName: z.string().nonempty("Full name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().nonempty("Address is required"),
    city: z.string().nonempty("City is required"),
    country: z.enum(countries, { message: "Select your country" })
})

type CheckoutFormValues = z.infer<typeof checkoutFormShema>

type CheckoutFormProps = {
  checkout?: ICheckoutForm;
  onSubmit: (data: ICheckoutForm) => void;
};


export function CheckoutForm (
    {onSubmit, checkout}: CheckoutFormProps) {
    const { register, handleSubmit, formState: { errors }, control } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormShema),
        defaultValues: {
            fullName: checkout?.fullName || "",
            email: checkout?.email || "",
            address: checkout?.address || "",
            city: checkout?.city || "",
            country: checkout?.country
        }
    })

    const { isLoading } = useCart();

    const onFormSubmit = handleSubmit(async(data) => {
        onSubmit(data);
    });

    return (
        <form id='checkout-form' onSubmit={onFormSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 py-4 md:p-4 gap-4'>
                <div>
                    <label htmlFor="fullName">fullName</label>
                    <Input 
                        {...register("fullName")} 
                        id="fullName" 
                        placeholder="Mario Rossi"
                        aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && (
                        <p className="text-destructive text-xs">{errors.fullName.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <Input
                        {...register("email")} 
                        id="email" 
                        type="email" 
                        placeholder="email@example.com"
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                        <p className="text-destructive text-xs">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <Input 
                        {...register("address")}
                        id="address" 
                        placeholder="Via Roma 1"
                        aria-invalid={!!errors.address}
                    />
                    {errors.address && (
                        <p className="text-destructive text-xs">{errors.address.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="city">City</label>
                    <Input
                        {...register("city")}
                        id="city"
                        placeholder="Rome"
                        aria-invalid={!!errors.city}
                    />
                    {errors.city && (
                        <p className="text-destructive text-xs">{errors.city.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="country">Country</label>
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="w-full" aria-invalid={!!errors.country}>
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country} value={country}>
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.country && (
                        <p className="text-destructive text-xs">{errors.country.message}</p>
                    )}
                </div>
            </div>
            <div>
                <Button 
                    className='w-full' 
                    type="submit" 
                    disabled={isLoading}>
                        {isLoading ? "Loading" : "Proceed and Pay"}
                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
            </div>
        </form>
    )
}