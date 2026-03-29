import { logoutAction } from "@/actions/authActions";
import { Clock, Milk } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-[420px]">
        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
          {/* TOP ACCENT */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-600 to-blue-500" />

          {/* LOGO */}
          <div className="w-14 h-14 rounded-2xl bg-green-700 flex items-center justify-center mx-auto mb-5 shadow-md">
            <Milk className="w-7 h-7 text-white" />
          </div>

          {/* ICON */}
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>

          {/* TITLE */}
          <h1 className="text-xl font-extrabold text-gray-900 mb-2">
            Pending Approval
          </h1>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Your account has been created successfully. Please wait for the
            admin to approve your account before you can continue.
          </p>

          {/* CONTACT */}
          <p className="text-xs text-gray-400 mb-6">
            Contact Ganesh Dairy to speed up your approval.
          </p>

          {/* BUTTON */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full bg-gray-100 hover:bg-gray-200 transition rounded-xl py-3 text-sm font-semibold text-gray-700 active:scale-95">
              Sign Out
            </button>
          </form>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-[11px] text-gray-400 mt-4">
          You’ll be notified once your account is approved
        </p>
      </div>
    </div>
  );
}
