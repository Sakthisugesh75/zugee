// components/home/product-icons.js
// One simple lucide icon per product, for the hero icon row and the industry grid. Plain icons only:
// nothing here may look like the product's own screens.

import {
  BedDouble,
  Briefcase,
  Building2,
  Droplets,
  Factory,
  GraduationCap,
  Plane,
  School,
  TreePalm,
  Truck
} from "lucide-react";

const PRODUCT_ICONS = {
  "core-erp": Briefcase,
  transposs: Truck,
  "tours-travels": Plane,
  "aqua-erp": Droplets,
  "real-estate": Building2,
  manuflow: Factory,
  "school-erp": School,
  college: GraduationCap,
  "pg-management": BedDouble,
  resort: TreePalm
};

export function productIcon(slug) {
  return PRODUCT_ICONS[slug] || Briefcase;
}
