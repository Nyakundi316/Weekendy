import Card from "../../../components/ui/Card";
import EventGrid from "../../../components/ui/EventGrid";
import { Heart } from "lucide-react";
export default function SavedSection({ saved }) {
return (
<Card title="Saved Events" icon={<Heart size={18} />}>
<EventGrid items={saved} emptyText="You haven't saved any events yet." />
</Card>
);
}