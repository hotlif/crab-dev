import type { PaginationProps } from '../types.js';
export const readonlyPage: PaginationProps = { total: 20, value: 1, pageSize: 10 };
// @ts-expect-error Controlled and default page values are mutually exclusive.
export const conflictingPage: PaginationProps = { total: 20, value: 1, defaultValue: 2 };
// @ts-expect-error Page size has its own independent controlled/default contract.
export const conflictingSize: PaginationProps = { total: 20, pageSize: 10, defaultPageSize: 20 };
