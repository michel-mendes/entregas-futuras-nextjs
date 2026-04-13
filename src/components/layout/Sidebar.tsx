'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navigationConfig } from '@/config/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`bg-surface border-r border-border-subtle shadow-sm flex flex-col shrink-0 h-[100dvh] sticky top-0 overflow-hidden z-40 transition-all duration-300 ease-in-out ${collapsed ? 'w-[52px]' : 'w-[220px]'}`}
            aria-label="Navegação Principal"
        >
            <div className={`h-12 flex items-center border-b border-border-subtle shrink-0 gap-2 ${collapsed ? 'justify-center p-0' : 'justify-between px-4'}`}>
                {!collapsed && (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="w-[3px] h-5 bg-brand rounded-full shrink-0" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-primary leading-tight truncate">Acabamentos</p>
                            <p className="text-[10px] text-tertiary font-medium uppercase tracking-wide truncate">ERP Enterprise</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-7 h-7 rounded-sm text-tertiary hover:bg-subtle hover:text-primary shrink-0 transition-colors"
                >
                    {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-thin">
                {navigationConfig.map((group) => (
                    <div key={group.group} className="mb-4">
                        {!collapsed && (
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-disabled px-4 mb-1">{group.group}</p>
                        )}
                        <ul className="px-2 space-y-[2px]">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                const Icon = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            title={collapsed ? item.name : undefined}
                                            className={`flex items-center gap-2 rounded-sm text-sm no-underline whitespace-nowrap transition-colors ${collapsed ? 'justify-center py-2' : 'justify-start py-2 px-3'} ${isActive ? 'text-brand bg-brand-muted font-semibold border-l-2 border-brand' : 'text-secondary bg-transparent font-normal border-l-2 border-transparent hover:bg-subtle hover:text-primary'}`}
                                        >
                                            <Icon size={16} className={`shrink-0 ${isActive ? 'text-brand' : 'text-inherit'}`} />
                                            {!collapsed && <span className="truncate flex-1">{item.name}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}