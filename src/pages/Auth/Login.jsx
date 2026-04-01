import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { motion } from "framer-motion";
import Logo from "../../assets/buddha avenue.png";

const circles = [
  { size: 120, top: "8%", left: "6%", opacity: 0.18 },
  { size: 60, top: "22%", left: "16%", opacity: 0.12 },
  { size: 40, top: "55%", left: "3%", opacity: 0.13 },
  { size: 160, top: "65%", left: "4%", opacity: 0.15 },
  { size: 50, top: "78%", left: "22%", opacity: 0.1 },
  { size: 80, top: "10%", right: "8%", opacity: 0.15 },
  { size: 45, top: "35%", right: "4%", opacity: 0.12 },
  { size: 100, top: "55%", right: "2%", opacity: 0.13 },
  { size: 55, top: "75%", right: "14%", opacity: 0.1 },
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hardcodedUsers = {
    "admin@shine.com": { password: "admin@123", role: "Admin", name: "Admin User", isActive: true },
    "staff@shine.com": { password: "staff@123", role: "Staff", name: "Staff User", isActive: true },
    "manager@shine.com": { password: "manager@123", role: "Admin", name: "Manager User", isActive: true },
  };

  const login = (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please enter both email and password!"); return; }
    const user = hardcodedUsers[email.trim()];
    if (!user) { toast.error("User not found!"); return; }
    if (user.password !== password.trim()) { toast.error("Incorrect password!"); return; }
    if (!user.isActive) { toast.error("This account is inactive!"); return; }
    localStorage.setItem("User", JSON.stringify(user));
    localStorage.setItem("currentUser", "true");
    localStorage.setItem("role", user.role);
    toast.success(`Welcome ${user.name}!`);
    setTimeout(() => { window.location.href = "/banquet/list-booking"; }, 1000);
  };

  useEffect(() => {
    if (localStorage.getItem("currentUser") === "true") navigate("/");
  }, [navigate]);

  return (
    <>
      <Toaster />
      {/* Full page dark olive background */}
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: "#4a3f1a" }}>

        {/* Floating circles */}
        {circles.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: c.opacity, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 1 }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: c.size, height: c.size,
              top: c.top, left: c.left, right: c.right,
              backgroundColor: "#6b5a1e",
            }}
          />
        ))}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: "#2c2510" }}
        >
          {/* Top header section */}
          <div className="flex flex-col items-center py-8 px-6" style={{ backgroundColor: "#3d3412" }}>
            <img src={Logo} alt="Buddha Avenue" className="w-16 h-16 object-contain mb-3" />
            <h1 className="text-2xl font-bold" style={{ color: "#c3ad6b" }}>Buddha Avenue</h1>
            <p className="text-sm mt-1" style={{ color: "#8a7a4a" }}>Management Portal</p>
          </div>

          {/* Form section */}
          <div className="px-8 py-8">
            <p className="text-center text-sm mb-6" style={{ color: "#8a7a4a" }}>Sign in to continue</p>

            <form onSubmit={login} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: "#c3ad6b" }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="you@buddha.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none border border-transparent focus:border-[#c3ad6b] transition-colors"
                  style={{ backgroundColor: "#1e1a0a", color: "#d4c07a", caretColor: "#c3ad6b" }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold tracking-widest mb-2" style={{ color: "#c3ad6b" }}>
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-lg text-sm outline-none border border-transparent focus:border-[#c3ad6b] transition-colors"
                    style={{ backgroundColor: "#1e1a0a", color: "#d4c07a", caretColor: "#c3ad6b" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#8a7a4a" }}
                  >
                    {showPassword ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg font-semibold text-base transition-all"
                style={{ background: "linear-gradient(135deg, #c3ad6b, #a08a4f)", color: "#1e1a0a" }}
              >
                Sign In
              </motion.button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ backgroundColor: "#3d3412" }}></div>
                <span className="text-xs" style={{ color: "#6b5a1e" }}>demo credentials</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "#3d3412" }}></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setEmail("admin@shine.com"); setPassword("admin@123"); }}
                  className="p-3 rounded-lg text-left transition-colors hover:opacity-80"
                  style={{ backgroundColor: "#1e1a0a" }}
                >
                  <p className="text-sm font-semibold" style={{ color: "#c3ad6b" }}>Admin</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b5a1e" }}>admin@shine.com</p>
                </button>
                <button
                  onClick={() => { setEmail("staff@shine.com"); setPassword("staff@123"); }}
                  className="p-3 rounded-lg text-left transition-colors hover:opacity-80"
                  style={{ backgroundColor: "#1e1a0a" }}
                >
                  <p className="text-sm font-semibold" style={{ color: "#c3ad6b" }}>Staff</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b5a1e" }}>staff@shine.com</p>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
