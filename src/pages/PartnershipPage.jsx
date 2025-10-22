
import { motion } from "framer-motion";
import { CheckCircle, Truck, Clock, Shield, Users, Mail, Phone, MapPin } from "lucide-react";

// Partnership Page Component
const PartnershipPage = () => {
    const benefits = [
        { icon: Truck, title: "Reliable Delivery", desc: "Scheduled deliveries that fit your business operations" },
        { icon: Clock, title: "Consistent Supply", desc: "Year-round availability of seasonal and non-seasonal produce" },
        { icon: Shield, title: "Quality Guarantee", desc: "100% fresh produce with refund policy on quality issues" },
        { icon: Users, title: "Dedicated Support", desc: "Personal account manager for all your needs" }
    ];

    const tiers = [
        {
            name: "Starter",
            minOrder: "100kg/month",
            discount: "5%",
            features: ["Weekly delivery", "Standard payment terms", "Email support", "Quality guarantee"]
        },
        {
            name: "Growth",
            minOrder: "500kg/month",
            discount: "10%",
            features: ["Bi-weekly delivery", "Extended payment terms", "Priority support", "Custom packaging", "Seasonal planning"],
            popular: true
        },
        {
            name: "Enterprise",
            minOrder: "1000kg/month",
            discount: "15%",
            features: ["Daily delivery available", "Flexible payment terms", "24/7 support", "White-label options", "Dedicated manager", "Custom contracts"]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative py-20 text-white overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://cdn.pixabay.com/photo/2016/11/29/06/15/tomatoes-1867744_1280.jpg')",
                    }}
                />

                {/* Green Overlay */}
                <div className="absolute inset-0 bg-green-700 opacity-70"></div>

                {/* Content */}
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl font-bold mb-6">Become Our Partner</h1>
                        <p className="text-xl text-green-100 mb-8">
                            Join successful retailers and wholesalers who trust us for their produce
                            supply
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        Partnership Benefits
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                            >
                                <benefit.icon className="w-10 h-10 text-green-600 mb-4" />
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{benefit.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnership Tiers */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                        Partnership Tiers
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
                        Choose the tier that fits your business needs
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {tiers.map((tier, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg ${tier.popular ? 'ring-2 ring-green-500 relative' : ''
                                    }`}
                            >
                                {tier.popular && (
                                    <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                )}
                                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{tier.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Min: {tier.minOrder}</p>
                                <div className="text-4xl font-bold text-green-600 mb-6">{tier.discount} <span className="text-lg">discount</span></div>
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="/quotation"
                                    className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${tier.popular
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    Get Started
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        Get In Touch
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Phone, label: "Call Us", value: "+234 800 123 4567" },
                            { icon: Mail, label: "Email Us", value: "partners@viridian.com" },
                            { icon: MapPin, label: "Visit Us", value: "Lagos, Nigeria" }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <item.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{item.label}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnershipPage