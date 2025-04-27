"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { db } from "config/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            await addDoc(collection(db, "contacts"), {
                ...formData,
                createdAt: serverTimestamp(),
            })
            setSuccess(true)
            setFormData({ name: "", email: "", phone: "", message: "" })
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="contact" className="container py-12">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="mb-4 font-heading text-4xl">Contact Us</h2>
                <p className="mb-8 text-muted-foreground">
                    We&apos;d love to hear from you! Fill out the form below and we&apos;ll get back to you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="phone"
                        type="tel"
                        placeholder="Your Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <Textarea
                        name="message"
                        placeholder="Your Message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Sending..." : "Send Message"}
                    </Button>
                    {success && <p className="text-green-600">Message sent successfully!</p>}
                    {error && <p className="text-red-600">{error}</p>}
                </form>
            </div>
        </section>
    )
}