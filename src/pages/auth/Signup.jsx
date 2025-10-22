import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        businessType: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(formData);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Business Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="contactPerson" placeholder="Contact Person" value={formData.contactPerson} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="businessType" placeholder="Business Type (e.g. Wholesale)" value={formData.businessType} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
