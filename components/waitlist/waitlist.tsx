"use client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Waitlist = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);

    console.log("Form data -->", formData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Hey", e);

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleJoinWaitlist = async () => {
        console.log("Hey your button is clicked atleast----}])>-");

        if (!formData.name || !formData.email || !formData.phone) {
            toast.error("Please fill all the fields.");
            return;
        }

        setLoading(true);

        try {
            const waitlistRef = collection(db, "waitlist");
            const q = query(waitlistRef, where("email", "==", formData.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast.error("You're already on the waitlist! 🎯");
            } else {
                await addDoc(waitlistRef, formData);
                toast.success("Welcome to the waitlist! 🎉");
                setFormData({ name: '', email: '', phone: '' });
            }
        } catch (error) {
            console.error("Error joining waitlist:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24" id="join-form">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Join the Eddiecare Waitlist
                </h2>
                <p className="mt-4 text-lg">
                    Be the first to experience a revolution in healthcare. Fill in your details below.
                </p>
            </div>

            <div className="mx-auto mt-12 max-w-xl space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md p-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md p-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md p-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                <div>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleJoinWaitlist}
                        className={cn(buttonVariants({ size: "sm" }), "w-full")}
                    >
                        {loading ? "Joining..." : "Join the Waitlist"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Waitlist;