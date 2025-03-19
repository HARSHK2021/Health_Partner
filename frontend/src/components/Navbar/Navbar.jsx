import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Home, Menu } from "lucide-react";
import { Button } from "@mui/material";
import { Sheet, Modal, ModalClose } from "@mui/joy";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const getStart = () => {
    navigate("/");
  }
  return (
    <header className="fixed w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/10">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-white">CMH</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="outlined"
            onClick={() => setIsOpen(true)}
            sx={{ minWidth: "auto", p: "6px" }}
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Mobile menu dropdown */}
          <Modal
            aria-labelledby="mobile-menu"
            open={isOpen}
            onClose={() => setIsOpen(false)}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              "& .MuiModal-backdrop": {
                backdropFilter: "blur(4px)",
              },
            }}
          >
            <Sheet
              sx={{
                minWidth: 300,
                borderRadius: "md",
                p: 2,
                height: "100%",
              }}
            >
              <ModalClose onClick={() => setIsOpen(false)} />
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/home"
                  className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors relative group py-2"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
                </Link>
              </nav>
            </Sheet>
          </Modal>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/#home"
            className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors relative group py-2"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
          </Link>
          <button
            onClick={getStart}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/25"
          >
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
}
