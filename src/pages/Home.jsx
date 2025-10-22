import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, Leaf, Users, TrendingUp, CheckCircle } from "lucide-react";

const Home = () => {
    const features = [
        { icon: Leaf, title: "Farm Fresh Quality", desc: "Directly from our fields to your business" },
        { icon: Truck, title: "Bulk Supply", desc: "Consistent volumes for retailers & wholesalers" },
        { icon: Shield, title: "Quality Assured", desc: "Certified organic and pesticide-free" },
        { icon: Users, title: "B2B Partnership", desc: "Dedicated support for bulk buyers" }
    ];

    const products = [
        { name: "Organic Vegetables", volume: "500+ kg/week", image: "/images/vegetables.webp" },
        { name: "Fresh Fruits", volume: "1000+ kg/week", image: "/images/fruits.webp" },
        { name: "Tubers Food", volume: "300+ kg/week", image: "/images/yam.webp" },
        { name: "Root Vegetables", volume: "600+ kg/week", image: "/images/ginger.webp" }
    ];

    const stats = [
        { number: "100+", label: "Retail Partners and counting" },
        { number: "20+", label: "Varieties Available" },
        { number: "99.8%", label: "On-Time Delivery" },
        { number: "5k+", label: "Tons Suppliable Yearly" }
    ];

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section with Video Background */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 z-0 w-full">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="https://cdn.pixabay.com/video/2022/10/25/136466-764399895_large.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 mx-auto px-4 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Farm Fresh Produce
                            <span className="block text-green-400">Direct to Your Business</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
                            Premium quality, bulk quantities. Partner with us for consistent supply of organic farm produce.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg hover:shadow-xl"
                            >
                                View Products
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/partnership"
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition border-2 border-white/50"
                            >
                                Become a Partner
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2" />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="bg-green-700 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-green-100">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Why Partner With Us?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Reliable supply chain for your business needs
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition"
                            >
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="text-green-600 dark:text-green-400" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Preview */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Our Supply Capacity
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Consistent volumes available for bulk orders
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-20 mx-auto"
                                />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white text-center">
                                    {product.name}
                                </h3>
                                <p className="text-green-600 dark:text-green-400 font-medium text-center">
                                    {product.volume}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
                        >
                            View Full Catalog
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Simple Partnership Process
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: "1", title: "Contact Us", desc: "Reach out to discuss your requirements" },
                            { step: "2", title: "Get Quote", desc: "Receive pricing for bulk quantities" },
                            { step: "3", title: "Regular Supply", desc: "Enjoy consistent farm-fresh deliveries" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative"
                            >
                                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white text-center">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-center">{item.desc}</p>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-green-200 dark:bg-green-800 -z-10" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6">
                            Ready to Partner With Us?
                        </h2>
                        <p className="text-xl mb-8 text-green-100">
                            Join hundreds of businesses enjoying reliable farm-fresh supply
                        </p>
                        <Link
                            to="/partnership"
                            className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
                        >
                            Start Your Partnership
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;