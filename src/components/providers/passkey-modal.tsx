import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decryptKey, encryptKey } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { X } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Input } from "../ui/input";

export const PasskeyModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    const encryptedPasskey = localStorage.getItem("accessKey");
    const storedPasskey = encryptedPasskey && decryptKey(encryptedPasskey);

    if (location.pathname === "/admin") {
      if (
        storedPasskey === import.meta.env.VITE_ADMIN_PASSKEY &&
        storedEmail === import.meta.env.VITE_ADMIN_EMAIL
      ) {
        setOpen(false);
        navigate("/admin");
      } else {
        setOpen(true);
      }
    }
  }, [location.pathname, navigate]);

  const closeModal = () => {
    setOpen(false);
    navigate("/");
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === import.meta.env.VITE_ADMIN_PASSKEY && email === import.meta.env.VITE_ADMIN_EMAIL) {
      const encryptedKey = encryptKey(passkey);

      localStorage.setItem("accessKey", encryptedKey);
      localStorage.setItem("adminEmail", email);

      setOpen(false);
      navigate("/admin");
    } else {
      setError("Invalid email or passkey. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white  rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between text-xl font-semibold text-gray-900">
            Admin Access Verification
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X size={24} />
            </button>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 mt-2">
            To access the admin page, please enter your email and the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Input
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <div className="flex justify-center items-center w-full flex-col gap-4">
              <InputOTPGroup className="max-w-sm grid grid-cols-6 gap-2">
                <InputOTPSlot
                  className="shad-otp-slot bg-gray-100 border border-gray-300 rounded-lg p-2 text-center text-lg font-semibold"
                  index={0}
                />
                <InputOTPSlot
                  className="shad-otp-slot bg-gray-100 border border-gray-300 rounded-lg p-2 text-center text-lg font-semibold"
                  index={1}
                />
                <InputOTPSlot
                  className="shad-otp-slot bg-gray-100 border border-gray-300 rounded-lg p-2 text-center text-lg font-semibold"
                  index={2}
                />
                <InputOTPSlot
                  className="shad-otp-slot bg-gray-100 border border-gray-300 rounded-lg p-2 text-center text-lg font-semibold"
                  index={3}
                />
                <InputOTPSlot
                  className="shad-otp-slot bg-gray-100 border border-gray-300 rounded-lg p-2 text-center text-lg font-semibold"
                  index={4}
                />
                <InputOTPSlot
                  className="shad-otp-slot bg-gray-100 border border-gray-300 rounded-lg p-2 text-center text-lg font-semibold"
                  index={5}
                />
              </InputOTPGroup>
            </div>
          </InputOTP>

          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter className="mt-6">
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
