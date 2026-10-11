// Configuração central de rotas do SideBar

import {
    Package,
    CalendarClock,
    Truck,
    Warehouse,
    Layers,
    LayoutDashboard,
    ShoppingCart,
    Users,
    BarChart2,
    Settings,
    Boxes
} from 'lucide-react';

export type NavItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string; // ex: "Novo", contagem de alertas
};

export type NavGroup = {
    group: string;
    items: NavItem[];
};

export const navigationConfig: NavGroup[] = [
    {
        group: 'Overview',
        items: [
            // { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        group: 'Inventory',
        items: [
            { name: 'Products', href: '/products', icon: Package },
            { name: 'Batches', href: '/batches', icon: Boxes }
        ],
    },
    {
        group: 'Operations',
        items: [
            { name: 'Future Deliveries', href: '/future-deliveries', icon: CalendarClock },
            { name: 'Delivery Receipts', href: '/delivery-receipts', icon: Truck },
            { name: 'Warehouses', href: '/warehouses', icon: Warehouse },
        ],
    },
    /*{
        group: 'Management',
        items: [
            // { name: 'Customers', href: '/customers', icon: Users },
            // { name: 'Reports', href: '/reports', icon: BarChart2 },
            // { name: 'Settings', href: '/settings', icon: Settings },
        ],
    },*/
];