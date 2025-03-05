import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

const UnauthorizedPage = () => {
  return (
    <div className="max-w-md mx-auto w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-emerald-600 p-6 flex justify-center">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500 rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-400 rounded-full opacity-20"></div>
          <ShieldAlert size={80} className="text-white relative z-10" />
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <Lock size={20} className="text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Access Restricted
          </h1>
        </div>

        <p className="text-gray-600 mb-6">
          You do not have the necessary permissions to access this area. This
          section requires specific authorization that is not associated with
          your current account.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-sm text-emerald-800">
            <p className="font-medium mb-1">What might be the issue?</p>
            <ul className="list-disc list-inside space-y-1 text-emerald-700">
              <li>You need author or admin privileges</li>
              <li>Your session might have expired</li>
              <li>You might need to request access</li>
            </ul>
          </div>

          <Link
            href="/"
            className="group flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
