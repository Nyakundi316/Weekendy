// app/components/profile/sections/ReviewsSection.jsx
import Card from "../../ui/Card";
import { Star } from "lucide-react";

export default function ReviewsSection() {
  return (
    <Card title="My Reviews" icon={<Star size={18} />}>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Reviews will appear here after you rate events. (Frontend only)
      </div>
    </Card>
  );
}
