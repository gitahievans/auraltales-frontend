// app/success/page.jsx
import PaymentSuccessClient from "@/components/PaymentSuccess";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading payment verification...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
