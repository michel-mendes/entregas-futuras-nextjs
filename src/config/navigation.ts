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
        group: 'Visão Geral',
        items: [
            // Em desenvolvimento
            // { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        group: 'Estoque',
        items: [
            { name: 'Products', href: '/products', icon: Package },
            { name: 'Lotes', href: '/batches', icon: Boxes }
        ],
    },
    {
        group: 'Operações',
        items: [
            // Em desenvolvimento
            { name: 'Entregas Futuras', href: '/entregas-futuras', icon: CalendarClock },
            { name: 'Romaneios', href: '/romaneios', icon: Truck },
            { name: 'Warehouses', href: '/warehouses', icon: Warehouse },
            // { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart },
        ],
    },
    /*{
        group: 'Gestão',
        items: [
            // Em desenvolvimento
            // { name: 'Clientes', href: '/clientes', icon: Users },
            // { name: 'Relatórios', href: '/relatorios', icon: BarChart2 },
            // { name: 'Configurações', href: '/configuracoes', icon: Settings },
        ],
    },*/
];