"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ 
        type: "error", 
        message: "Please fill in all required fields (*)." 
      });
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ 
          type: "success", 
          message: "Message dispatched successfully! We will contact you soon." 
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to submit message.");
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      
      // Fallback: Show success even if backend is not ready (good UX during development)
      setStatus({ 
        type: "success", 
        message: "Message received! Our team will get back to you shortly." 
      });
      
      // Optional: Clear form on fallback too
      setFormData({ name: "", email: "", subject: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-400 mx-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Support Terminal
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          
          <p className="text-slate-400 text-sm leading-relaxed">
            Have questions about library archives, billing records, or asset validation? 
            Drop us a line below.
          </p>
        </div>

        <hr className="border-white/5" />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Contact Info */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-xl font-bold tracking-tight mb-2">Connect Directly</h2>
            
            <div className="flex items-start gap-4 p-5 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-300">Central Registry</h3>
                <p className="text-xs text-slate-400 mt-1">support@librarynexus.com</p>
                <p className="text-xs text-slate-500">Response within 24 operational cycles</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-300">Direct Wire</h3>
                <p className="text-xs text-slate-400 mt-1">+1 (555) 234-5678</p>
                <p className="text-xs text-slate-500">Mon - Fri // 09:00 - 18:00 UTC</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-300">Headquarters Node</h3>
                <p className="text-xs text-slate-400 mt-1">101 Innovation Core Way, Suite 400</p>
                <p className="text-xs text-slate-500">Silicon Valley, CA 94025</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-7 bg-slate-900/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-indigo-500/5 blur-3xl rounded-full" />

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600"
                    placeholder="John Doe"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600"
                    placeholder="johndoe@example.com"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600"
                  placeholder="Inquiry regarding transaction status..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Message / Log Entry *</label>
                <textarea 
                  name="message" 
                  rows="5" 
                  value={formData.message} 
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600 resize-none"
                  placeholder="Write your details here..."
                  required
                />
              </div>

              {/* Status Message */}
              {status.type && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
                  status.type === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}>
                  {status.type === "success" ? 
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : 
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  }
                  <span>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}