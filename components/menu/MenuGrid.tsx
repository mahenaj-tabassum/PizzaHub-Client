import { MenuItem } from "@/types";
import Reveal from "../shared/Reveal";
import MenuCard from "./MenuCard";

const MenuGrid = ({ items }: { items: MenuItem[] }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal key={item._id} delay={(index % 3) * 0.08} className="h-full">
          <MenuCard item={item} />
        </Reveal>
      ))}
    </div>
  );
};

export default MenuGrid;
