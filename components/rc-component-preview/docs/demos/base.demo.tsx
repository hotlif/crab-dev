/**
 * title = "Shortcuts"
 * description = "卡片顶部展示组件，下方代码区默认收起，仅露出前几行并通过 View Code 按钮展开。"
 */

import Preview from '../../src/preview.js';

const sourceCode = `"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

export function OpenMenuButton() {
    return (
        <Button variant="outline" size="sm">
            Open Menu
        </Button>
    )
}
`;

const BaseDemo = () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 760 }}>
        <Preview
            title="Shortcuts"
            description="A simple button that toggles a menu, used as a quick action shortcut."
            path="https://example.com"
            sourceCode={sourceCode}
        >
            <button
                style={{
                    height: 36,
                    padding: '0 18px',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#111827',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                }}
            >
                Open Menu
            </button>
        </Preview>
    </div>
);

export default BaseDemo;
